import { updateHomeAction } from "@/app/dashboard/actions";
import { requirePermission } from "@/lib/auth";
import { getSiteSettings } from "@/lib/db";

export default async function DashboardHomePage() {
  await requirePermission("home");
  const settings = await getSiteSettings();
  const data = { home: settings.home };

  return (
    <article className="card p-6">
      <h1 className="text-2xl font-extrabold">Edit Home Content</h1>
      <form action={updateHomeAction} className="mt-4 grid gap-3">
        <input name="headline" defaultValue={data.home.headline} className="rounded-lg border border-[var(--line)] px-3 py-2" />
        <textarea name="subheadline" defaultValue={data.home.subheadline} rows={3} className="rounded-lg border border-[var(--line)] px-3 py-2" />

        <div className="grid gap-3 md:grid-cols-2">
          <input name="primaryCtaText" defaultValue={data.home.primaryCtaText} placeholder="Primary CTA Text" className="rounded-lg border border-[var(--line)] px-3 py-2" />
          <input name="primaryCtaLink" defaultValue={data.home.primaryCtaLink} placeholder="Primary CTA Link" className="rounded-lg border border-[var(--line)] px-3 py-2" />
          <input name="secondaryCtaText" defaultValue={data.home.secondaryCtaText} placeholder="Secondary CTA Text" className="rounded-lg border border-[var(--line)] px-3 py-2" />
          <input name="secondaryCtaLink" defaultValue={data.home.secondaryCtaLink} placeholder="Secondary CTA Link" className="rounded-lg border border-[var(--line)] px-3 py-2" />
        </div>

        <h2 className="mt-2 text-lg font-bold">Stats</h2>
        {data.home.stats.map((stat, idx) => (
          <div key={idx} className="grid gap-3 md:grid-cols-2">
            <input name={`stat${idx + 1}Label`} defaultValue={stat.label} placeholder="Label" className="rounded-lg border border-[var(--line)] px-3 py-2" />
            <input name={`stat${idx + 1}Value`} defaultValue={stat.value} placeholder="Value" className="rounded-lg border border-[var(--line)] px-3 py-2" />
          </div>
        ))}

        <button className="button button-primary w-fit">Save Home</button>
      </form>
    </article>
  );
}
