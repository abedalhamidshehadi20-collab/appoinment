import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  createDoctorPrescription,
  getDoctorPrescriptions,
} from "@/lib/doctor-dashboard/service";
import { prescriptionSchema } from "@/lib/doctor-dashboard/validators";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "doctor" || !user.doctorId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get("patientId") ?? undefined;
  const prescriptions = await getDoctorPrescriptions(user.doctorId, patientId);

  return NextResponse.json({ prescriptions });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "doctor" || !user.doctorId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsedBody = prescriptionSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid prescription payload", issues: parsedBody.error.flatten() },
      { status: 400 },
    );
  }

  await createDoctorPrescription({
    doctorId: user.doctorId,
    ...parsedBody.data,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
