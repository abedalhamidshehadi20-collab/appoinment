"use client";

import { useState, type ReactNode } from "react";
import { updateContactAction, updateHomeAction } from "@/app/dashboard/actions";
import {
  DoctorFormField,
  inputClassName,
  textareaClassName,
} from "@/components/dashboard/doctor-form-ui";
import type { ContactSettings, SiteSettings } from "@/lib/db";
import {
  ChevronDown,
  Filter,
  House,
  PanelsTopLeft,
  Search,
} from "lucide-react";

type SectionFilter = "all" | "home" | "contact";

type HomeSettingsClientProps = {
  home: SiteSettings["home"];
  contact: ContactSettings;
};

function matchesQuery(query: string, terms: string[]) {
  if (!query) {
    return true;
  }

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
      className={`border-b-2 px-1 pb-3 text-sm font-semibold transition ${
        active
          ? "border-[var(--brand)] text-[var(--brand)]"
          : "border-transparent text-[var(--muted)] hover:text-[var(--brand-deep)]"
      }`}
    >
      {label}
    </button>
  );
}

function SectionShell({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-[24px] border border-[#dce8fb] bg-white p-5 shadow-[0_12px_28px_-24px_rgba(17,24,39,0.25)]">
      <div className="flex items-start gap-4">
        <div className="rounded-[18px] bg-[#eef4ff] p-3 text-[var(--brand)]">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div>
            <h2 className="text-xl font-bold text-[var(--brand-deep)]">
              {title}
            </h2>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              {description}
            </p>
          </div>

          <div className="mt-5">{children}</div>
        </div>
      </div>
    </article>
  );
}

function Subsection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[20px] border border-[#edf2fb] bg-[#fbfdff] p-4">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[var(--brand-deep)]">
          {title}
        </h3>
        <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
      </div>
      {children}
    </section>
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
    <article className="card overflow-hidden rounded-[28px] border border-[#e7eef9] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.28)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
            Home
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-[var(--brand-deep)]">
            Home Content Management
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Manage homepage messaging, public contact details, working hours, and footer content from one place.
          </p>
          <p className="mt-2 text-sm font-semibold text-[var(--brand-deep)]">
            2 editable sections
          </p>
        </div>
      </div>

      <div className="mt-8 border-b border-[#edf2fb]">
        <div className="flex flex-wrap items-center gap-6">
          <TabButton
            active={sectionFilter === "all"}
            label="All Sections"
            onClick={() => setSectionFilter("all")}
          />
          <TabButton
            active={sectionFilter === "home"}
            label="Homepage Content"
            onClick={() => setSectionFilter("home")}
          />
          <TabButton
            active={sectionFilter === "contact"}
            label="Contact & Footer"
            onClick={() => setSectionFilter("contact")}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search settings"
            className="h-11 w-full rounded-xl border border-[var(--line)] bg-white pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-[#bfd5ff] focus:ring-4 focus:ring-[#e8f0ff]"
          />
        </label>

        <label className="relative block">
          <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <select
            value={sectionFilter}
            onChange={(event) =>
              setSectionFilter(event.target.value as SectionFilter)
            }
            className="h-11 w-full appearance-none rounded-xl border border-[var(--line)] bg-white pl-11 pr-10 text-sm shadow-sm outline-none transition focus:border-[#bfd5ff] focus:ring-4 focus:ring-[#e8f0ff]"
          >
            <option value="all">All Sections</option>
            <option value="home">Homepage Content</option>
            <option value="contact">Contact & Footer</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
        </label>
      </div>

      <div className="mt-6 grid gap-5">
        {showHomeSection ? (
          <SectionShell
            icon={<House className="h-5 w-5" />}
            title="Homepage Content"
            description="Edit the homepage hero text, action buttons, and stat highlights shown on the public site."
          >
            <form action={updateHomeAction} className="grid gap-5">
              <Subsection
                title="Hero Content"
                description="Headline, supporting text, and primary calls to action for the homepage hero area."
              >
                <div className="grid gap-5">
                  <DoctorFormField label="Headline">
                    <input
                      name="headline"
                      defaultValue={home.headline}
                      className={inputClassName}
                    />
                  </DoctorFormField>

                  <DoctorFormField label="Subheadline">
                    <textarea
                      name="subheadline"
                      defaultValue={home.subheadline}
                      rows={4}
                      className={textareaClassName}
                    />
                  </DoctorFormField>

                  <div className="grid gap-5 md:grid-cols-2">
                    <DoctorFormField label="Primary CTA Text">
                      <input
                        name="primaryCtaText"
                        defaultValue={home.primaryCtaText}
                        placeholder="Primary CTA Text"
                        className={inputClassName}
                      />
                    </DoctorFormField>

                    <DoctorFormField label="Primary CTA Link">
                      <input
                        name="primaryCtaLink"
                        defaultValue={home.primaryCtaLink}
                        placeholder="Primary CTA Link"
                        className={inputClassName}
                      />
                    </DoctorFormField>

                    <DoctorFormField label="Secondary CTA Text">
                      <input
                        name="secondaryCtaText"
                        defaultValue={home.secondaryCtaText}
                        placeholder="Secondary CTA Text"
                        className={inputClassName}
                      />
                    </DoctorFormField>

                    <DoctorFormField label="Secondary CTA Link">
                      <input
                        name="secondaryCtaLink"
                        defaultValue={home.secondaryCtaLink}
                        placeholder="Secondary CTA Link"
                        className={inputClassName}
                      />
                    </DoctorFormField>
                  </div>
                </div>
              </Subsection>

              <Subsection
                title="Homepage Stats"
                description="These quick numbers appear as the homepage stats highlights."
              >
                <div className="grid gap-4">
                  {home.stats.map((stat, idx) => (
                    <div
                      key={`${stat.label}-${idx}`}
                      className="grid gap-4 md:grid-cols-2"
                    >
                      <DoctorFormField label={`Stat ${idx + 1} Label`}>
                        <input
                          name={`stat${idx + 1}Label`}
                          defaultValue={stat.label}
                          placeholder="Label"
                          className={inputClassName}
                        />
                      </DoctorFormField>

                      <DoctorFormField label={`Stat ${idx + 1} Value`}>
                        <input
                          name={`stat${idx + 1}Value`}
                          defaultValue={stat.value}
                          placeholder="Value"
                          className={inputClassName}
                        />
                      </DoctorFormField>
                    </div>
                  ))}
                </div>
              </Subsection>

              <div className="flex justify-end">
                <button className="button button-primary rounded-xl px-5 py-2.5">
                  Save Home
                </button>
              </div>
            </form>
          </SectionShell>
        ) : null}

        {showContactSection ? (
          <SectionShell
            icon={<PanelsTopLeft className="h-5 w-5" />}
            title="Contact And Footer Settings"
            description="Update the public contact page, top contact strip, map details, working hours, and footer content."
          >
            <form action={updateContactAction} className="grid gap-5">
              <Subsection
                title="Main Contact Details"
                description="Address, city, phone, email, and map details shown publicly."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <DoctorFormField label="Address">
                    <input
                      name="address"
                      defaultValue={contact.address}
                      placeholder="Address"
                      className={inputClassName}
                    />
                  </DoctorFormField>

                  <DoctorFormField label="City">
                    <input
                      name="city"
                      defaultValue={contact.city}
                      placeholder="City"
                      className={inputClassName}
                    />
                  </DoctorFormField>

                  <DoctorFormField label="Phone">
                    <input
                      name="phone"
                      defaultValue={contact.phone}
                      placeholder="Phone"
                      className={inputClassName}
                    />
                  </DoctorFormField>

                  <DoctorFormField label="Email">
                    <input
                      name="email"
                      defaultValue={contact.email}
                      placeholder="Email"
                      className={inputClassName}
                    />
                  </DoctorFormField>

                  <DoctorFormField label="Embedded Map URL">
                    <input
                      name="mapUrl"
                      defaultValue={contact.mapUrl}
                      placeholder="Embedded map URL"
                      className={inputClassName}
                    />
                  </DoctorFormField>

                  <DoctorFormField label="Map Button Link URL">
                    <input
                      name="mapLinkUrl"
                      defaultValue={contact.mapLinkUrl}
                      placeholder="Map button link URL"
                      className={inputClassName}
                    />
                  </DoctorFormField>

                  <div className="md:col-span-2">
                    <DoctorFormField label="Map Button Label">
                      <input
                        name="mapLinkLabel"
                        defaultValue={contact.mapLinkLabel}
                        placeholder="Map button label"
                        className={inputClassName}
                      />
                    </DoctorFormField>
                  </div>
                </div>
              </Subsection>

              <div className="grid gap-5 xl:grid-cols-2">
                <Subsection
                  title="Working Hours"
                  description="Opening hours used across contact and footer areas."
                >
                  <div className="grid gap-5">
                    <DoctorFormField label="Weekdays">
                      <input
                        name="weekdaysHours"
                        defaultValue={contact.workingHours.weekdays}
                        placeholder="Weekdays"
                        className={inputClassName}
                      />
                    </DoctorFormField>

                    <DoctorFormField label="Saturday">
                      <input
                        name="saturdayHours"
                        defaultValue={contact.workingHours.saturday}
                        placeholder="Saturday"
                        className={inputClassName}
                      />
                    </DoctorFormField>

                    <DoctorFormField label="Sunday">
                      <input
                        name="sundayHours"
                        defaultValue={contact.workingHours.sunday}
                        placeholder="Sunday"
                        className={inputClassName}
                      />
                    </DoctorFormField>
                  </div>
                </Subsection>

                <Subsection
                  title="Top Footer Strip"
                  description="Titles and helper text displayed in the top contact strip."
                >
                  <div className="grid gap-5">
                    <DoctorFormField label="Phone Title">
                      <input
                        name="phoneTitle"
                        defaultValue={contact.topBar.phoneTitle}
                        placeholder="Phone title"
                        className={inputClassName}
                      />
                    </DoctorFormField>

                    <DoctorFormField label="Phone Helper Text">
                      <textarea
                        name="phoneText"
                        rows={3}
                        defaultValue={contact.topBar.phoneText}
                        placeholder="Phone helper text"
                        className={textareaClassName}
                      />
                    </DoctorFormField>

                    <DoctorFormField label="Email Title">
                      <input
                        name="emailTitle"
                        defaultValue={contact.topBar.emailTitle}
                        placeholder="Email title"
                        className={inputClassName}
                      />
                    </DoctorFormField>

                    <DoctorFormField label="Email Helper Text">
                      <textarea
                        name="emailText"
                        rows={3}
                        defaultValue={contact.topBar.emailText}
                        placeholder="Email helper text"
                        className={textareaClassName}
                      />
                    </DoctorFormField>

                    <DoctorFormField label="Location Title">
                      <input
                        name="locationTitle"
                        defaultValue={contact.topBar.locationTitle}
                        placeholder="Location title"
                        className={inputClassName}
                      />
                    </DoctorFormField>

                    <DoctorFormField label="Location Helper Text">
                      <textarea
                        name="locationText"
                        rows={3}
                        defaultValue={contact.topBar.locationText}
                        placeholder="Location helper text"
                        className={textareaClassName}
                      />
                    </DoctorFormField>
                  </div>
                </Subsection>
              </div>

              <Subsection
                title="Footer Content"
                description="Footer branding, section headings, social links, treatments, and copyright."
              >
                <div className="grid gap-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <DoctorFormField label="Brand Name">
                      <input
                        name="brandName"
                        defaultValue={contact.footer.brandName}
                        placeholder="Brand name"
                        className={inputClassName}
                      />
                    </DoctorFormField>

                    <DoctorFormField label="Social Section Title">
                      <input
                        name="connectTitle"
                        defaultValue={contact.footer.connectTitle}
                        placeholder="Social section title"
                        className={inputClassName}
                      />
                    </DoctorFormField>

                    <DoctorFormField label="Quick Links Title">
                      <input
                        name="quickLinksTitle"
                        defaultValue={contact.footer.quickLinksTitle}
                        placeholder="Quick links title"
                        className={inputClassName}
                      />
                    </DoctorFormField>

                    <DoctorFormField label="Treatments Title">
                      <input
                        name="treatmentsTitle"
                        defaultValue={contact.footer.treatmentsTitle}
                        placeholder="Treatments title"
                        className={inputClassName}
                      />
                    </DoctorFormField>

                    <DoctorFormField label="Map Section Title">
                      <input
                        name="mapSectionTitle"
                        defaultValue={contact.footer.mapSectionTitle}
                        placeholder="Map section title"
                        className={inputClassName}
                      />
                    </DoctorFormField>

                    <DoctorFormField label="Facebook URL">
                      <input
                        name="facebookUrl"
                        defaultValue={contact.footer.facebookUrl}
                        placeholder="Facebook URL"
                        className={inputClassName}
                      />
                    </DoctorFormField>

                    <DoctorFormField label="Instagram URL">
                      <input
                        name="instagramUrl"
                        defaultValue={contact.footer.instagramUrl}
                        placeholder="Instagram URL"
                        className={inputClassName}
                      />
                    </DoctorFormField>

                    <DoctorFormField label="WhatsApp URL">
                      <input
                        name="whatsappUrl"
                        defaultValue={contact.footer.whatsappUrl}
                        placeholder="WhatsApp URL"
                        className={inputClassName}
                      />
                    </DoctorFormField>
                  </div>

                  <DoctorFormField label="Treatments">
                    <textarea
                      name="treatments"
                      rows={6}
                      defaultValue={contact.footer.treatments.join("\n")}
                      placeholder="One treatment per line"
                      className={textareaClassName}
                    />
                  </DoctorFormField>

                  <DoctorFormField label="Copyright Text">
                    <textarea
                      name="copyright"
                      rows={4}
                      defaultValue={contact.footer.copyright}
                      placeholder="Copyright text"
                      className={textareaClassName}
                    />
                  </DoctorFormField>

                  <p className="text-xs text-[var(--muted)]">
                    Use one treatment per line. You can keep{" "}
                    <span className="font-semibold">{"{year}"}</span> inside the
                    copyright text and it will be replaced automatically.
                  </p>
                </div>
              </Subsection>

              <div className="flex justify-end">
                <button className="button button-primary rounded-xl px-5 py-2.5">
                  Save Contact Settings
                </button>
              </div>
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
