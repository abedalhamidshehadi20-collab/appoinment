import { NextResponse } from "next/server";
import { nextId, readData, updateData } from "@/lib/cms";
import { getPatientSession } from "@/lib/patient-auth";

export async function POST(request: Request) {
  const patient = await getPatientSession();
  if (!patient) {
    return NextResponse.redirect(new URL("/login?next=%2Fappointments", request.url));
  }

  const formData = await request.formData();
  const data = await readData();
  const doctorId = formData.get("doctorId")?.toString() ?? "";
  const selectedDoctor = data.projects.find((doctor) => doctor.id === doctorId);

  await updateData((store) => {
    store.interests.unshift({
      id: nextId("int"),
      projectId: selectedDoctor?.id ?? "general_appointment",
      projectTitle: selectedDoctor?.title ?? "General Appointment Desk",
      name: formData.get("name")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      phone: formData.get("phone")?.toString() ?? "",
      company: formData.get("location")?.toString() ?? "",
      budget: formData.get("service")?.toString() ?? "",
      date: formData.get("date")?.toString() ?? "",
      time: formData.get("time")?.toString() ?? "",
      message: formData.get("message")?.toString() ?? "",
      createdAt: new Date().toISOString(),
    });
  });

  return NextResponse.redirect(new URL("/appointments?sent=1", request.url));
}
