"use server";

import { redirect } from "next/navigation";
import { createPatientSession, logoutPatient, patientLogin } from "@/lib/patient-auth";
import { findPatientByEmail, nextId, updateData } from "@/lib/cms";

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

  const existingPatient = await findPatientByEmail(email);
  if (existingPatient) {
    redirect("/signup?exists=1");
  }

  const patientId = nextId("pat");
  const patientName = `${firstName} ${lastName}`.trim();

  await updateData((data) => {
    data.patients.unshift({
      id: patientId,
      name: patientName,
      email,
      password,
      phone,
      address: "",
      dateOfBirth: "",
      gender: "",
      medicalHistory: "",
      appointments: [],
      createdAt: new Date().toISOString(),
    });
  });

  await createPatientSession({
    id: patientId,
    name: patientName,
    email,
  });

  redirect("/");
}

export async function patientLogoutAction() {
  await logoutPatient();
  redirect("/");
}
