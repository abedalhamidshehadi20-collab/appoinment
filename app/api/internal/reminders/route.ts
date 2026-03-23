import { NextResponse } from "next/server";
import { runAppointmentReminderJob } from "@/lib/appointment-reminders";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const secret = process.env.REMINDER_CRON_SECRET;
  if (!secret) {
    return false;
  }

  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  const headerSecret = request.headers.get("x-reminder-secret") || "";

  return token === secret || headerSecret === secret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let targetDate: string | undefined;

  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json() as { targetDate?: string };
      targetDate = body.targetDate;
    }
  } catch {
    // Ignore invalid JSON body and run default schedule date.
  }

  try {
    const result = await runAppointmentReminderJob({ targetDate });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Reminder job failed",
      },
      { status: 500 },
    );
  }
}
