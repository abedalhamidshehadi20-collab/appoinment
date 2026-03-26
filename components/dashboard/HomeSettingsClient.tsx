"use client";

import { useState, type ReactNode } from "react";
import { updateContactAction, updateHomeAction } from "@/app/dashboard/actions";
import { DoctorFormField } from "@/components/dashboard/doctor-form-ui";
import type { ContactSettings, SiteSettings } from "@/lib/db";
import {
  BadgeCheck,
  ChevronDown,
  Clock3,
  Filter,
  House,
  Link2,
  Mail,
  MapPin,
  PanelsTopLeft,
  Phone,
  Search,
} from "lucide-react";

type SectionFilter = "all" | "home" | "contact";

type HomeSettingsClientProps = {
  home: SiteSettings["home"];
  contact: ContactSettings;
};

const compactInputClassName =
  "h-11 w-full rounded-xl border border-[#dfe8f8] bg-[#f8fbff] px-4 text-sm text-[var(--brand-deep)] outline-none transition placeholder:text-[#8da0be] focus:border-[#bfd5ff] focus:bg-white focus:ring-4 focus:ring-[#e8f0ff]";

const compactTextareaClassName =
  "w-full rounded-xl border border-[#dfe8f8] bg-[#f8fbff] px-4 py-3 text-sm text-[var(--brand-deep)] outline-none transition placeholder:text-[#8da0be] focus:border-[#bfd5ff] focus:bg-white focus:ring-4 focus:ring-[#e8f0ff]";

function matchesQuery(query: string, terms: string[]) {
  if (!query) return true;
  return terms.join(" ").toLowerCase().includes(query);
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "border-[#bfd5ff] bg-[#eef4ff] text-[var(--brand)]"
          : "border-transparent bg-white text-[var(--muted)] hover:border-[#e3ebfb] hover:text-[var(--brand-deep)]"
      }`}
    >
      {label}
    </button>
  );
}

function MetricCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <article className="rounded-[20px] border border-[#dce8fb] bg-white p-4 shadow-[0_16px_28px_-26px_rgba(15,23,42,0.32)]">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-[#eef4ff] p-3 text-[var(--brand)]">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
            {label}
          </p>
          <p className="mt-2 break-words text-base font-bold text-[var(--brand-deep)]">
            {value}
          </p>
          <p className="mt-1 text-sm leading-5 text-[var(--muted)]">{hint}</p>
        </div>
      </div>
    </article>
  );
}

function SectionShell({
  eyebrow,
  icon,
  title,
  description,
  summary,
  children,
}: {
  eyebrow: string;
  icon: ReactNode;
  title: string;
  description: string;
  summary?: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-[#dce8fb] bg-white shadow-[0_20px_40px_-34px_rgba(15,23,42,0.32)]">
      <div className="border-b border-[#edf2fb] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-5 py-5 sm:px-6">
        <div className="flex items-start gap-4">
          <div className="rounded-[20px] border border-[#dce8fb] bg-[#eef4ff] p-3.5 text-[var(--brand)]">
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              {eyebrow}
            </p>
            <h2 className="mt-2 text-[22px] font-extrabold tracking-[-0.03em] text-[var(--brand-deep)] sm:text-[26px]">
              {title}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              {description}
            </p>
          </div>
        </div>
        {summary ? <div className="mt-5 grid gap-3 md:grid-cols-3">{summary}</div> : null}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </article>
  );
}

function Subsection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[22px] border border-[#e7eef9] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-4 shadow-[0_14px_30px_-30px_rgba(15,23,42,0.35)] sm:p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
          {eyebrow}
        </p>
        <h3 className="mt-2 text-lg font-bold text-[var(--brand-deep)]">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{description}</p>
      </div>
      {children}
    </section>
  );
}

function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[18px] border border-[#edf2fb] bg-white p-4">
      <p className="mb-3 text-sm font-semibold text-[var(--brand-deep)]">
        {title}
      </p>
      {children}
    </div>
  );
}

function SaveBar({
  title,
  description,
  buttonText,
}: {
  title: string;
  description: string;
  buttonText: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[20px] border border-[#dce8fb] bg-[#f8fbff] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-[var(--brand-deep)]">{title}</p>
        <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
      </div>
      <button className="button button-primary rounded-xl px-5 py-2.5">
        {buttonText}
      </button>
    </div>
  );
}

export function HomeSettingsClient({
  home,
  contact,
}: HomeSettingsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>("all");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const showHomeSection =
    (sectionFilter === "all" || sectionFilter === "home") &&
    matchesQuery(normalizedQuery, [
      "home hero headline subheadline cta stats homepage content",
      home.headline,
      home.subheadline,
      home.primaryCtaText,
      home.secondaryCtaText,
      ...home.stats.map((stat) => `${stat.label} ${stat.value}`),
    ]);

  const showContactSection =
    (sectionFilter === "all" || sectionFilter === "contact") &&
    matchesQuery(normalizedQuery, [
      "contact footer settings address city map hours top footer social",
      contact.address,
      contact.city,
      contact.phone,
      contact.email,
      contact.mapLinkLabel,
      contact.footer.brandName,
      contact.footer.connectTitle,
      contact.footer.quickLinksTitle,
      contact.footer.treatmentsTitle,
      contact.footer.mapSectionTitle,
      ...contact.footer.treatments,
    ]);

  return (
    <article className="card overflow-hidden rounded-[30px] border border-[#e7eef9] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.28)]">
      <section className="relative overflow-hidden rounded-[28px] border border-[#dce8fb] bg-[linear-gradient(135deg,#ffffff_0%,#f5f9ff_52%,#ffffff_100%)] p-6 shadow-[0_18px_30px_-28px_rgba(15,23,42,0.25)] sm:p-7">
        <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-[#eef4ff] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-28 w-28 rounded-full bg-[#f4f8ff] blur-2xl" />

        <div className="relative">
          <span className="inline-flex rounded-full border border-[#dce8fb] bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
            Home
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] text-[var(--brand-deep)] sm:text-[38px]">
            Home Content Management
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">
            Manage homepage messaging, public contact details, working hours, and footer content from one place.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#dce8fb] bg-white px-3 py-2 text-sm font-medium text-[var(--brand-deep)]">
              <BadgeCheck className="h-4 w-4 text-[var(--brand)]" />
              2 editable sections
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#dce8fb] bg-white px-3 py-2 text-sm font-medium text-[var(--brand-deep)]">
              <House className="h-4 w-4 text-[var(--brand)]" />
              Public-facing content
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#dce8fb] bg-white px-3 py-2 text-sm font-medium text-[var(--brand-deep)]">
              <PanelsTopLeft className="h-4 w-4 text-[var(--brand)]" />
              Contact and footer settings
            </span>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <MetricCard
              icon={<House className="h-5 w-5" />}
              label="Hero"
              value={home.primaryCtaText || "Homepage CTA"}
              hint="Primary action currently configured for the homepage."
            />
            <MetricCard
              icon={<Mail className="h-5 w-5" />}
              label="Contact"
              value={contact.email || "No email set"}
              hint="Main public contact email shown across the site."
            />
            <MetricCard
              icon={<Clock3 className="h-5 w-5" />}
              label="Hours"
              value={contact.workingHours.weekdays || "Not set"}
              hint="Primary operating schedule displayed to visitors."
            />
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-[24px] border border-[#dce8fb] bg-white p-4 shadow-[0_12px_28px_-24px_rgba(17,24,39,0.25)] sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-3">
            <TabButton active={sectionFilter === "all"} label="All Sections" onClick={() => setSectionFilter("all")} />
            <TabButton active={sectionFilter === "home"} label="Homepage Content" onClick={() => setSectionFilter("home")} />
            <TabButton active={sectionFilter === "contact"} label="Contact & Footer" onClick={() => setSectionFilter("contact")} />
          </div>

          <div className="grid gap-3 xl:w-[560px] xl:grid-cols-[minmax(0,1fr)_190px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search settings" className="h-11 w-full rounded-xl border border-[var(--line)] bg-white pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-[#bfd5ff] focus:ring-4 focus:ring-[#e8f0ff]" />
            </label>

            <label className="relative block">
              <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <select value={sectionFilter} onChange={(event) => setSectionFilter(event.target.value as SectionFilter)} className="h-11 w-full appearance-none rounded-xl border border-[var(--line)] bg-white pl-11 pr-10 text-sm shadow-sm outline-none transition focus:border-[#bfd5ff] focus:ring-4 focus:ring-[#e8f0ff]">
                <option value="all">All Sections</option>
                <option value="home">Homepage Content</option>
                <option value="contact">Contact & Footer</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            </label>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6">
        {showHomeSection ? (
          <SectionShell
            eyebrow="Homepage"
            icon={<House className="h-5 w-5" />}
            title="Homepage Content"
            description="Edit the homepage hero message, calls to action, and stats highlights shown on the public site."
            summary={
              <>
                <MetricCard
                  icon={<Link2 className="h-5 w-5" />}
                  label="Primary CTA"
                  value={home.primaryCtaText || "Not set"}
                  hint="Current homepage primary action."
                />
                <MetricCard
                  icon={<Link2 className="h-5 w-5" />}
                  label="Secondary CTA"
                  value={home.secondaryCtaText || "Not set"}
                  hint="Secondary action displayed beside the hero."
                />
                <MetricCard
                  icon={<BadgeCheck className="h-5 w-5" />}
                  label="Stats"
                  value={`${home.stats.length} items`}
                  hint="Homepage highlights currently configured."
                />
              </>
            }
          >
            <form action={updateHomeAction} className="grid gap-5">
              <Subsection
                eyebrow="Hero"
                title="Hero Content"
                description="Headline, supporting text, and calls to action for the homepage hero area."
              >
                <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_340px]">
                  <div className="grid gap-5">
                    <DoctorFormField label="Headline">
                      <input
                        name="headline"
                        defaultValue={home.headline}
                        className={compactInputClassName}
                      />
                    </DoctorFormField>

                    <DoctorFormField label="Subheadline">
                      <textarea
                        name="subheadline"
                        defaultValue={home.subheadline}
                        rows={3}
                        className={compactTextareaClassName}
                      />
                    </DoctorFormField>
                  </div>

                  <div className="grid gap-4">
                    <FieldGroup title="Primary Call To Action">
                      <div className="grid gap-4">
                        <DoctorFormField label="Primary CTA Text">
                          <input
                            name="primaryCtaText"
                            defaultValue={home.primaryCtaText}
                            placeholder="Primary CTA Text"
                            className={compactInputClassName}
                          />
                        </DoctorFormField>

                        <DoctorFormField label="Primary CTA Link">
                          <input
                            name="primaryCtaLink"
                            defaultValue={home.primaryCtaLink}
                            placeholder="Primary CTA Link"
                            className={compactInputClassName}
                          />
                        </DoctorFormField>
                      </div>
                    </FieldGroup>

                    <FieldGroup title="Secondary Call To Action">
                      <div className="grid gap-4">
                        <DoctorFormField label="Secondary CTA Text">
                          <input
                            name="secondaryCtaText"
                            defaultValue={home.secondaryCtaText}
                            placeholder="Secondary CTA Text"
                            className={compactInputClassName}
                          />
                        </DoctorFormField>

                        <DoctorFormField label="Secondary CTA Link">
                          <input
                            name="secondaryCtaLink"
                            defaultValue={home.secondaryCtaLink}
                            placeholder="Secondary CTA Link"
                            className={compactInputClassName}
                          />
                        </DoctorFormField>
                      </div>
                    </FieldGroup>
                  </div>
                </div>
              </Subsection>

              <Subsection
                eyebrow="Stats"
                title="Homepage Stats"
                description="These quick numbers appear as the homepage stats highlights."
              >
                <div className="grid gap-4 lg:grid-cols-3">
                  {home.stats.map((stat, idx) => (
                    <FieldGroup key={`${stat.label}-${idx}`} title={`Stat ${idx + 1}`}>
                      <div className="grid gap-4">
                        <DoctorFormField label="Label">
                          <input
                            name={`stat${idx + 1}Label`}
                            defaultValue={stat.label}
                            placeholder="Label"
                            className={compactInputClassName}
                          />
                        </DoctorFormField>

                        <DoctorFormField label="Value">
                          <input
                            name={`stat${idx + 1}Value`}
                            defaultValue={stat.value}
                            placeholder="Value"
                            className={compactInputClassName}
                          />
                        </DoctorFormField>
                      </div>
                    </FieldGroup>
                  ))}
                </div>
              </Subsection>

              <SaveBar
                title="Ready to update the homepage?"
                description="Save these changes to refresh the public hero content, CTAs, and stats."
                buttonText="Save Home"
              />
            </form>
          </SectionShell>
        ) : null}
        {showContactSection ? (
          <SectionShell
            eyebrow="Contact & Footer"
            icon={<PanelsTopLeft className="h-5 w-5" />}
            title="Contact And Footer Settings"
            description="Update the public contact page, top contact strip, map details, working hours, and footer content."
            summary={
              <>
                <MetricCard
                  icon={<Phone className="h-5 w-5" />}
                  label="Phone"
                  value={contact.phone || "Not set"}
                  hint="Main public phone number."
                />
                <MetricCard
                  icon={<Mail className="h-5 w-5" />}
                  label="Email"
                  value={contact.email || "Not set"}
                  hint="Primary public contact email."
                />
                <MetricCard
                  icon={<MapPin className="h-5 w-5" />}
                  label="Map Button"
                  value={contact.mapLinkLabel || "Not set"}
                  hint="Call to action shown near the map."
                />
              </>
            }
          >
            <form action={updateContactAction} className="grid gap-5">
              <Subsection
                eyebrow="Contact"
                title="Main Contact Details"
                description="Address, city, phone, email, and map details shown publicly."
              >
                <div className="grid gap-5">
                  <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
                    <DoctorFormField label="Address">
                      <input name="address" defaultValue={contact.address} placeholder="Address" className={compactInputClassName} />
                    </DoctorFormField>
                    <DoctorFormField label="City">
                      <input name="city" defaultValue={contact.city} placeholder="City" className={compactInputClassName} />
                    </DoctorFormField>
                    <DoctorFormField label="Phone">
                      <input name="phone" defaultValue={contact.phone} placeholder="Phone" className={compactInputClassName} />
                    </DoctorFormField>
                    <DoctorFormField label="Email">
                      <input name="email" defaultValue={contact.email} placeholder="Email" className={compactInputClassName} />
                    </DoctorFormField>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_340px]">
                    <DoctorFormField label="Embedded Map URL">
                      <input name="mapUrl" defaultValue={contact.mapUrl} placeholder="Embedded map URL" className={compactInputClassName} />
                    </DoctorFormField>

                    <div className="grid gap-4">
                      <DoctorFormField label="Map Button Link URL">
                        <input name="mapLinkUrl" defaultValue={contact.mapLinkUrl} placeholder="Map button link URL" className={compactInputClassName} />
                      </DoctorFormField>
                      <DoctorFormField label="Map Button Label">
                        <input name="mapLinkLabel" defaultValue={contact.mapLinkLabel} placeholder="Map button label" className={compactInputClassName} />
                      </DoctorFormField>
                    </div>
                  </div>
                </div>
              </Subsection>

              <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
                <Subsection
                  eyebrow="Schedule"
                  title="Working Hours"
                  description="Opening hours used across contact and footer areas."
                >
                  <div className="grid gap-4">
                    <DoctorFormField label="Weekdays">
                      <input name="weekdaysHours" defaultValue={contact.workingHours.weekdays} placeholder="Weekdays" className={compactInputClassName} />
                    </DoctorFormField>
                    <DoctorFormField label="Saturday">
                      <input name="saturdayHours" defaultValue={contact.workingHours.saturday} placeholder="Saturday" className={compactInputClassName} />
                    </DoctorFormField>
                    <DoctorFormField label="Sunday">
                      <input name="sundayHours" defaultValue={contact.workingHours.sunday} placeholder="Sunday" className={compactInputClassName} />
                    </DoctorFormField>
                  </div>
                </Subsection>

                <Subsection
                  eyebrow="Strip"
                  title="Top Footer Strip"
                  description="Titles and helper text displayed in the top contact strip."
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    <FieldGroup title="Phone Block">
                      <div className="grid gap-4">
                        <DoctorFormField label="Phone Title">
                          <input name="phoneTitle" defaultValue={contact.topBar.phoneTitle} placeholder="Phone title" className={compactInputClassName} />
                        </DoctorFormField>
                        <DoctorFormField label="Phone Helper Text">
                          <textarea name="phoneText" rows={3} defaultValue={contact.topBar.phoneText} placeholder="Phone helper text" className={compactTextareaClassName} />
                        </DoctorFormField>
                      </div>
                    </FieldGroup>

                    <FieldGroup title="Email Block">
                      <div className="grid gap-4">
                        <DoctorFormField label="Email Title">
                          <input name="emailTitle" defaultValue={contact.topBar.emailTitle} placeholder="Email title" className={compactInputClassName} />
                        </DoctorFormField>
                        <DoctorFormField label="Email Helper Text">
                          <textarea name="emailText" rows={3} defaultValue={contact.topBar.emailText} placeholder="Email helper text" className={compactTextareaClassName} />
                        </DoctorFormField>
                      </div>
                    </FieldGroup>

                    <FieldGroup title="Location Block">
                      <div className="grid gap-4">
                        <DoctorFormField label="Location Title">
                          <input name="locationTitle" defaultValue={contact.topBar.locationTitle} placeholder="Location title" className={compactInputClassName} />
                        </DoctorFormField>
                        <DoctorFormField label="Location Helper Text">
                          <textarea name="locationText" rows={3} defaultValue={contact.topBar.locationText} placeholder="Location helper text" className={compactTextareaClassName} />
                        </DoctorFormField>
                      </div>
                    </FieldGroup>
                  </div>
                </Subsection>
              </div>

              <Subsection
                eyebrow="Footer"
                title="Footer Content"
                description="Footer branding, section headings, social links, treatments, and copyright."
              >
                <div className="grid gap-5">
                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <FieldGroup title="Brand And Sections">
                      <div className="grid gap-4 md:grid-cols-2">
                        <DoctorFormField label="Brand Name">
                          <input name="brandName" defaultValue={contact.footer.brandName} placeholder="Brand name" className={compactInputClassName} />
                        </DoctorFormField>
                        <DoctorFormField label="Social Section Title">
                          <input name="connectTitle" defaultValue={contact.footer.connectTitle} placeholder="Social section title" className={compactInputClassName} />
                        </DoctorFormField>
                        <DoctorFormField label="Quick Links Title">
                          <input name="quickLinksTitle" defaultValue={contact.footer.quickLinksTitle} placeholder="Quick links title" className={compactInputClassName} />
                        </DoctorFormField>
                        <DoctorFormField label="Treatments Title">
                          <input name="treatmentsTitle" defaultValue={contact.footer.treatmentsTitle} placeholder="Treatments title" className={compactInputClassName} />
                        </DoctorFormField>
                        <DoctorFormField label="Map Section Title">
                          <input name="mapSectionTitle" defaultValue={contact.footer.mapSectionTitle} placeholder="Map section title" className={compactInputClassName} />
                        </DoctorFormField>
                      </div>
                    </FieldGroup>

                    <FieldGroup title="Social Links">
                      <div className="grid gap-4">
                        <DoctorFormField label="Facebook URL">
                          <input name="facebookUrl" defaultValue={contact.footer.facebookUrl} placeholder="Facebook URL" className={compactInputClassName} />
                        </DoctorFormField>
                        <DoctorFormField label="Instagram URL">
                          <input name="instagramUrl" defaultValue={contact.footer.instagramUrl} placeholder="Instagram URL" className={compactInputClassName} />
                        </DoctorFormField>
                        <DoctorFormField label="WhatsApp URL">
                          <input name="whatsappUrl" defaultValue={contact.footer.whatsappUrl} placeholder="WhatsApp URL" className={compactInputClassName} />
                        </DoctorFormField>
                      </div>
                    </FieldGroup>
                  </div>

                  <DoctorFormField label="Treatments">
                    <textarea name="treatments" rows={5} defaultValue={contact.footer.treatments.join("\n")} placeholder="One treatment per line" className={compactTextareaClassName} />
                  </DoctorFormField>

                  <DoctorFormField label="Copyright Text">
                    <textarea name="copyright" rows={3} defaultValue={contact.footer.copyright} placeholder="Copyright text" className={compactTextareaClassName} />
                  </DoctorFormField>

                  <p className="text-xs text-[var(--muted)]">
                    Use one treatment per line. You can keep <span className="font-semibold">{"{year}"}</span> inside the copyright text and it will be replaced automatically.
                  </p>
                </div>
              </Subsection>

              <SaveBar
                title="Ready to update the contact experience?"
                description="Save these changes to refresh public contact details, working hours, and footer content."
                buttonText="Save Contact Settings"
              />
            </form>
          </SectionShell>
        ) : null}
        {!showHomeSection && !showContactSection ? (
          <article className="rounded-[24px] border border-[#dce8fb] bg-white p-8 text-center text-sm text-[var(--muted)] shadow-[0_12px_28px_-24px_rgba(17,24,39,0.25)]">
            No settings sections match your current search or filter.
          </article>
        ) : null}
      </div>
    </article>
  );
}
