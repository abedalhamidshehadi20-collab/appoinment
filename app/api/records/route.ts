import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  createDoctorMedicalRecord,
  getDoctorMedicalRecords,
} from "@/lib/doctor-dashboard/service";
import {
  medicalRecordSchema,
  splitTextareaLines,
} from "@/lib/doctor-dashboard/validators";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "doctor" || !user.doctorId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get("patientId") ?? undefined;
  const records = await getDoctorMedicalRecords(user.doctorId, patientId);

  return NextResponse.json({ records });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "doctor" || !user.doctorId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsedBody = medicalRecordSchema.safeParse({
    ...(body ?? {}),
    attachments: Array.isArray(body?.attachments)
      ? body.attachments
      : splitTextareaLines(String(body?.attachments ?? "")),
  });

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid medical record payload", issues: parsedBody.error.flatten() },
      { status: 400 },
    );
  }

  await createDoctorMedicalRecord({
    doctorId: user.doctorId,
    ...parsedBody.data,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
