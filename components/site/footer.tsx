"use client";

import Link from "next/link";

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
      <path d="M12 4.8a7.2 7.2 0 0 0-6.2 10.9l-.8 3 3.1-.8A7.2 7.2 0 1 0 12 4.8Zm0 12.9c-1.1 0-2.3-.3-3.2-.9l-.2-.1-1.8.5.5-1.7-.1-.2A5.8 5.8 0 1 1 12 17.7Zm3.2-4.2c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1l-.4.5c-.1.1-.2.1-.4 0a4.7 4.7 0 0 1-2.3-2c-.1-.2 0-.3.1-.4l.3-.4.2-.3v-.4c-.1-.1-.5-1.1-.7-1.5-.1-.3-.3-.3-.5-.3h-.4c-.1 0-.4.1-.6.3s-.8.8-.8 1.9  .8 2.2.9 2.4c.1.1 1.5 2.3 3.7 3.2 2.1.8 2.1.5 2.5.5.4-.1 1.2-.5 1.4-1 .2-.5.2-1 .1-1.1 0-.1-.2-.1-.4-.2Z" />
    </svg>
  );
}

export function SiteFooter() {
  const showFooterLocation = true;

  return (
    <footer className="mt-14 border-t border-[var(--line)] bg-white">
      <section className="bg-[#0f172a] py-5 text-white">
        <div className="container grid gap-8 md:grid-cols-3 md:gap-12">
          <article className="space-y-2">
            <h3 className="text-lg font-bold">Phone</h3>
            <p className="text-sm leading-6 text-slate-300">
              Your health doesn&apos;t wait, and neither do we. Call to reach out to us now.
            </p>
            <p className="text-sm font-semibold text-[#60a5fa]">+961 81865142</p>
          </article>

          <article className="space-y-2">
            <h3 className="text-lg font-bold">Email</h3>
            <p className="text-sm leading-6 text-slate-300">
              We look forward to helping you achieve better health. Reach out to us now.
            </p>
            <p className="text-sm font-semibold text-[#60a5fa]">abedalhamidshehadi20@gmail.com</p>
          </article>

          <article className="space-y-2">
            <h3 className="text-lg font-bold">Location</h3>
            <p className="text-sm leading-6 text-slate-300">
              Eastern Highway, Saida|Lebanon
            </p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-block text-sm font-semibold text-[#60a5fa]"
            >
              View On Google Map
            </a>
          </article>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-6">
        <div className={`container grid gap-8 ${showFooterLocation ? "md:grid-cols-4 md:gap-10" : "md:grid-cols-3 md:gap-10"}`}>
          <article className="space-y-2.5">
            <div className="flex items-center gap-2 text-2xl font-black text-[var(--brand)]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand)] text-sm text-white">SH</span>
              Sh-Med
            </div>
            <p className="text-sm leading-6 text-[var(--muted)]">
              2nd Floor, Prime Square, Airport Road, Heritage District, Gujarat 370001
            </p>
            <p className="text-sm leading-6 text-[var(--muted)]">contact@example.com</p>
            <p className="text-sm leading-6 text-[var(--muted)]">+91 12345 67890</p>

            <p className="pt-1 text-sm font-bold text-[var(--brand-deep)]">Connect With Us</p>
            <div className="flex gap-2 text-xs">
              <span
                aria-label="Facebook"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#bfdbfe] text-[var(--brand)]"
              >
                <FacebookIcon />
              </span>
              <span
                aria-label="Instagram"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#bfdbfe] text-[var(--brand)]"
              >
                <InstagramIcon />
              </span>
              <span
                aria-label="WhatsApp"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#bfdbfe] text-[var(--brand)]"
              >
                <WhatsAppIcon />
              </span>
            </div>
          </article>

          <article className="space-y-3">
            <h4 className="text-lg font-bold text-[var(--brand-deep)]">Quick Links</h4>
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
            <h4 className="text-lg font-bold text-[var(--brand-deep)]">Treatments</h4>
            <ul className="space-y-2 text-sm leading-6 text-[var(--muted)]">
              <li>Hearing Loss</li>
              <li>Ear Infection</li>
              <li>Dizziness &amp; Vertigo</li>
              <li>Allergy Rhinitis</li>
              <li>Swallowing Disorders</li>
            </ul>
          </article>

          {showFooterLocation ? (
            <article className="space-y-3">
              <h4 className="text-lg font-bold text-[var(--brand-deep)]">Location</h4>
              <iframe
                title="Footer location map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=72.48%2C23.00%2C72.68%2C23.14&layer=mapnik"
                className="h-24 w-full rounded border border-[var(--line)] bg-white"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </article>
          ) : null}
        </div>

        <div className="container mt-6 border-t border-[var(--line)] pt-4 text-center text-xs text-[var(--muted)]">
          &copy; {new Date().getFullYear()} Sh-Med. All rights reserved. This site is protected by reCAPTCHA and the Google Terms and Sitemap.
        </div>
      </section>
    </footer>
  );
}
