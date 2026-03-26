"use server";

import { revalidatePath } from "next/cache";
import { requireDoctorUser } from "@/lib/auth";
import {
  createDoctorMedicalRecord,
  createDoctorPrescription,
  markDoctorNotificationsAsRead,
  updateDoctorAppointmentStatus,
  updateDoctorProfile,
} from "@/lib/doctor-dashboard/service";
import {
  doctorProfileSchema,
  medicalRecordSchema,
  prescriptionSchema,
  splitTextareaLines,
  updateAppointmentStatusSchema,
} from "@/lib/doctor-dashboard/validators";

function refreshDoctorDashboard() {
  revalidatePath("/doctor-dashboard", "layout");
  revalidatePath("/doctor-dashboard");
  revalidatePath("/doctor-dashboard/appointments");
  revalidatePath("/doctor-dashboard/patients");
  revalidatePath("/doctor-dashboard/medical-records");
  revalidatePath("/doctor-dashboard/prescriptions");
  revalidatePath("/doctor-dashboard/notifications");
  revalidatePath("/doctor-dashboard/reports");
  revalidatePath("/doctor-dashboard/profile");
}

export async function updateDoctorAppointmentStatusAction(formData: FormData) {
  const user = await requireDoctorUser();
  const parsed = updateAppointmentStatusSchema.safeParse({
    appointmentId: formData.get("appointmentId")?.toString(),
    status: formData.get("status")?.toString(),
  });

  if (!parsed.success) {
    throw new Error("Invalid appointment status update.");
  }

  await updateDoctorAppointmentStatus(
    user.doctorId!,
    parsed.data.appointmentId,
    parsed.data.status,
  );

  refreshDoctorDashboard();
}

export async function createMedicalRecordAction(formData: FormData) {
  const user = await requireDoctorUser();
  const parsed = medicalRecordSchema.safeParse({
    patientId: formData.get("patientId")?.toString(),
    diagnosis: formData.get("diagnosis")?.toString(),
    notes: formData.get("notes")?.toString(),
    attachments: splitTextareaLines(formData.get("attachments")?.toString() ?? ""),
  });

  if (!parsed.success) {
    throw new Error("Invalid medical record form.");
  }

  await createDoctorMedicalRecord({
    doctorId: user.doctorId!,
    ...parsed.data,
  });

  refreshDoctorDashboard();
}

export async function createPrescriptionAction(formData: FormData) {
  const user = await requireDoctorUser();
  const parsed = prescriptionSchema.safeParse({
    patientId: formData.get("patientId")?.toString(),
    medication: formData.get("medication")?.toString(),
    dosage: formData.get("dosage")?.toString(),
    duration: formData.get("duration")?.toString(),
    instructions: formData.get("instructions")?.toString(),
  });

  if (!parsed.success) {
    throw new Error("Invalid prescription form.");
  }

  await createDoctorPrescription({
    doctorId: user.doctorId!,
    ...parsed.data,
  });

  refreshDoctorDashboard();
}

export async function markNotificationReadAction(formData: FormData) {
  const user = await requireDoctorUser();
  const notificationId = formData.get("notificationId")?.toString();

  if (!notificationId) {
    throw new Error("Notification id is required.");
  }

  await markDoctorNotificationsAsRead(user.doctorId!, [notificationId]);
  refreshDoctorDashboard();
}

export async function markAllNotificationsReadAction() {
  const user = await requireDoctorUser();
  await markDoctorNotificationsAsRead(user.doctorId!);
  refreshDoctorDashboard();
}

export async function updateDoctorProfileAction(formData: FormData) {
  const user = await requireDoctorUser();
  const parsed = doctorProfileSchema.safeParse({
    name: formData.get("name")?.toString(),
    specialty: formData.get("specialty")?.toString(),
    profileImage: formData.get("profileImage")?.toString(),
    location: formData.get("location")?.toString(),
    password: formData.get("password")?.toString(),
  });

  if (!parsed.success) {
    throw new Error("Invalid doctor profile form.");
  }

  await updateDoctorProfile({
    doctorId: user.doctorId!,
    ...parsed.data,
  });

  refreshDoctorDashboard();
}
