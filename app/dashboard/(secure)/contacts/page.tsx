import { requirePermission } from "@/lib/auth";
import { getAllContacts } from "@/lib/db";

export default async function DashboardContactsPage() {
  await requirePermission("contacts");
  const contacts = await getAllContacts();

  return (
    <article className="card p-6">
      <h1 className="text-2xl font-extrabold">Contact Form Submissions</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Incoming messages from the public contact page.</p>

      <div className="mt-5 grid gap-3">
        {contacts.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No submissions yet.</p>
        ) : (
          contacts.map((item) => (
            <article key={item.id} className="rounded-xl border border-[var(--line)] bg-[#fbfdff] p-4 text-sm">
              <p className="font-semibold text-[var(--brand-deep)]">{item.name}</p>
              <p className="text-[var(--muted)]">{item.email} {item.phone ? `• ${item.phone}` : ""}</p>
              <p className="mt-2">{item.message}</p>
              <p className="mt-2 text-xs text-[var(--muted)]">{new Date(item.created_at).toLocaleString()}</p>
            </article>
          ))
        )}
      </div>
    </article>
  );
}
