import { NextResponse } from "next/server";
import { createAppointment, getDoctorBySlug, isDoctorTimeSlotAvailable } from "@/lib/db";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, context: Params) {
  const { slug } = await context.params;
  const formData = await request.formData();
  const doctor = await getDoctorBySlug(slug);
  const appointmentDate = formData.get("date")?.toString() ?? "";
  const appointmentTime = formData.get("time")?.toString() ?? "";

  const errorRedirect = (code: string) => {
    const url = new URL(`/doctors/${slug}`, request.url);
    url.searchParams.set("error", code);
    if (appointmentDate) url.searchParams.set("date", appointmentDate);
    if (appointmentTime) url.searchParams.set("time", appointmentTime);
    return NextResponse.redirect(url);
  };

  if (!doctor) {
    return NextResponse.redirect(new URL("/doctors", request.url));
  }

  if (!appointmentDate || !appointmentTime) {
    return errorRedirect("missing_fields");
  }

  const canBookSelectedSlot = await isDoctorTimeSlotAvailable(
    doctor.id,
    appointmentDate,
    appointmentTime,
  );

  if (!canBookSelectedSlot) {
    return errorRedirect("slot_unavailable");
  }

  try {
    await createAppointment({
      patient_id: null,
      doctor_id: doctor.id,
      doctor_name: doctor.title,
      name: formData.get("name")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      phone: formData.get("phone")?.toString() ?? "",
      location: formData.get("company")?.toString() ?? "",
      service: formData.get("budget")?.toString() ?? "",
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

  const redirectUrl = new URL(`/doctors/${slug}?sent=1`, request.url);
  return NextResponse.redirect(redirectUrl);
}
