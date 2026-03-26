import { redirect } from "next/navigation";
import { AppointmentsManagementClient } from "@/components/dashboard/AppointmentsManagementClient";
import { requirePermission } from "@/lib/auth";
import {
  MANUAL_APPOINTMENT_REMINDER_LEAD_DAYS,
  isManualAppointmentReminderEligibleDate,
  sendSingleAppointmentReminderById,
} from "@/lib/appointment-reminders";
import { getAllAppointments, hasSentAppointmentReminder } from "@/lib/db";

function isEligibleForManualReminder(item: {
  appointment_date: string;
  status: string;
  email: string;
}) {
  const status = item.status?.toLowerCase() || "";
  const validStatus =
    status === "pending" || status === "scheduled" || status === "confirmed";

  return (
    isManualAppointmentReminderEligibleDate(item.appointment_date) &&
    validStatus &&
    Boolean(item.email?.trim())
  );
}

function reminderMessage(code: string | undefined) {
  if (!code) return "";

  if (code === "sent") return "Reminder email sent successfully.";
  if (code === "already_sent") return "Reminder was already sent for this appointment.";
  if (code === "not_in_window") {
    return `Manual reminder is enabled only ${MANUAL_APPOINTMENT_REMINDER_LEAD_DAYS} days before the appointment date.`;
  }
  if (code === "opted_out") return "Patient has disabled appointment reminders.";
  if (code === "missing_email") return "Cannot send reminder because appointment email is missing.";
  if (code === "invalid_status") {
    return "Reminder can only be sent for pending, scheduled, or confirmed appointments.";
  }
  if (code === "not_found") return "Appointment was not found.";

  return "Could not send reminder right now. Please try again.";
}

type Props = {
  searchParams: Promise<{ reminder?: string }>;
};

type ReminderState = {
  eligible: boolean;
  alreadySent: boolean;
};

export default async function DashboardInterestsPage({ searchParams }: Props) {
  await requirePermission("interests");
  const query = await searchParams;

  async function sendReminderAction(formData: FormData) {
    "use server";

    await requirePermission("interests");
    const appointmentId = formData.get("appointmentId")?.toString() ?? "";

    if (!appointmentId) {
      redirect("/dashboard/interests?reminder=not_found");
    }

    const result = await sendSingleAppointmentReminderById(appointmentId);
    redirect(`/dashboard/interests?reminder=${result.reason}`);
  }

  const appointments = await getAllAppointments();
  const reminderStates: Array<[string, ReminderState]> = await Promise.all(
    appointments.map(async (item) => {
      const eligible = isEligibleForManualReminder(item);

      if (!eligible) {
        return [item.id, { eligible: false, alreadySent: false }];
      }

      const alreadySent = await hasSentAppointmentReminder(
        item.id,
        item.appointment_date,
      );

      return [item.id, { eligible: true, alreadySent }];
    }),
  );

  const reminderStateMap = Object.fromEntries(reminderStates);
  const reminderBanner = reminderMessage(query.reminder);

  return (
    <AppointmentsManagementClient
      appointments={appointments}
      reminderBanner={reminderBanner}
      reminderStateMap={reminderStateMap}
      sendReminderAction={sendReminderAction}
    />
  );
}
