import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  getDoctorAppointments,
  updateDoctorAppointmentStatus,
} from "@/lib/doctor-dashboard/service";
import {
  appointmentFiltersSchema,
  updateAppointmentStatusSchema,
} from "@/lib/doctor-dashboard/validators";

function parseDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function withinRange(value: string | null | undefined, range: "all" | "day" | "week" | "month") {
  if (range === "all") {
    return true;
  }

  const date = parseDate(value);
  if (!date) {
    return false;
  }

  const now = new Date();
  const diffDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (range === "day") {
    return diffDays >= -1 && diffDays <= 1;
  }

  if (range === "week") {
    return diffDays >= -7 && diffDays <= 7;
  }

  return diffDays >= -31 && diffDays <= 31;
}

function normalizeStatus(value: string) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "done") return "completed";
  if (normalized === "confirmed") return "pending";
  if (normalized === "scheduled") return "pending";
  if (normalized === "canceled") return "cancelled";
  return normalized || "pending";
}

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "doctor" || !user.doctorId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parsedFilters = appointmentFiltersSchema.safeParse({
    range: searchParams.get("range") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    q: searchParams.get("q") ?? undefined,
  });

  if (!parsedFilters.success) {
    return NextResponse.json(
      { error: "Invalid appointment filters", issues: parsedFilters.error.flatten() },
      { status: 400 },
    );
  }

  const appointments = await getDoctorAppointments(user.doctorId);
  const { range = "all", status = "all", q = "" } = parsedFilters.data;
  const query = q.trim().toLowerCase();

  const filtered = appointments.filter((appointment) => {
    if (!withinRange(appointment.appointment_date, range)) {
      return false;
    }

    if (status !== "all" && normalizeStatus(appointment.status || "") !== status.toLowerCase()) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack = [
      appointment.name,
      appointment.email,
      appointment.doctor_name,
      appointment.service,
      appointment.appointment_date,
      appointment.appointment_time,
      appointment.status,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });

  return NextResponse.json({ appointments: filtered });
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "doctor" || !user.doctorId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsedBody = updateAppointmentStatusSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid appointment status payload", issues: parsedBody.error.flatten() },
      { status: 400 },
    );
  }

  await updateDoctorAppointmentStatus(
    user.doctorId,
    parsedBody.data.appointmentId,
    parsedBody.data.status,
  );

  return NextResponse.json({ ok: true });
}
