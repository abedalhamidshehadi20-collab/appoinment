"use client";

import Link from "next/link";

export function SiteFooter() {
  const showFooterLocation = true;

  return (
    <footer className="mt-14 border-t border-[var(--line)] bg-white">
      <section className="bg-[#0f172a] py-3.5 text-white">
        <div className="container grid gap-4 md:grid-cols-3">
          <article>
            <h3 className="text-lg font-bold">Phone</h3>
            <p className="mt-1 text-sm leading-5 text-slate-300">
              Your health doesn&apos;t wait, and neither do we. Call to reach out to us now.
            </p>
            <p className="mt-1 text-sm font-semibold text-[#60a5fa]">+91 12345 67890</p>
          </article>

          <article>
            <h3 className="text-lg font-bold">Email</h3>
            <p className="mt-1 text-sm leading-5 text-slate-300">
              We look forward to helping you achieve better health. Reach out to us now.
            </p>
            <p className="mt-1 text-sm font-semibold text-[#60a5fa]">contact@example.com</p>
          </article>

          <article>
            <h3 className="text-lg font-bold">Location</h3>
            <p className="mt-1 text-sm leading-5 text-slate-300">
              270, Amit Plaza, Skyline Avenue, Heritage Enclave, West Gujarat, 370001.
            </p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-sm font-semibold text-[#60a5fa]"
            >
              View On Google Map
            </a>
          </article>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-2">
        <div className={`container grid gap-3 ${showFooterLocation ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
          <article>
            <div className="flex items-center gap-2 text-2xl font-black text-[var(--brand)]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand)] text-sm text-white">SH</span>
              Sh-Med
            </div>
            <p className="mt-0.5 text-sm leading-4.5 text-[var(--muted)]">
              2nd Floor, Prime Square, Airport Road, Heritage District, Gujarat 370001
            </p>
            <p className="mt-0.5 text-sm leading-4.5 text-[var(--muted)]">contact@example.com</p>
            <p className="text-sm leading-4.5 text-[var(--muted)]">+91 12345 67890</p>

            <p className="mt-1 text-sm font-bold text-[var(--brand-deep)]">Connect With Us</p>
            <div className="mt-0.5 flex gap-1.5 text-xs">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-[#bfdbfe] text-[10px] text-[var(--brand)]">f</span>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-[#bfdbfe] text-[10px] text-[var(--brand)]">ig</span>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-[#bfdbfe] text-[10px] text-[var(--brand)]">wa</span>
            </div>
          </article>

          <article>
            <h4 className="text-lg font-bold text-[var(--brand-deep)]">Quick Links</h4>
            <ul className="mt-0.5 space-y-0 text-sm leading-4.5 text-[var(--muted)]">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/services">Surgeries</Link></li>
              <li><Link href="/doctors">Doctors</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/appointments">Book Appointment</Link></li>
              <li><Link href="/news">Privacy Policy</Link></li>
            </ul>
          </article>

          <article>
            <h4 className="text-lg font-bold text-[var(--brand-deep)]">Treatments</h4>
            <ul className="mt-0.5 space-y-0 text-sm leading-4.5 text-[var(--muted)]">
              <li>Hearing Loss</li>
              <li>Ear Infection</li>
              <li>Dizziness &amp; Vertigo</li>
              <li>Allergy Rhinitis</li>
              <li>Swallowing Disorders</li>
            </ul>
          </article>

          {showFooterLocation ? (
            <article>
              <h4 className="text-lg font-bold text-[var(--brand-deep)]">Location</h4>
              <iframe
                title="Footer location map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=72.48%2C23.00%2C72.68%2C23.14&layer=mapnik"
                className="mt-0.5 h-24 w-full rounded border border-[var(--line)] bg-white"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </article>
          ) : null}
        </div>

        <div className="container mt-1.5 border-t border-[var(--line)] pt-1.5 text-center text-xs text-[var(--muted)]">
          &copy; {new Date().getFullYear()} Sh-Med. All rights reserved. This site is protected by reCAPTCHA and the Google Terms and Sitemap.
        </div>
      </section>
    </footer>
  );
}
