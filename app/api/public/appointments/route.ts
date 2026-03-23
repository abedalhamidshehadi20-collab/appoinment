import { NextResponse } from "next/server";
import { createAppointment, getDoctorById } from "@/lib/db";
import { getPatientSession } from "@/lib/patient-auth";

export async function POST(request: Request) {
  const patient = await getPatientSession();
  if (!patient) {
    return NextResponse.redirect(new URL("/login?next=%2Fappointments", request.url));
  }

  const formData = await request.formData();
  const doctorId = formData.get("doctorId")?.toString() ?? "";
  const selectedDoctor = await getDoctorById(doctorId);

  await createAppointment({
    patient_id: patient.id,
    doctor_id: selectedDoctor?.id ?? "general_appointment",
    doctor_name: selectedDoctor?.title ?? "General Appointment Desk",
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    location: formData.get("location")?.toString() ?? "",
    service: formData.get("service")?.toString() ?? "",
    appointment_date: formData.get("date")?.toString() ?? "",
    appointment_time: formData.get("time")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
    status: "pending",
    notes: "",
  });

  return NextResponse.redirect(new URL("/appointments?sent=1", request.url));
}
