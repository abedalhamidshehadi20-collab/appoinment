"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { login, logout, requirePermission } from "@/lib/auth";
import { nextId, readData, slugify, toList, updateData } from "@/lib/cms";

const refreshSite = () => {
  revalidatePath("/", "layout");
  revalidatePath("/dashboard", "layout");
};

export async function loginAction(formData: FormData) {
  const username = formData.get("username")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  const ok = await login(username, password);
  if (!ok) {
    redirect("/dashboard/login?error=1");
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await logout();
  redirect("/dashboard/login");
}

export async function updateHomeAction(formData: FormData) {
  await requirePermission("home");

  await updateData((data) => {
    data.home.headline = formData.get("headline")?.toString() ?? "";
    data.home.subheadline = formData.get("subheadline")?.toString() ?? "";
    data.home.primaryCtaText = formData.get("primaryCtaText")?.toString() ?? "";
    data.home.primaryCtaLink = formData.get("primaryCtaLink")?.toString() ?? "";
    data.home.secondaryCtaText = formData.get("secondaryCtaText")?.toString() ?? "";
    data.home.secondaryCtaLink = formData.get("secondaryCtaLink")?.toString() ?? "";
    data.home.stats = [
      {
        label: formData.get("stat1Label")?.toString() ?? "",
        value: formData.get("stat1Value")?.toString() ?? "",
      },
      {
        label: formData.get("stat2Label")?.toString() ?? "",
        value: formData.get("stat2Value")?.toString() ?? "",
      },
      {
        label: formData.get("stat3Label")?.toString() ?? "",
        value: formData.get("stat3Value")?.toString() ?? "",
      },
    ];
  });

  refreshSite();
}

export async function updateAboutAction(formData: FormData) {
  await requirePermission("about");

  await updateData((data) => {
    data.about.title = formData.get("title")?.toString() ?? "";
    data.about.description = formData.get("description")?.toString() ?? "";
    data.about.mission = formData.get("mission")?.toString() ?? "";
    data.about.vision = formData.get("vision")?.toString() ?? "";
    data.about.values = toList(formData.get("values"));
  });

  refreshSite();
}

export async function saveServiceAction(formData: FormData) {
  await requirePermission("services");
  const id = formData.get("id")?.toString();

  await updateData((data) => {
    const payload = {
      id: id || nextId("svc"),
      title: formData.get("title")?.toString() ?? "",
      summary: formData.get("summary")?.toString() ?? "",
      features: toList(formData.get("features")),
    };

    const existingIndex = data.services.findIndex((service) => service.id === id);
    if (existingIndex >= 0) {
      data.services[existingIndex] = payload;
      return;
    }

    data.services.unshift(payload);
  });

  refreshSite();
}

export async function deleteServiceAction(formData: FormData) {
  await requirePermission("services");
  const id = formData.get("id")?.toString();

  if (!id) {
    return;
  }

  await updateData((data) => {
    data.services = data.services.filter((service) => service.id !== id);
  });

  refreshSite();
}

export async function saveProjectAction(formData: FormData) {
  await requirePermission("projects");
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString() ?? "";

  await updateData((data) => {
    const payload = {
      id: id || nextId("prj"),
      slug: slugify(formData.get("slug")?.toString() || title),
      title,
      excerpt: formData.get("excerpt")?.toString() ?? "",
      description: formData.get("description")?.toString() ?? "",
      sector: formData.get("sector")?.toString() ?? "",
      location: formData.get("location")?.toString() ?? "",
      status: formData.get("status")?.toString() ?? "",
      coverImage: formData.get("coverImage")?.toString() ?? "",
      gallery: toList(formData.get("gallery")),
      details: toList(formData.get("details")),
      createdAt: formData.get("createdAt")?.toString() || new Date().toISOString(),
    };

    const existingIndex = data.projects.findIndex((project) => project.id === id);
    if (existingIndex >= 0) {
      data.projects[existingIndex] = payload;
      return;
    }

    data.projects.unshift(payload);
  });

  refreshSite();
}

export async function deleteProjectAction(formData: FormData) {
  await requirePermission("projects");
  const id = formData.get("id")?.toString();

  if (!id) {
    return;
  }

  await updateData((data) => {
    data.projects = data.projects.filter((project) => project.id !== id);
  });

  refreshSite();
}

export async function saveBlogAction(formData: FormData) {
  await requirePermission("blogs");
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString() ?? "";

  await updateData((data) => {
    const payload = {
      id: id || nextId("blg"),
      slug: slugify(formData.get("slug")?.toString() || title),
      title,
      excerpt: formData.get("excerpt")?.toString() ?? "",
      content: formData.get("content")?.toString() ?? "",
      author: formData.get("author")?.toString() ?? "",
      publishedAt:
        formData.get("publishedAt")?.toString() ||
        new Date().toISOString().slice(0, 10),
      tags: toList(formData.get("tags")),
    };

    const existingIndex = data.blogs.findIndex((post) => post.id === id);
    if (existingIndex >= 0) {
      data.blogs[existingIndex] = payload;
      return;
    }

    data.blogs.unshift(payload);
  });

  refreshSite();
}

export async function deleteBlogAction(formData: FormData) {
  await requirePermission("blogs");
  const id = formData.get("id")?.toString();
  if (!id) {
    return;
  }

  await updateData((data) => {
    data.blogs = data.blogs.filter((post) => post.id !== id);
  });

  refreshSite();
}

export async function saveNewsAction(formData: FormData) {
  await requirePermission("news");
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString() ?? "";

  await updateData((data) => {
    const payload = {
      id: id || nextId("nws"),
      slug: slugify(formData.get("slug")?.toString() || title),
      title,
      excerpt: formData.get("excerpt")?.toString() ?? "",
      content: formData.get("content")?.toString() ?? "",
      source: formData.get("source")?.toString() ?? "",
      publishedAt:
        formData.get("publishedAt")?.toString() ||
        new Date().toISOString().slice(0, 10),
    };

    const existingIndex = data.news.findIndex((item) => item.id === id);
    if (existingIndex >= 0) {
      data.news[existingIndex] = payload;
      return;
    }

    data.news.unshift(payload);
  });

  refreshSite();
}

export async function deleteNewsAction(formData: FormData) {
  await requirePermission("news");
  const id = formData.get("id")?.toString();
  if (!id) {
    return;
  }

  await updateData((data) => {
    data.news = data.news.filter((item) => item.id !== id);
  });

  refreshSite();
}

export async function getDashboardCounts() {
  const data = await readData();
  return {
    services: data.services.length,
    projects: data.projects.length,
    blogs: data.blogs.length,
    news: data.news.length,
    contacts: data.contacts.length,
    interests: data.interests.length,
  };
}
