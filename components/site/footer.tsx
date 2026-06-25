import { ReactNode } from "react";
import Link from "next/link";
import { getSiteSettings, normalizeContactSettings } from "@/lib/db";

function FacebookIcon({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M13.5 21v-7h2.3l.4-3h-2.7V9.1c0-.9.3-1.6 1.6-1.6H16V4.8c-.4-.1-1.3-.2-2.4-.2-2.4 0-4 1.4-4 4.2V11H7v3h2.5v7h4Z" />
    </svg>
  );
}

function InstagramIcon({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="4.25" />
      <circle cx="12" cy="12" r="3.75" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 4.8a7.2 7.2 0 0 0-6.2 10.9l-.8 3 3.1-.8A7.2 7.2 0 1 0 12 4.8Zm0 12.9c-1.1 0-2.3-.3-3.2-.9l-.2-.1-1.8.5.5-1.7-.1-.2A5.8 5.8 0 1 1 12 17.7Zm3.2-4.2c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1l-.4.5c-.1.1-.2.1-.4 0a4.7 4.7 0 0 1-2.3-2c-.1-.2 0-.3.1-.4l.3-.4.2-.3v-.4c-.1-.1-.5-1.1-.7-1.5-.1-.3-.3-.3-.5-.3h-.4c-.1 0-.4.1-.6.3s-.8.8-.8 1.9.8 2.2.9 2.4c.1.1 1.5 2.3 3.7 3.2 2.1.8 2.1.5 2.5.5.4-.1 1.2-.5 1.4-1 .2-.5.2-1 .1-1.1 0-.1-.2-.1-.4-.2Z" />
    </svg>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href?: string;
  label: string;
  children: ReactNode;
}) {
  const className =
    "inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#bfdbfe] text-[var(--brand)]";

  if (!href) {
    return (
      <span aria-label={label} className={className}>
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={className}
    >
      {children}
    </a>
  );
}

export async function SiteFooter() {
  const settings = await getSiteSettings().catch(() => null);
  const contactInfo = normalizeContactSettings(settings?.contact);
  const showFooterLocation = Boolean(contactInfo.mapUrl);
  const footerAddress = [contactInfo.address, contactInfo.city].filter(Boolean).join(", ");
  const copyright = contactInfo.footer.copyright.replace(
    /\{year\}/g,
    String(new Date().getFullYear()),
  );
  const brandInitials =
    contactInfo.footer.brandName
      .split(/\s+/)
      .map((item) => item.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SH";

  return (
    <footer className="mt-14 border-t border-[var(--line)] bg-white">
      <section className="bg-[#0f172a] py-5 text-white">
        <div className="container grid gap-8 md:grid-cols-3 md:gap-12">
          <article className="space-y-2">
            <h3 className="text-lg font-bold">{contactInfo.topBar.phoneTitle}</h3>
            <p className="text-sm leading-6 text-slate-300">{contactInfo.topBar.phoneText}</p>
            <p className="text-sm font-semibold text-[#60a5fa]">{contactInfo.phone}</p>
          </article>

          <article className="space-y-2">
            <h3 className="text-lg font-bold">{contactInfo.topBar.emailTitle}</h3>
            <p className="text-sm leading-6 text-slate-300">{contactInfo.topBar.emailText}</p>
            <p className="text-sm font-semibold text-[#60a5fa]">{contactInfo.email}</p>
          </article>

          <article className="space-y-2">
            <h3 className="text-lg font-bold">{contactInfo.topBar.locationTitle}</h3>
            <p className="text-sm leading-6 text-slate-300">{contactInfo.topBar.locationText}</p>
            <a
              href={contactInfo.mapLinkUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-sm font-semibold text-[#60a5fa]"
            >
              {contactInfo.mapLinkLabel}
            </a>
          </article>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-6">
        <div className={`container grid gap-8 ${showFooterLocation ? "md:grid-cols-4 md:gap-10" : "md:grid-cols-3 md:gap-10"}`}>
          <article className="space-y-2.5">
            <div className="flex items-center gap-2 text-2xl font-black text-[var(--brand)]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand)] text-sm text-white">
                {brandInitials}
              </span>
              {contactInfo.footer.brandName}
            </div>
            <p className="text-sm leading-6 text-[var(--muted)]">{footerAddress}</p>
            <p className="text-sm leading-6 text-[var(--muted)]">{contactInfo.email}</p>
            <p className="text-sm leading-6 text-[var(--muted)]">{contactInfo.phone}</p>

            <p className="pt-1 text-sm font-bold text-[var(--brand-deep)]">{contactInfo.footer.connectTitle}</p>
            <div className="flex gap-2 text-xs">
              <SocialLink href={contactInfo.footer.facebookUrl} label="Facebook">
                <FacebookIcon />
              </SocialLink>
              <SocialLink href={contactInfo.footer.instagramUrl} label="Instagram">
                <InstagramIcon />
              </SocialLink>
              <SocialLink href={contactInfo.footer.whatsappUrl} label="WhatsApp">
                <WhatsAppIcon />
              </SocialLink>
            </div>
          </article>

          <article className="space-y-3">
            <h4 className="text-lg font-bold text-[var(--brand-deep)]">{contactInfo.footer.quickLinksTitle}</h4>
            <ul className="space-y-2 text-sm leading-6 text-[var(--muted)]">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/services">Surgeries</Link></li>
              <li><Link href="/doctors">Doctors</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/appointments">Book Appointment</Link></li>
              <li><Link href="/news">Privacy Policy</Link></li>
            </ul>
          </article>

          <article className="space-y-3">
            <h4 className="text-lg font-bold text-[var(--brand-deep)]">{contactInfo.footer.treatmentsTitle}</h4>
            <ul className="space-y-2 text-sm leading-6 text-[var(--muted)]">
              {contactInfo.footer.treatments.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          {showFooterLocation ? (
            <article className="space-y-3">
              <h4 className="text-lg font-bold text-[var(--brand-deep)]">{contactInfo.footer.mapSectionTitle}</h4>
              <iframe
                title="Footer location map"
                src={contactInfo.mapUrl}
                className="h-24 w-full rounded border border-[var(--line)] bg-white"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </article>
          ) : null}
        </div>

        <div className="container mt-6 border-t border-[var(--line)] pt-4 text-center text-xs text-[var(--muted)]">
          {copyright}
        </div>
      </section>
    </footer>
  );
}
