import { NextResponse } from "next/server";
import { createAppointment, getDoctorBySlug } from "@/lib/db";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, context: Params) {
  const { slug } = await context.params;
  const formData = await request.formData();
  const doctor = await getDoctorBySlug(slug);

  if (!doctor) {
    return NextResponse.redirect(new URL("/doctors", request.url));
  }

  await createAppointment({
    patient_id: null,
    doctor_id: doctor.id,
    doctor_name: doctor.title,
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    location: formData.get("company")?.toString() ?? "",
    service: formData.get("budget")?.toString() ?? "",
    appointment_date: formData.get("date")?.toString() ?? "",
    appointment_time: formData.get("time")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
    status: "pending",
    notes: "",
  });

  const redirectUrl = new URL(`/doctors/${slug}?sent=1`, request.url);
  return NextResponse.redirect(redirectUrl);
}
