import { promises as fs } from "node:fs";
import path from "node:path";

export type Permission =
  | "all"
  | "home"
  | "about"
  | "services"
  | "projects"
  | "blogs"
  | "news"
  | "contacts"
  | "interests"
  | "patients";

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: string;
  permissions: Permission[];
};

export type SiteData = {
  home: {
    headline: string;
    subheadline: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    stats: { label: string; value: string }[];
  };
  about: {
    title: string;
    description: string;
    mission: string;
    vision: string;
    values: string[];
  };
  services: {
    id: string;
    title: string;
    summary: string;
    features: string[];
  }[];
  projects: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    description: string;
    sector: string;
    location: string;
    status: string;
    coverImage: string;
    gallery: string[];
    details: string[];
    createdAt: string;
  }[];
  blogs: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    publishedAt: string;
    tags: string[];
  }[];
  news: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    publishedAt: string;
    source: string;
  }[];
  contacts: {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    createdAt: string;
  }[];
  interests: {
    id: string;
    projectId: string;
    projectTitle: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    budget: string;
    date: string;
    time: string;
    message: string;
    createdAt: string;
  }[];
  patients: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    gender: string;
    medicalHistory: string;
    appointments: {
      id: string;
      doctorId: string;
      doctorName: string;
      date: string;
      time: string;
      status: string;
      notes: string;
    }[];
    createdAt: string;
  }[];
  users: User[];
};

const dbPath = path.join(process.cwd(), "data", "cms.json");

const createId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export async function readData(): Promise<SiteData> {
  const raw = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(raw) as SiteData;
}

export async function writeData(data: SiteData) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
}

export async function updateData(mutator: (data: SiteData) => void) {
  const data = await readData();
  mutator(data);
  await writeData(data);
}

export async function findUser(identifier: string, password: string) {
  const data = await readData();
  return data.users.find(
    (user) =>
      (user.username === identifier || user.email === identifier) &&
      user.password === password,
  );
}

export function toList(value: FormDataEntryValue | null) {
  return (value?.toString() ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function nextId(prefix: string) {
  return createId(prefix);
}
