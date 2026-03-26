import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getDoctorPatients } from "@/lib/doctor-dashboard/service";
import { patientFiltersSchema } from "@/lib/doctor-dashboard/validators";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "doctor" || !user.doctorId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parsedFilters = patientFiltersSchema.safeParse({
    q: searchParams.get("q") ?? undefined,
    history: searchParams.get("history") ?? undefined,
  });

  if (!parsedFilters.success) {
    return NextResponse.json(
      { error: "Invalid patient filters", issues: parsedFilters.error.flatten() },
      { status: 400 },
    );
  }

  const patients = await getDoctorPatients(user.doctorId);
  const { q = "", history = "all" } = parsedFilters.data;
  const query = q.trim().toLowerCase();

  const filtered = patients.filter((patient) => {
    if (history === "with-records" && patient.recordsCount === 0) {
      return false;
    }

    if (history === "without-records" && patient.recordsCount > 0) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack = [
      patient.name,
      patient.email,
      patient.phone,
      patient.medical_history,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });

  return NextResponse.json({ patients: filtered });
}
