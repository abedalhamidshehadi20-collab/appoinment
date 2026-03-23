import { requirePermission } from "@/lib/auth";
import { getAllAppointments } from "@/lib/db";

export default async function DashboardInterestsPage() {
  await requirePermission("interests");
  const appointments = await getAllAppointments();

  return (
    <article className="card p-6">
      <h1 className="text-2xl font-extrabold">Appointment Requests</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Requests submitted from doctor profile pages.</p>

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
            </article>
          ))
        )}
      </div>
    </article>
  );
}
