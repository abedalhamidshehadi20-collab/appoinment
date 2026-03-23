"use client";

import { useState } from "react";

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

type Doctor = {
  id: string;
  title: string;
};

type Props = {
  doctors: Doctor[];
  showSuccess: boolean;
  isPatientLoggedIn: boolean;
};

export default function ContactFormToggle({ showSuccess, isPatientLoggedIn }: Props) {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <section className="mt-16">
      {/* Toggle Button */}
      {!isFormVisible && isPatientLoggedIn && (
        <div className="flex justify-center">
          <button
            onClick={() => setIsFormVisible(true)}
            className="rounded-lg border border-[#1f2937] px-8 py-3 text-sm font-medium text-[#1f2937] transition hover:border-[var(--brand)] hover:bg-[var(--brand)] hover:text-white"
          >
            Contact Form
          </button>
        </div>
      )}

      {!isPatientLoggedIn ? (
        <div className="flex justify-center">
          <a
            href="/login?next=%2Fcontact"
            className="rounded-lg border border-[#1f2937] px-8 py-3 text-sm font-medium text-[#1f2937] transition hover:border-[var(--brand)] hover:bg-[var(--brand)] hover:text-white"
          >
            Login as patient to contact us
          </a>
        </div>
      ) : null}

      {/* Contact Form Section */}
      {isFormVisible && isPatientLoggedIn && (
        <div className="fade-up mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <article className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#1d4f91_0%,#2377e7_55%,#6fb3ff_100%)] p-8 text-white shadow-[0_24px_60px_-32px_rgba(29,79,145,0.65)]">
            <span className="inline-flex rounded-full border border-white/20 bg-white/12 px-4 py-1 text-xs font-bold uppercase tracking-[0.24em]">
              Contact Us
            </span>
            <h1 className="mt-5 max-w-md text-4xl font-extrabold leading-tight">
              Get in touch and let us help guide your next visit.
            </h1>
            <p className="mt-4 max-w-lg text-sm text-white/80">
              Reach out for appointments, questions, or support. Our team is here to help patients
              connect with the right care in a simple and friendly way.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-white/90 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/18 bg-white/10 p-4">
                Fast responses for patient questions
              </div>
              <div className="rounded-2xl border border-white/18 bg-white/10 p-4">
                Help with appointment requests
              </div>
              <div className="rounded-2xl border border-white/18 bg-white/10 p-4">
                Guidance to the right doctor
              </div>
              <div className="rounded-2xl border border-white/18 bg-white/10 p-4">
                Friendly support from our team
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/85">Stay Connected</p>
              <div className="mt-3 flex gap-3">
                <span
                  aria-label="Facebook"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/18 bg-white/10 text-white"
                >
                  <FacebookIcon />
                </span>
                <span
                  aria-label="Instagram"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/18 bg-white/10 text-white"
                >
                  <InstagramIcon />
                </span>
              </div>
            </div>
          </article>

          <article className="card rounded-[28px] p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">Contact Form</p>
                <h2 className="mt-3 text-3xl font-extrabold">Leave Us Your Info</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Fill out the form and we will get back to you as soon as possible.
                </p>
              </div>
              <button
                onClick={() => setIsFormVisible(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)] text-[var(--muted)] transition hover:bg-[#f3f4f6]"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {showSuccess ? (
              <p className="mt-6 rounded-2xl border border-[#bde5cb] bg-[#ecfff3] p-4 text-sm font-medium text-[#145f39]">
                Your message has been sent successfully.
              </p>
            ) : null}

            <form action="/api/public/contact" method="post" className="mt-8 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
                  Full Name
                  <input
                    required
                    name="name"
                    placeholder="Full name"
                    className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
                  Phone Number
                  <input
                    name="phone"
                    placeholder="+1"
                    className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
                  Email Address
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
                  Subject
                  <input
                    name="subject"
                    placeholder="Subject"
                    className="h-12 rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm font-semibold text-[var(--brand-deep)]">
                Message
                <textarea
                  required
                  name="message"
                  rows={5}
                  placeholder="Write your message"
                  className="rounded-2xl border border-[var(--line)] bg-[#fbfdff] px-4 py-3 text-sm font-medium outline-none transition focus:border-[#9ec5ff] focus:bg-white"
                />
              </label>

              <p className="text-center text-xs text-[var(--muted)]">* These fields are required</p>
              <button className="mt-1 inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--brand)] px-6 text-sm font-semibold text-white transition hover:bg-[#1f68cb]">
                Submit Now
              </button>
            </form>
          </article>
        </div>
      )}
    </section>
  );
}
