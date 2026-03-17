import { requirePermission } from "@/lib/auth";
import { readData } from "@/lib/cms";

export default async function DashboardInterestsPage() {
  await requirePermission("interests");
  const data = await readData();

  return (
    <article className="card p-6">
      <h1 className="text-2xl font-extrabold">Project Interest Submissions</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Leads submitted from project detail pages.</p>

      <div className="mt-5 grid gap-3">
        {data.interests.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No submissions yet.</p>
        ) : (
          data.interests.map((item) => (
            <article key={item.id} className="rounded-xl border border-[var(--line)] bg-[#fbfdff] p-4 text-sm">
              <p className="font-semibold text-[var(--brand-deep)]">{item.name}</p>
              <p className="text-xs text-[var(--muted)]">Project: {item.projectTitle}</p>
              <p className="text-[var(--muted)]">{item.email} {item.phone ? `• ${item.phone}` : ""}</p>
              <p className="mt-1 text-[var(--muted)]">Company: {item.company || "N/A"} • Budget: {item.budget || "N/A"}</p>
              <p className="mt-2">{item.message || "No message"}</p>
              <p className="mt-2 text-xs text-[var(--muted)]">{new Date(item.createdAt).toLocaleString()}</p>
            </article>
          ))
        )}
      </div>
    </article>
  );
}
