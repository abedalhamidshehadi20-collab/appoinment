import { NextResponse } from "next/server";
import { nextId, updateData } from "@/lib/cms";
import { getPatientSession } from "@/lib/patient-auth";

export async function POST(request: Request) {
  const patient = await getPatientSession();
  if (!patient) {
    return NextResponse.redirect(new URL("/login?next=%2Fcontact", request.url));
  }

  const formData = await request.formData();

  await updateData((data) => {
    data.contacts.unshift({
      id: nextId("cnt"),
      name: formData.get("name")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      phone: formData.get("phone")?.toString() ?? "",
      message: formData.get("message")?.toString() ?? "",
      createdAt: new Date().toISOString(),
    });
  });

  const url = new URL("/contact?sent=1", request.url);
  return NextResponse.redirect(url);
}
