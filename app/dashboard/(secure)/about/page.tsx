import { updateAboutAction } from "@/app/dashboard/actions";
import { requirePermission } from "@/lib/auth";
import { getSiteSettings } from "@/lib/db";
import {
  DoctorFormField,
} from "@/components/dashboard/doctor-form-ui";
import { TiptapEditorField } from "@/components/dashboard/TiptapEditorField";

export default async function DashboardAboutPage() {
  await requirePermission("about");
  const settings = await getSiteSettings();
  const data = { about: settings.about };

  return (
    <article className="card overflow-hidden rounded-[28px] border border-[#e7eef9] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.28)]">
      <div>
        <div>
          <span className="inline-flex rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
            About
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-[var(--brand-deep)]">
            Edit About Content
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Refine the clinic story, mission, vision, and values with a cleaner editing layout.
          </p>
        </div>
      </div>

      <section className="mt-6 rounded-[24px] border border-[#dce8fb] bg-white p-5 shadow-[0_12px_28px_-24px_rgba(17,24,39,0.25)]">
        <form action={updateAboutAction} className="grid gap-6">
          <DoctorFormField label="Section Title">
            <TiptapEditorField
              key="about-title"
              name="title"
              defaultValue={data.about.title}
              size="compact"
              submitMode="plain-text"
              placeholder="Section title"
            />
          </DoctorFormField>

          <DoctorFormField label="Description">
            <TiptapEditorField
              key="about-description"
              name="description"
              defaultValue={data.about.description}
              size="compact"
              placeholder="Description"
            />
          </DoctorFormField>

          <div className="grid gap-6 lg:grid-cols-2">
            <DoctorFormField label="Mission">
              <TiptapEditorField
                key="about-mission"
                name="mission"
                defaultValue={data.about.mission}
                size="compact"
                placeholder="Mission"
              />
            </DoctorFormField>

            <DoctorFormField label="Vision">
              <TiptapEditorField
                key="about-vision"
                name="vision"
                defaultValue={data.about.vision}
                size="compact"
                placeholder="Vision"
              />
            </DoctorFormField>
          </div>

          <DoctorFormField label="Core Values">
            <TiptapEditorField
              key="about-values"
              name="values"
              size="compact"
              submitMode="line-list"
              defaultValue={data.about.values.join("\n")}
              placeholder="Core values (one per line)"
            />
          </DoctorFormField>

          <div className="flex flex-col gap-4 border-t border-[#edf2fb] pt-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium text-[var(--muted)]">
              Use one value per line.
            </p>

            <button className="button button-primary rounded-xl px-5 py-2.5">
              Save About
            </button>
          </div>
        </form>
      </section>
    </article>
  );
}
