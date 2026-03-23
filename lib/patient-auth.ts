import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findPatientByCredentials } from "./db";

const COOKIE_NAME = "patient_session";
const SECRET = process.env.PATIENT_SESSION_SECRET ?? process.env.SESSION_SECRET ?? "replace-this-in-production";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export type PatientSession = {
  id: string;
  name: string;
  email: string;
  exp: number;
};

function sign(payload: string) {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

function encode(payload: PatientSession) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function decode(token: string | undefined): PatientSession | null {
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
    ) as PatientSession;

    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function createPatientSession(patient: {
  id: string;
  name: string;
  email: string;
}) {
  const payload: PatientSession = {
    id: patient.id,
    name: patient.name,
    email: patient.email,
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
}

export async function patientLogin(email: string, password: string) {
  const patient = await findPatientByCredentials(email, password);
  if (!patient) {
    return false;
  }

  await createPatientSession(patient);
  return true;
}

export async function logoutPatient() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getPatientSession() {
  const store = await cookies();
  return decode(store.get(COOKIE_NAME)?.value);
}

export async function requirePatient(nextPath = "/appointments") {
  const patient = await getPatientSession();
  if (!patient) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return patient;
}
