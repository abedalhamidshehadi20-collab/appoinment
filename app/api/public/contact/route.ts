import { NextResponse } from "next/server";
import { createContact } from "@/lib/db";
import { getPatientSession } from "@/lib/patient-auth";

export async function POST(request: Request) {
  try {
    const patient = await getPatientSession();
    if (!patient) {
      return NextResponse.redirect(new URL("/login?next=%2Fcontact", request.url));
    }

    const formData = await request.formData();

    await createContact({
      name: formData.get("name")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      phone: formData.get("phone")?.toString() ?? "",
      message: formData.get("message")?.toString() ?? "",
    });

    const url = new URL("/contact?sent=1", request.url);
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Error creating contact:", error);
    const errorUrl = new URL("/contact?error=1", request.url);
    return NextResponse.redirect(errorUrl);
  }
}
