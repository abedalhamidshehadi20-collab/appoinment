import { NextResponse } from "next/server";
import { getAvailableDoctorTimeSlots, getDoctorById } from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const doctorId = url.searchParams.get("doctorId")?.trim() ?? "";
  const date = url.searchParams.get("date")?.trim() ?? "";

  if (!doctorId || !date) {
    return NextResponse.json(
      { error: "doctorId and date are required", availableSlots: [] },
      { status: 400 },
    );
  }

  const doctor = await getDoctorById(doctorId);
  if (!doctor) {
    return NextResponse.json(
      { error: "Doctor not found", availableSlots: [] },
      { status: 404 },
    );
  }

  const availableSlots = await getAvailableDoctorTimeSlots(doctorId, date);
  return NextResponse.json({ availableSlots });
}
