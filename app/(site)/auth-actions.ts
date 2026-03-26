"use server";

import { redirect } from "next/navigation";
import { createPatientSession, logoutPatient, patientLogin } from "@/lib/patient-auth";
import { findPatientByEmail, createPatient } from "@/lib/db";
import { loginDoctor } from "@/lib/auth";

export async function patientLoginAction(formData: FormData) {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const next = formData.get("next")?.toString() || "/";

  const ok = await patientLogin(email, password);
  if (!ok) {
    redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
  }

  redirect(next);
}

export async function patientSignupAction(formData: FormData) {
  const firstName = formData.get("firstName")?.toString().trim() ?? "";
  const lastName = formData.get("lastName")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!firstName || !lastName || !email || !password) {
    redirect("/signup?error=1");
  }

  try {
    const existingPatient = await findPatientByEmail(email);
    if (existingPatient) {
      redirect("/signup?exists=1");
    }

    const patientName = `${firstName} ${lastName}`.trim();

    const newPatient = await createPatient({
      name: patientName,
      email,
      password,
      phone,
      address: "",
      date_of_birth: "",
      gender: "",
      medical_history: "",
    });

    await createPatientSession({
      id: newPatient.id,
      name: patientName,
      email,
    });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error
      ? String(error.code)
      : "";

    if (code === "23505") {
      redirect("/signup?exists=1");
    }

    if (code === "42501") {
      redirect("/signup?config=1");
    }

    redirect("/signup?error=1");
  }

  redirect("/");
}

export async function patientLogoutAction() {
  await logoutPatient();
  redirect("/");
}

export async function doctorLoginAction(formData: FormData) {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const next = formData.get("next")?.toString() || "/dashboard/projects";

  const ok = await loginDoctor(email, password);
  if (!ok) {
    redirect(`/doctor-login?error=1&next=${encodeURIComponent(next)}`);
  }

  redirect(next);
}
