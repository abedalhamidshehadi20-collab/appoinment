import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  getDoctorNotifications,
  markDoctorNotificationsAsRead,
} from "@/lib/doctor-dashboard/service";
import { notificationsPatchSchema } from "@/lib/doctor-dashboard/validators";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "doctor" || !user.doctorId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notifications = await getDoctorNotifications(user.doctorId);
  return NextResponse.json({ notifications });
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "doctor" || !user.doctorId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsedBody = notificationsPatchSchema.safeParse({
    ids: Array.isArray(body?.ids) ? body.ids : [],
    markAll: Boolean(body?.markAll),
  });

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid notifications payload", issues: parsedBody.error.flatten() },
      { status: 400 },
    );
  }

  await markDoctorNotificationsAsRead(
    user.doctorId,
    parsedBody.data.markAll ? undefined : parsedBody.data.ids,
  );

  return NextResponse.json({ ok: true });
}
