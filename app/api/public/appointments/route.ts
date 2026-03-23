import { NextResponse } from "next/server";
import { createAppointment, getDoctorById, isDoctorTimeSlotAvailable } from "@/lib/db";
import { getPatientSession } from "@/lib/patient-auth";

export async function POST(request: Request) {
  const patient = await getPatientSession();
  if (!patient) {
    return NextResponse.redirect(new URL("/login?next=%2Fappointments", request.url));
  }

  const formData = await request.formData();
  const doctorId = formData.get("doctorId")?.toString() ?? "";
  const appointmentDate = formData.get("date")?.toString() ?? "";
  const appointmentTime = formData.get("time")?.toString() ?? "";

  const errorRedirect = (code: string) => {
    const url = new URL("/appointments", request.url);
    url.searchParams.set("error", code);
    if (doctorId) url.searchParams.set("doctor", doctorId);
    if (appointmentDate) url.searchParams.set("date", appointmentDate);
    if (appointmentTime) url.searchParams.set("time", appointmentTime);
    return NextResponse.redirect(url);
  };

  if (!doctorId || !appointmentDate || !appointmentTime) {
    return errorRedirect("missing_fields");
  }

  const selectedDoctor = await getDoctorById(doctorId);

  if (!selectedDoctor) {
    return errorRedirect("doctor_not_found");
  }

  const canBookSelectedSlot = await isDoctorTimeSlotAvailable(
    selectedDoctor.id,
    appointmentDate,
    appointmentTime,
  );

  if (!canBookSelectedSlot) {
    return errorRedirect("slot_unavailable");
  }

  try {
    await createAppointment({
      patient_id: patient.id,
      doctor_id: selectedDoctor.id,
      doctor_name: selectedDoctor.title,
      name: formData.get("name")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      phone: formData.get("phone")?.toString() ?? "",
      location: formData.get("location")?.toString() ?? "",
      service: formData.get("service")?.toString() ?? "",
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      message: formData.get("message")?.toString() ?? "",
      status: "pending",
      notes: "",
    });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error
      ? String(error.code)
      : "";

    if (code === "23505") {
      return errorRedirect("slot_unavailable");
    }

    return errorRedirect("booking_failed");
  }

  return NextResponse.redirect(new URL("/appointments?sent=1", request.url));
}
