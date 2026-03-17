import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findUser, Permission, User } from "./cms";

const COOKIE_NAME = "cms_session";
const SECRET = process.env.SESSION_SECRET ?? "replace-this-in-production";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

type SessionPayload = {
  id: string;
  username: string;
  name: string;
  role: string;
  permissions: Permission[];
  exp: number;
};

function sign(payload: string) {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

function encode(payload: SessionPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function decode(token: string | undefined): SessionPayload | null {
  if (!token) {
    return null;
  }

  const [body, sig] = token.split(".");
  if (!body || !sig) {
    return null;
  }

  const expected = sign(body);
  const sigBuffer = Buffer.from(sig);
  const expectedBuffer = Buffer.from(expected);
  if (sigBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf-8"),
    ) as SessionPayload;

    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function login(username: string, password: string) {
  const user = await findUser(username, password);
  if (!user) {
    return false;
  }

  const payload: SessionPayload = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    permissions: user.permissions,
    exp: Date.now() + SESSION_TTL_MS,
  };

  const store = await cookies();
  store.set(COOKIE_NAME, encode(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });

  return true;
}

export async function logout() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSessionUser() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return decode(token);
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/dashboard/login");
  }
  return user;
}

export async function requirePermission(permission: Permission) {
  const user = await requireUser();
  if (
    !user.permissions.includes("all") &&
    !user.permissions.includes(permission)
  ) {
    redirect("/dashboard?forbidden=1");
  }
  return user;
}

export function canAccess(user: Pick<User, "permissions"> | SessionPayload, permission: Permission) {
  return user.permissions.includes("all") || user.permissions.includes(permission);
}