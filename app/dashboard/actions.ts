"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { login, logout, requirePermission } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import {
  nextId,
  slugify,
  toList,
  getAllServices,
  getAllDoctors,
  getAllBlogs,
  getAllNews,
  getAllContacts,
  getAllAppointments,
  getAllPatients,
  getSiteSettings,
} from "@/lib/db";

const refreshSite = () => {
  revalidatePath("/", "layout");
  revalidatePath("/dashboard", "layout");
};

export async function loginAction(formData: FormData) {
  const identifier =
    formData.get("email")?.toString() ??
    formData.get("username")?.toString() ??
    "";
  const password = formData.get("password")?.toString() ?? "";

  const ok = await login(identifier, password);
  if (!ok) {
    redirect("/dashboard/login?error=1");
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await logout();
  redirect("/dashboard/login");
}

// ============================================
// Site Settings Actions
// ============================================

export async function updateHomeAction(formData: FormData) {
  await requirePermission("home");

  const homeData = {
    headline: formData.get("headline")?.toString() ?? "",
    subheadline: formData.get("subheadline")?.toString() ?? "",
    primaryCtaText: formData.get("primaryCtaText")?.toString() ?? "",
    primaryCtaLink: formData.get("primaryCtaLink")?.toString() ?? "",
    secondaryCtaText: formData.get("secondaryCtaText")?.toString() ?? "",
    secondaryCtaLink: formData.get("secondaryCtaLink")?.toString() ?? "",
    stats: [
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
    ],
  };

  await supabase
    .from("site_settings")
    .upsert({ key: "home", value: homeData, updated_at: new Date().toISOString() });

  refreshSite();
}

export async function updateAboutAction(formData: FormData) {
  await requirePermission("about");

  const aboutData = {
    title: formData.get("title")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    mission: formData.get("mission")?.toString() ?? "",
    vision: formData.get("vision")?.toString() ?? "",
    values: toList(formData.get("values")),
  };

  await supabase
    .from("site_settings")
    .upsert({ key: "about", value: aboutData, updated_at: new Date().toISOString() });

  refreshSite();
}

export async function updateContactAction(formData: FormData) {
  await requirePermission("contacts");

  const contactData = {
    address: formData.get("address")?.toString() ?? "",
    city: formData.get("city")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    mapUrl: formData.get("mapUrl")?.toString() ?? "",
    workingHours: {
      weekdays: formData.get("weekdaysHours")?.toString() ?? "",
      saturday: formData.get("saturdayHours")?.toString() ?? "",
      sunday: formData.get("sundayHours")?.toString() ?? "",
    },
  };

  await supabase
    .from("site_settings")
    .upsert({ key: "contact", value: contactData, updated_at: new Date().toISOString() });

  refreshSite();
}

// ============================================
// Services Actions
// ============================================

export async function saveServiceAction(formData: FormData) {
  await requirePermission("services");
  const id = formData.get("id")?.toString();

  const payload = {
    id: id || nextId("svc"),
    title: formData.get("title")?.toString() ?? "",
    summary: formData.get("summary")?.toString() ?? "",
    features: toList(formData.get("features")),
  };

  if (id) {
    await supabase.from("services").update(payload).eq("id", id);
  } else {
    await supabase.from("services").insert(payload);
  }

  refreshSite();
}

export async function deleteServiceAction(formData: FormData) {
  await requirePermission("services");
  const id = formData.get("id")?.toString();

  if (!id) return;

  await supabase.from("services").delete().eq("id", id);
  refreshSite();
}

// ============================================
// Doctors (Projects) Actions
// ============================================

export async function saveProjectAction(formData: FormData) {
  await requirePermission("projects");
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString() ?? "";

  // Parse available times from textarea or use default
  const availableTimesRaw = formData.get("availableTimes")?.toString() ?? "";
  const availableTimes = availableTimesRaw
    ? availableTimesRaw.split("\n").map(t => t.trim()).filter(Boolean)
    : ["8:00 am", "8:30 am", "9:00 am", "9:30 am", "10:00 am", "10:30 am", "11:00 am", "11:30 am"];

  const payload = {
    id: id || nextId("prj"),
    slug: slugify(formData.get("slug")?.toString() || title),
    title,
    excerpt: formData.get("excerpt")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    sector: formData.get("sector")?.toString() ?? "",
    location: formData.get("location")?.toString() ?? "",
    status: formData.get("status")?.toString() ?? "",
    cover_image: formData.get("coverImage")?.toString() ?? "",
    gallery: toList(formData.get("gallery")),
    details: toList(formData.get("details")),
    appointment_fee: parseFloat(formData.get("appointmentFee")?.toString() ?? "50") || 50,
    years_experience: parseInt(formData.get("yearsExperience")?.toString() ?? "0") || 0,
    available_times: availableTimes,
    created_at: formData.get("createdAt")?.toString() || new Date().toISOString(),
  };

  if (id) {
    await supabase.from("doctors").update(payload).eq("id", id);
  } else {
    await supabase.from("doctors").insert(payload);
  }

  refreshSite();
}

export async function deleteProjectAction(formData: FormData) {
  await requirePermission("projects");
  const id = formData.get("id")?.toString();

  if (!id) return;

  await supabase.from("doctors").delete().eq("id", id);
  refreshSite();
}

// ============================================
// Blogs Actions
// ============================================

export async function saveBlogAction(formData: FormData) {
  await requirePermission("blogs");
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString() ?? "";

  const payload = {
    id: id || nextId("blg"),
    slug: slugify(formData.get("slug")?.toString() || title),
    title,
    excerpt: formData.get("excerpt")?.toString() ?? "",
    content: formData.get("content")?.toString() ?? "",
    author: formData.get("author")?.toString() ?? "",
    published_at: formData.get("publishedAt")?.toString() || new Date().toISOString().slice(0, 10),
    tags: toList(formData.get("tags")),
  };

  if (id) {
    await supabase.from("blogs").update(payload).eq("id", id);
  } else {
    await supabase.from("blogs").insert(payload);
  }

  refreshSite();
}

export async function deleteBlogAction(formData: FormData) {
  await requirePermission("blogs");
  const id = formData.get("id")?.toString();

  if (!id) return;

  await supabase.from("blogs").delete().eq("id", id);
  refreshSite();
}

// ============================================
// News Actions
// ============================================

export async function saveNewsAction(formData: FormData) {
  await requirePermission("news");
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString() ?? "";

  const payload = {
    id: id || nextId("nws"),
    slug: slugify(formData.get("slug")?.toString() || title),
    title,
    excerpt: formData.get("excerpt")?.toString() ?? "",
    content: formData.get("content")?.toString() ?? "",
    source: formData.get("source")?.toString() ?? "",
    published_at: formData.get("publishedAt")?.toString() || new Date().toISOString().slice(0, 10),
  };

  if (id) {
    await supabase.from("news").update(payload).eq("id", id);
  } else {
    await supabase.from("news").insert(payload);
  }

  refreshSite();
}

export async function deleteNewsAction(formData: FormData) {
  await requirePermission("news");
  const id = formData.get("id")?.toString();

  if (!id) return;

  await supabase.from("news").delete().eq("id", id);
  refreshSite();
}

// ============================================
// Dashboard Counts
// ============================================

export async function getDashboardCounts() {
  const [services, doctors, blogs, news, contacts, appointments, patients] = await Promise.all([
    getAllServices(),
    getAllDoctors(),
    getAllBlogs(),
    getAllNews(),
    getAllContacts(),
    getAllAppointments(),
    getAllPatients(),
  ]);

  return {
    services: services.length,
    projects: doctors.length,
    blogs: blogs.length,
    news: news.length,
    contacts: contacts.length,
    interests: appointments.length,
    patients: patients.length,
  };
}

// ============================================
// Patient Management Actions
// ============================================

export async function savePatientAction(formData: FormData) {
  await requirePermission("patients");
  const id = formData.get("id")?.toString();

  const payload = {
    id: id || nextId("pat"),
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    address: formData.get("address")?.toString() ?? "",
    date_of_birth: formData.get("dateOfBirth")?.toString() ?? "",
    gender: formData.get("gender")?.toString() ?? "",
    medical_history: formData.get("medicalHistory")?.toString() ?? "",
    created_at: new Date().toISOString(),
  };

  if (id) {
    const { created_at, ...updatePayload } = payload;
    await supabase.from("patients").update(updatePayload).eq("id", id);
  } else {
    await supabase.from("patients").insert(payload);
  }

  refreshSite();
}

export async function savePatientWithAppointmentAction(formData: FormData) {
  await requirePermission("patients");

  // Create patient
  const patientId = nextId("pat");
  const patient = {
    id: patientId,
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    address: formData.get("address")?.toString() ?? "",
    date_of_birth: formData.get("dateOfBirth")?.toString() ?? "",
    gender: formData.get("gender")?.toString() ?? "",
    medical_history: formData.get("medicalHistory")?.toString() ?? "",
    created_at: new Date().toISOString(),
  };

  await supabase.from("patients").insert(patient);

  // Add appointment if requested
  const includeAppointment = formData.get("includeAppointment")?.toString() === "true";
  if (includeAppointment) {
    const doctorId = formData.get("doctorId")?.toString();

    if (doctorId) {
      // Get doctor info
      const { data: doctor } = await supabase
        .from("doctors")
        .select("title")
        .eq("id", doctorId)
        .single();

      if (doctor) {
        const appointment = {
          id: nextId("apt"),
          patient_id: patientId,
          doctor_id: doctorId,
          doctor_name: doctor.title,
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
          location: "",
          service: "",
          appointment_date: formData.get("appointmentDate")?.toString() ?? "",
          appointment_time: formData.get("appointmentTime")?.toString() ?? "",
          message: formData.get("appointmentNotes")?.toString() ?? "",
          status: "Scheduled",
          notes: "",
          created_at: new Date().toISOString(),
        };

        await supabase.from("appointments").insert(appointment);
      }
    }
  }

  refreshSite();
}

export async function deletePatientAction(formData: FormData) {
  await requirePermission("patients");
  const id = formData.get("id")?.toString();

  if (!id) return;

  await supabase.from("patients").delete().eq("id", id);
  refreshSite();
}

export async function addAppointmentAction(formData: FormData) {
  await requirePermission("patients");
  const patientId = formData.get("patientId")?.toString();
  const doctorId = formData.get("doctorId")?.toString();

  if (!patientId || !doctorId) return;

  // Get patient and doctor info
  const [patientResult, doctorResult] = await Promise.all([
    supabase.from("patients").select("name, email, phone").eq("id", patientId).single(),
    supabase.from("doctors").select("title").eq("id", doctorId).single(),
  ]);

  if (!patientResult.data || !doctorResult.data) return;

  const appointment = {
    id: nextId("apt"),
    patient_id: patientId,
    doctor_id: doctorId,
    doctor_name: doctorResult.data.title,
    name: patientResult.data.name,
    email: patientResult.data.email,
    phone: patientResult.data.phone || "",
    location: "",
    service: "",
    appointment_date: formData.get("date")?.toString() ?? "",
    appointment_time: formData.get("time")?.toString() ?? "",
    message: formData.get("notes")?.toString() ?? "",
    status: "Scheduled",
    notes: "",
    created_at: new Date().toISOString(),
  };

  await supabase.from("appointments").insert(appointment);
  refreshSite();
}

export async function updateAppointmentStatusAction(formData: FormData) {
  await requirePermission("patients");
  const appointmentId = formData.get("appointmentId")?.toString();
  const status = formData.get("status")?.toString();

  if (!appointmentId || !status) return;

  await supabase.from("appointments").update({ status }).eq("id", appointmentId);
  refreshSite();
}

export async function deleteAppointmentAction(formData: FormData) {
  await requirePermission("patients");
  const appointmentId = formData.get("appointmentId")?.toString();

  if (!appointmentId) return;

  await supabase.from("appointments").delete().eq("id", appointmentId);
  refreshSite();
}

// ============================================
// Contacts Actions
// ============================================

export async function deleteContactAction(formData: FormData) {
  await requirePermission("contacts");
  const id = formData.get("id")?.toString();

  if (!id) return;

  await supabase.from("contacts").delete().eq("id", id);
  refreshSite();
}

// ============================================
// Interests (Appointments) Actions
// ============================================

export async function deleteInterestAction(formData: FormData) {
  await requirePermission("interests");
  const id = formData.get("id")?.toString();

  if (!id) return;

  await supabase.from("appointments").delete().eq("id", id);
  refreshSite();
}
