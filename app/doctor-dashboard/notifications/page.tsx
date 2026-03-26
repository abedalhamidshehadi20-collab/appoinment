import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/app/doctor-dashboard/actions";
import { NotificationsPageClient } from "@/components/doctor-dashboard/notifications-page-client";
import { requireDoctorUser } from "@/lib/auth";
import { getDoctorNotifications } from "@/lib/doctor-dashboard/service";

export default async function DoctorNotificationsPage() {
  const user = await requireDoctorUser();
  const notifications = await getDoctorNotifications(user.doctorId!);

  return (
    <NotificationsPageClient
      notifications={notifications}
      markReadAction={markNotificationReadAction}
      markAllAction={markAllNotificationsReadAction}
    />
  );
}
