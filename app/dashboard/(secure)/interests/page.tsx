import { requirePermission } from "@/lib/auth";
import { getAllAppointments, hasSentAppointmentReminder } from "@/lib/db";
import { sendSingleAppointmentReminderById } from "@/lib/appointment-reminders";
import { redirect } from "next/navigation";

function getTomorrowISODate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

function isEligibleForManualReminder(item: {
  appointment_date: string;
  status: string;
  email: string;
}) {
  const status = item.status?.toLowerCase() || "";
  const validStatus = status === "pending" || status === "scheduled" || status === "confirmed";
  return item.appointment_date === getTomorrowISODate() && validStatus && Boolean(item.email?.trim());
}

function reminderMessage(code: string | undefined) {
  if (!code) return "";

  if (code === "sent") return "Reminder email sent successfully.";
  if (code === "already_sent") return "Reminder was already sent for this appointment.";
  if (code === "not_tomorrow") return "Manual reminder is enabled only for tomorrow appointments.";
  if (code === "opted_out") return "Patient has disabled appointment reminders.";
  if (code === "missing_email") return "Cannot send reminder because appointment email is missing.";
  if (code === "invalid_status") return "Reminder can only be sent for pending or scheduled appointments.";
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

      const alreadySent = await hasSentAppointmentReminder(item.id, item.appointment_date);
      return [item.id, { eligible: true, alreadySent }];
    }),
  );

  const reminderStateMap = new Map(reminderStates);
  const reminderBanner = reminderMessage(query.reminder);

  return (
    <article className="card p-6">
      <h1 className="text-2xl font-extrabold">Appointment Requests</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Requests submitted from doctor profile pages.</p>

      {reminderBanner ? (
        <p className="mt-4 rounded-lg border border-[#dbeafe] bg-[#eff6ff] px-3 py-2 text-sm text-[#1e40af]">
          {reminderBanner}
        </p>
      ) : null}

      <div className="mt-5 grid gap-3">
        {appointments.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No submissions yet.</p>
        ) : (
          appointments.map((item) => (
            <article key={item.id} className="rounded-xl border border-[var(--line)] bg-[#fbfdff] p-4 text-sm">
              <p className="font-semibold text-[var(--brand-deep)]">{item.name}</p>
              <p className="text-xs text-[var(--muted)]">Doctor: {item.doctor_name}</p>
              <p className="text-[var(--muted)]">{item.email} {item.phone ? `• ${item.phone}` : ""}</p>
              {item.appointment_date && item.appointment_time && (
                <p className="mt-1 font-semibold text-[var(--brand-deep)]">
                  Preferred: {new Date(item.appointment_date).toLocaleDateString()} at {item.appointment_time}
                </p>
              )}
              <p className="mt-1 text-[var(--muted)]">Location/Insurance: {item.location || "N/A"} • Service: {item.service || "N/A"}</p>
              <p className="mt-2">{item.message || "No message"}</p>
              <p className="mt-2 text-xs text-[var(--muted)]">{new Date(item.created_at).toLocaleString()}</p>

              {(() => {
                const state = reminderStateMap.get(item.id) ?? { eligible: false, alreadySent: false };
                if (!state.eligible) {
                  return null;
                }

                return (
                  <form action={sendReminderAction} className="mt-3">
                    <input type="hidden" name="appointmentId" value={item.id} />
                    <button
                      type="submit"
                      disabled={state.alreadySent}
                      className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {state.alreadySent ? "Reminder Sent" : "Send Reminder"}
                    </button>
                  </form>
                );
              })()}
            </article>
          ))
        )}
      </div>
    </article>
  );
}
