"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { login, logout, requirePermission } from "@/lib/auth";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { getSafeDoctorImageSrc } from "@/lib/image";
import {
  nextId,
  slugify,
  toList,
  isDoctorTimeSlotAvailable,
  getAllServices,
  getAllDoctors,
  getAllBlogs,
  getAllNews,
  getAllContacts,
  getAllAppointments,
  getAllPatients,
  getCustomRoles,
  deleteContact,
  type Permission,
  type CustomRole,
} from "@/lib/db";

const refreshSite = () => {
  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/appointments");
  revalidatePath("/blog");
  revalidatePath("/contact");
  revalidatePath("/doctors");
  revalidatePath("/news");
  revalidatePath("/projects");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/about");
  revalidatePath("/dashboard/blogs");
  revalidatePath("/dashboard/news");
  revalidatePath("/dashboard/home");
  revalidatePath("/dashboard/contacts");
  revalidatePath("/dashboard/projects");
};

function isMissingDoctorCredentialsTableError(error: { code?: string; message?: string } | null) {
  if (!error) {
    return false;
  }

  const message = error.message?.toLowerCase() ?? "";
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    message.includes('relation "doctor_credentials" does not exist') ||
    message.includes("could not find the table")
  );
}

function isDoctorCredentialAccessDenied(error: { code?: string; message?: string } | null) {
  if (!error) {
    return false;
  }

  const message = error.message?.toLowerCase() ?? "";
  return error.code === "42501" || message.includes("permission denied");
}

function isDoctorCredentialEmailTaken(error: { code?: string } | null) {
  return error?.code === "23505";
}

async function insertDoctorCredentialRecord(payload: {
  id: string;
  doctor_id: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
}) {
  const { error } = await supabase
    .from("doctor_credentials")
    .insert(payload);

  if (error?.code === "42501" && supabaseAdmin) {
    const { error: adminError } = await supabaseAdmin
      .from("doctor_credentials")
      .insert(payload);

    return adminError;
  }

  return error;
}

async function deleteDoctorRecord(id: string) {
  const { error } = await supabase
    .from("doctors")
    .delete()
    .eq("id", id);

  if (error?.code === "42501" && supabaseAdmin) {
    const { error: adminError } = await supabaseAdmin
      .from("doctors")
      .delete()
      .eq("id", id);

    if (adminError) {
      throw adminError;
    }

    return;
  }

  if (error) {
    throw error;
  }
}

async function upsertSiteSetting(
  key: "home" | "about" | "contact" | "custom_roles",
  value: unknown,
) {
  const payload = { key, value, updated_at: new Date().toISOString() };

  const { error } = await supabase
    .from("site_settings")
    .upsert(payload);

  if (error?.code === "42501" && supabaseAdmin) {
    const { error: adminError } = await supabaseAdmin
      .from("site_settings")
      .upsert(payload);

    if (adminError) {
      throw adminError;
    }

    return;
  }

  if (error) {
    throw error;
  }
}

export async function loginAction(formData: FormData) {
  const identifier =
    formData.get("email")?.toString() ??
    formData.get("username")?.toString() ??
    "";
  const password = formData.get("password")?.toString() ?? "";
  const next = formData.get("next")?.toString() || "/dashboard";

  const ok = await login(identifier, password);
  if (!ok) {
    redirect(`/dashboard/login?error=1&next=${encodeURIComponent(next)}`);
  }

  redirect(next);
}

export async function logoutAction() {
  await logout();
  redirect("/");
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

  await upsertSiteSetting("home", homeData);

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

  await upsertSiteSetting("about", aboutData);

  refreshSite();
}

export async function updateContactAction(formData: FormData) {
  await requirePermission("home");

  const contactData = {
    address: formData.get("address")?.toString() ?? "",
    city: formData.get("city")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    mapUrl: formData.get("mapUrl")?.toString() ?? "",
    mapLinkUrl: formData.get("mapLinkUrl")?.toString() ?? "",
    mapLinkLabel: formData.get("mapLinkLabel")?.toString() ?? "",
    workingHours: {
      weekdays: formData.get("weekdaysHours")?.toString() ?? "",
      saturday: formData.get("saturdayHours")?.toString() ?? "",
      sunday: formData.get("sundayHours")?.toString() ?? "",
    },
    topBar: {
      phoneTitle: formData.get("phoneTitle")?.toString() ?? "",
      phoneText: formData.get("phoneText")?.toString() ?? "",
      emailTitle: formData.get("emailTitle")?.toString() ?? "",
      emailText: formData.get("emailText")?.toString() ?? "",
      locationTitle: formData.get("locationTitle")?.toString() ?? "",
      locationText: formData.get("locationText")?.toString() ?? "",
    },
    footer: {
      brandName: formData.get("brandName")?.toString() ?? "",
      connectTitle: formData.get("connectTitle")?.toString() ?? "",
      quickLinksTitle: formData.get("quickLinksTitle")?.toString() ?? "",
      treatmentsTitle: formData.get("treatmentsTitle")?.toString() ?? "",
      treatments: toList(formData.get("treatments")),
      mapSectionTitle: formData.get("mapSectionTitle")?.toString() ?? "",
      copyright: formData.get("copyright")?.toString() ?? "",
      facebookUrl: formData.get("facebookUrl")?.toString() ?? "",
      instagramUrl: formData.get("instagramUrl")?.toString() ?? "",
      whatsappUrl: formData.get("whatsappUrl")?.toString() ?? "",
    },
  };

  await upsertSiteSetting("contact", contactData);

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
  const doctorCredentialEmail =
    formData.get("doctorCredentialEmail")?.toString().trim().toLowerCase() ?? "";
  const doctorCredentialPassword = formData.get("doctorCredentialPassword")?.toString() ?? "";
  const shouldCreateCredential = !id && !!doctorCredentialEmail;

  if (!id && doctorCredentialPassword && !doctorCredentialEmail) {
    redirect("/dashboard/projects?credential_error=missing_fields");
  }

  if (!id && doctorCredentialEmail && !doctorCredentialPassword) {
    redirect("/dashboard/projects?credential_error=password_required");
  }

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
    cover_image: getSafeDoctorImageSrc(formData.get("coverImage")?.toString()),
    gallery: toList(formData.get("gallery")),
    details: toList(formData.get("details")),
    appointment_fee: parseFloat(formData.get("appointmentFee")?.toString() ?? "50") || 50,
    years_experience: parseInt(formData.get("yearsExperience")?.toString() ?? "0") || 0,
    available_times: availableTimes,
  };

  const fallbackPayload = {
    id: payload.id,
    slug: payload.slug,
    title: payload.title,
    excerpt: payload.excerpt,
    description: payload.description,
    sector: payload.sector,
    location: payload.location,
    status: payload.status,
    cover_image: payload.cover_image,
    gallery: payload.gallery,
    details: payload.details,
  };

  const isMissingColumnError = (error: { code?: string; message?: string } | null) => {
    if (!error) {
      return false;
    }

    if (error.code !== "PGRST204") {
      return false;
    }

    const message = error.message?.toLowerCase() ?? "";
    return (
      message.includes("appointment_fee") ||
      message.includes("years_experience") ||
      message.includes("available_times")
    );
  };

  if (id) {
    const { error } = await supabase.from("doctors").update(payload).eq("id", id);

    if (isMissingColumnError(error)) {
      const { error: fallbackError } = await supabase
        .from("doctors")
        .update(fallbackPayload)
        .eq("id", id);

      if (fallbackError?.code === "42501" && supabaseAdmin) {
        const { error: adminFallbackError } = await supabaseAdmin
          .from("doctors")
          .update(fallbackPayload)
          .eq("id", id);

        if (adminFallbackError) {
          throw adminFallbackError;
        }
      } else if (fallbackError) {
        throw fallbackError;
      }

      refreshSite();
      return;
    }

    if (error?.code === "42501" && supabaseAdmin) {
      const { error: adminError } = await supabaseAdmin.from("doctors").update(payload).eq("id", id);
      if (adminError) {
        throw adminError;
      }
    } else if (error) {
      throw error;
    }
  } else {
    const createdAt = new Date().toISOString();
    const insertPayload = {
      ...payload,
      created_at: createdAt,
    };

    const { error } = await supabase.from("doctors").insert(insertPayload);

    if (isMissingColumnError(error)) {
      const fallbackInsertPayload = {
        ...fallbackPayload,
        created_at: createdAt,
      };

      const { error: fallbackError } = await supabase.from("doctors").insert(fallbackInsertPayload);

      if (fallbackError?.code === "42501" && supabaseAdmin) {
        const { error: adminFallbackError } = await supabaseAdmin.from("doctors").insert(fallbackInsertPayload);
        if (adminFallbackError) {
          throw adminFallbackError;
        }
      } else if (fallbackError) {
        throw fallbackError;
      }
    }
    else if (error?.code === "42501" && supabaseAdmin) {
      const { error: adminError } = await supabaseAdmin.from("doctors").insert(insertPayload);
      if (adminError) {
        throw adminError;
      }
    } else if (error) {
      throw error;
    }

    if (shouldCreateCredential) {
      const credentialError = await insertDoctorCredentialRecord({
        id: nextId("dcr"),
        doctor_id: payload.id,
        email: doctorCredentialEmail,
        password: doctorCredentialPassword,
        created_at: createdAt,
        updated_at: createdAt,
      });

      if (credentialError) {
        await deleteDoctorRecord(payload.id);

        if (isMissingDoctorCredentialsTableError(credentialError)) {
          redirect("/dashboard/projects?credential_error=doctor_credentials_missing");
        }

        if (isDoctorCredentialAccessDenied(credentialError)) {
          redirect("/dashboard/projects?credential_error=doctor_credentials_access_denied");
        }

        if (isDoctorCredentialEmailTaken(credentialError)) {
          redirect("/dashboard/projects?credential_error=email_taken");
        }

        throw credentialError;
      }
    }
  }

  refreshSite();
}

export async function deleteProjectAction(formData: FormData) {
  await requirePermission("projects");
  const id = formData.get("id")?.toString();

  if (!id) return;

  const { error } = await supabase.from("doctors").delete().eq("id", id);

  if (error?.code === "42501" && supabaseAdmin) {
    const { error: adminError } = await supabaseAdmin.from("doctors").delete().eq("id", id);
    if (adminError) {
      throw adminError;
    }
  } else if (error) {
    throw error;
  }

  refreshSite();
}

export async function saveDoctorCredentialAction(formData: FormData) {
  await requirePermission("projects");

  const credentialId = formData.get("credentialId")?.toString();
  const doctorId = formData.get("doctorId")?.toString();
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const timestamp = new Date().toISOString();

  if (!doctorId || !email) {
    redirect("/dashboard/projects?credential_error=missing_fields");
  }

  const handleCredentialError = (error: { code?: string; message?: string } | null) => {
    if (!error) {
      return;
    }

    if (isMissingDoctorCredentialsTableError(error)) {
      redirect("/dashboard/projects?credential_error=doctor_credentials_missing");
    }

    if (isDoctorCredentialAccessDenied(error)) {
      redirect("/dashboard/projects?credential_error=doctor_credentials_access_denied");
    }

    if (isDoctorCredentialEmailTaken(error)) {
      redirect("/dashboard/projects?credential_error=email_taken");
    }

    throw error;
  };

  if (credentialId) {
    const updates: Record<string, string> = {
      email,
      updated_at: timestamp,
    };

    if (password) {
      updates.password = password;
    }

    const { error } = await supabase
      .from("doctor_credentials")
      .update(updates)
      .eq("id", credentialId)
      .eq("doctor_id", doctorId);

    if (error?.code === "42501" && supabaseAdmin) {
      const { error: adminError } = await supabaseAdmin
        .from("doctor_credentials")
        .update(updates)
        .eq("id", credentialId)
        .eq("doctor_id", doctorId);

      handleCredentialError(adminError);
    } else {
      handleCredentialError(error);
    }
  } else {
    if (!password) {
      redirect("/dashboard/projects?credential_error=password_required");
    }

    const payload = {
      id: nextId("dcr"),
      doctor_id: doctorId,
      email,
      password,
      created_at: timestamp,
      updated_at: timestamp,
    };

    const error = await insertDoctorCredentialRecord(payload);
    handleCredentialError(error);
  }

  refreshSite();
  redirect("/dashboard/projects?credential_success=1");
}

// ============================================
// Blogs Actions
// ============================================

export async function saveBlogAction(formData: FormData) {
  await requirePermission("blogs");
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString() ?? "";
  const publishedAtRaw = formData.get("publishedAt")?.toString().trim() ?? "";

  const toSafePublishedAt = (value: string) => {
    if (!value) {
      return new Date().toISOString().slice(0, 10);
    }

    const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
    if (dateOnlyPattern.test(value)) {
      return value;
    }

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }

    return new Date().toISOString().slice(0, 10);
  };

  const payload = {
    id: id || nextId("blg"),
    slug: slugify(formData.get("slug")?.toString() || title),
    title,
    excerpt: formData.get("excerpt")?.toString() ?? "",
    content: formData.get("content")?.toString() ?? "",
    author: formData.get("author")?.toString() ?? "",
    published_at: toSafePublishedAt(publishedAtRaw),
    tags: toList(formData.get("tags")),
  };

  if (id) {
    const { error } = await supabase.from("blogs").update(payload).eq("id", id);

    if (error?.code === "42501" && supabaseAdmin) {
      const { error: adminError } = await supabaseAdmin.from("blogs").update(payload).eq("id", id);
      if (adminError) {
        throw adminError;
      }
    } else if (error) {
      throw error;
    }
  } else {
    const { error } = await supabase.from("blogs").insert(payload);

    if (error?.code === "42501" && supabaseAdmin) {
      const { error: adminError } = await supabaseAdmin.from("blogs").insert(payload);
      if (adminError) {
        throw adminError;
      }
    } else if (error) {
      throw error;
    }
  }

  refreshSite();
}

export async function deleteBlogAction(formData: FormData) {
  await requirePermission("blogs");
  const id = formData.get("id")?.toString();

  if (!id) return;

  const { error } = await supabase.from("blogs").delete().eq("id", id);

  if (error?.code === "42501" && supabaseAdmin) {
    const { error: adminError } = await supabaseAdmin.from("blogs").delete().eq("id", id);
    if (adminError) {
      throw adminError;
    }
  } else if (error) {
    throw error;
  }

  refreshSite();
}

// ============================================
// News Actions
// ============================================

export async function saveNewsAction(formData: FormData) {
  await requirePermission("news");
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString() ?? "";
  const publishedAtRaw = formData.get("publishedAt")?.toString().trim() ?? "";

  const toSafePublishedAt = (value: string) => {
    if (!value) {
      return new Date().toISOString().slice(0, 10);
    }

    const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
    if (dateOnlyPattern.test(value)) {
      return value;
    }

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }

    return new Date().toISOString().slice(0, 10);
  };

  const payload = {
    id: id || nextId("nws"),
    slug: slugify(formData.get("slug")?.toString() || title),
    title,
    excerpt: formData.get("excerpt")?.toString() ?? "",
    content: formData.get("content")?.toString() ?? "",
    source: formData.get("source")?.toString() ?? "",
    published_at: toSafePublishedAt(publishedAtRaw),
  };

  if (id) {
    const { error } = await supabase.from("news").update(payload).eq("id", id);

    if (error?.code === "42501" && supabaseAdmin) {
      const { error: adminError } = await supabaseAdmin.from("news").update(payload).eq("id", id);
      if (adminError) {
        throw adminError;
      }
    } else if (error) {
      throw error;
    }
  } else {
    const { error } = await supabase.from("news").insert(payload);

    if (error?.code === "42501" && supabaseAdmin) {
      const { error: adminError } = await supabaseAdmin.from("news").insert(payload);
      if (adminError) {
        throw adminError;
      }
    } else if (error) {
      throw error;
    }
  }

  refreshSite();
}

export async function deleteNewsAction(formData: FormData) {
  await requirePermission("news");
  const id = formData.get("id")?.toString();

  if (!id) return;

  const { error } = await supabase.from("news").delete().eq("id", id);

  if (error?.code === "42501" && supabaseAdmin) {
    const { error: adminError } = await supabaseAdmin.from("news").delete().eq("id", id);
    if (adminError) {
      throw adminError;
    }
  } else if (error) {
    throw error;
  }

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

export async function getDashboardStats() {
  const [services, doctors, blogs, news, contacts, appointments, patients] = await Promise.all([
    getAllServices(),
    getAllDoctors(),
    getAllBlogs(),
    getAllNews(),
    getAllContacts(),
    getAllAppointments(),
    getAllPatients(),
  ]);

  // Get today's appointments
  const today = new Date().toISOString().slice(0, 10);
  const todayAppointments = appointments.filter(
    (apt) => apt.appointment_date === today
  );

  // Get this month's appointments
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthAppointments = appointments.filter(
    (apt) => apt.appointment_date?.startsWith(thisMonth)
  );

  // Get new patients this month
  const newPatientsThisMonth = patients.filter(
    (p) => p.created_at?.startsWith(thisMonth)
  );

  // Calculate revenue (sum of completed appointments * average fee)
  const completedAppointments = appointments.filter(
    (apt) => apt.status === "Completed"
  );

  return {
    todayAppointments: todayAppointments.length,
    totalPatients: patients.length,
    totalDoctors: doctors.length,
    newPatientsThisMonth: newPatientsThisMonth.length,
    monthlyAppointments: monthAppointments.length,
    totalAppointments: appointments.length,
    completedAppointments: completedAppointments.length,
    services: services.length,
    blogs: blogs.length,
    news: news.length,
    contacts: contacts.length,
  };
}

export async function getRecentAppointments(limit = 5) {
  const appointments = await getAllAppointments();
  return appointments.slice(0, limit);
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
    const { created_at: removedCreatedAt, ...updatePayload } = payload;
    void removedCreatedAt;
    await supabase.from("patients").update(updatePayload).eq("id", id);
  } else {
    await supabase.from("patients").insert(payload);
  }

  refreshSite();
}

export async function savePatientWithAppointmentAction(formData: FormData) {
  await requirePermission("patients");

  const includeAppointment = formData.get("includeAppointment")?.toString() === "true";
  const doctorId = formData.get("doctorId")?.toString() ?? "";
  const appointmentDate = formData.get("appointmentDate")?.toString() ?? "";
  const appointmentTime = formData.get("appointmentTime")?.toString() ?? "";

  if (includeAppointment) {
    if (!doctorId || !appointmentDate || !appointmentTime) {
      redirect("/dashboard/patients?error=missing_appointment_fields");
    }

    const isAvailable = await isDoctorTimeSlotAvailable(doctorId, appointmentDate, appointmentTime);
    if (!isAvailable) {
      redirect("/dashboard/patients?error=slot_unavailable");
    }
  }

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
  if (includeAppointment) {
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
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          message: formData.get("appointmentNotes")?.toString() ?? "",
          status: "Scheduled",
          notes: "",
          created_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("appointments").insert(appointment);
        if (error?.code === "23505") {
          redirect("/dashboard/patients?error=slot_unavailable");
        }

        if (error) {
          redirect("/dashboard/patients?error=appointment_create_failed");
        }
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
  const appointmentDate = formData.get("date")?.toString() ?? "";
  const appointmentTime = formData.get("time")?.toString() ?? "";

  if (!patientId || !doctorId || !appointmentDate || !appointmentTime) {
    redirect("/dashboard/patients?error=missing_appointment_fields");
  }

  const isAvailable = await isDoctorTimeSlotAvailable(doctorId, appointmentDate, appointmentTime);
  if (!isAvailable) {
    redirect("/dashboard/patients?error=slot_unavailable");
  }

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
    appointment_date: appointmentDate,
    appointment_time: appointmentTime,
    message: formData.get("notes")?.toString() ?? "",
    status: "Scheduled",
    notes: "",
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("appointments").insert(appointment);
  if (error?.code === "23505") {
    redirect("/dashboard/patients?error=slot_unavailable");
  }

  if (error) {
    redirect("/dashboard/patients?error=appointment_create_failed");
  }

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

  await deleteContact(id);
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

// ============================================
// Employee Management Actions
// ============================================

export async function saveEmployeeAction(formData: FormData) {
  await requirePermission("employees");
  const id = formData.get("id")?.toString();

  const name = formData.get("name")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const username = formData.get("username")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const role = formData.get("role")?.toString() ?? "blog_manager";

  // Get permissions from role using rbac helper
  const { getRolePermissions } = await import("@/lib/rbac");
  const customRoles = await getCustomRoles();
  const permissions = getRolePermissions(role, customRoles);

  if (permissions.length === 0) {
    redirect("/dashboard/employees?error=invalid_role");
  }

  if (id) {
    // Update existing employee
    const updates: Record<string, unknown> = {
      name,
      email,
      username,
      role,
      permissions,
    };

    // Only update password if provided
    if (password) {
      updates.password = password;
    }

    const { error } = await supabase.from("users").update(updates).eq("id", id);

    if (error?.code === "42501" && supabaseAdmin) {
      const { error: adminError } = await supabaseAdmin
        .from("users")
        .update(updates)
        .eq("id", id);
      if (adminError) throw adminError;
    } else if (error) {
      throw error;
    }
  } else {
    // Create new employee
    if (!password) {
      redirect("/dashboard/employees?error=password_required");
    }

    const payload = {
      id: nextId("usr"),
      name,
      email,
      username,
      password,
      role,
      permissions,
    };

    const { error } = await supabase.from("users").insert(payload);

    if (error?.code === "42501" && supabaseAdmin) {
      const { error: adminError } = await supabaseAdmin
        .from("users")
        .insert(payload);
      if (adminError) throw adminError;
    } else if (error) {
      throw error;
    }
  }

  revalidatePath("/dashboard/employees");
  redirect("/dashboard/employees?success=1");
}

export async function createCustomRoleAction(input: {
  label: string;
  permissions: Permission[];
}): Promise<
  | { ok: true; role: CustomRole }
  | { ok: false; error: string }
> {
  await requirePermission("employees");

  const { normalizeRoleValue } = await import("@/lib/rbac");

  const label = input.label.trim();
  const value = normalizeRoleValue(label);
  const allowedPermissions: Permission[] = [
    "all",
    "home",
    "about",
    "services",
    "projects",
    "blogs",
    "news",
    "contacts",
    "interests",
    "patients",
    "employees",
  ];

  const permissions = Array.from(
    new Set(
      input.permissions.filter((permission) =>
        allowedPermissions.includes(permission),
      ),
    ),
  );

  if (!label || !value) {
    return { ok: false, error: "Role name is required." };
  }

  if (value === "__create_role__") {
    return { ok: false, error: "This role key is reserved." };
  }

  if (permissions.length === 0) {
    return { ok: false, error: "Select at least one permission." };
  }

  const { getAllRoles } = await import("@/lib/rbac");
  const existingCustomRoles = await getCustomRoles();
  const existingRoles = getAllRoles(existingCustomRoles);

  const roleAlreadyExists = existingRoles.some(
    (role) =>
      role.value === value ||
      role.label.trim().toLowerCase() === label.toLowerCase(),
  );

  if (roleAlreadyExists) {
    return { ok: false, error: "A role with this name already exists." };
  }

  const normalizedPermissions = permissions.includes("all")
    ? (["all"] as Permission[])
    : permissions;

  const role: CustomRole = {
    value,
    label,
    permissions: normalizedPermissions,
  };

  const updatedRoles = [...existingCustomRoles, role].sort((left, right) =>
    left.label.localeCompare(right.label),
  );

  await upsertSiteSetting("custom_roles", updatedRoles);
  revalidatePath("/dashboard/employees");

  return { ok: true, role };
}

export async function deleteEmployeeAction(formData: FormData) {
  await requirePermission("employees");
  const id = formData.get("id")?.toString();

  if (!id) return;

  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error?.code === "42501" && supabaseAdmin) {
    const { error: adminError } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", id);
    if (adminError) throw adminError;
  } else if (error) {
    throw error;
  }

  revalidatePath("/dashboard/employees");
  redirect("/dashboard/employees?deleted=1");
}
