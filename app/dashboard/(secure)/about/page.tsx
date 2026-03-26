import { updateAboutAction } from "@/app/dashboard/actions";
import { requirePermission } from "@/lib/auth";
import { getSiteSettings } from "@/lib/db";
import {
  DoctorFormField,
  inputClassName,
  textareaClassName,
} from "@/components/dashboard/doctor-form-ui";

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
            <input
              name="title"
              defaultValue={data.about.title}
              className={inputClassName}
            />
          </DoctorFormField>

          <DoctorFormField label="Description">
            <textarea
              name="description"
              rows={3}
              defaultValue={data.about.description}
              className={textareaClassName}
            />
          </DoctorFormField>

          <div className="grid gap-6 lg:grid-cols-2">
            <DoctorFormField label="Mission">
              <textarea
                name="mission"
                rows={3}
                defaultValue={data.about.mission}
                className={textareaClassName}
              />
            </DoctorFormField>

            <DoctorFormField label="Vision">
              <textarea
                name="vision"
                rows={3}
                defaultValue={data.about.vision}
                className={textareaClassName}
              />
            </DoctorFormField>
          </div>

          <DoctorFormField label="Core Values">
            <textarea
              name="values"
              rows={4}
              defaultValue={data.about.values.join("\n")}
              className={textareaClassName}
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
