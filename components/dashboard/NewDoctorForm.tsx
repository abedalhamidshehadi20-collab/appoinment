"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { saveProjectAction } from "@/app/dashboard/actions";
import { Modal } from "@/components/ui/Modal";

type DraftCredential = {
  email: string;
  password: string;
};

const defaultAvailableTimes =
  "8:00 am\n8:30 am\n9:00 am\n9:30 am\n10:00 am\n10:30 am\n11:00 am\n11:30 am";

const inputClassName =
  "h-12 w-full rounded-2xl border border-[#dfe8f8] bg-[#f8fbff] px-4 text-sm text-[var(--brand-deep)] outline-none transition placeholder:text-[#8da0be] focus:border-[#bfd5ff] focus:bg-white focus:ring-4 focus:ring-[#e8f0ff]";

const textareaClassName =
  "w-full rounded-2xl border border-[#dfe8f8] bg-[#f8fbff] px-4 py-3 text-sm text-[var(--brand-deep)] outline-none transition placeholder:text-[#8da0be] focus:border-[#bfd5ff] focus:bg-white focus:ring-4 focus:ring-[#e8f0ff]";

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[var(--brand-deep)]">
        {label}
      </span>
      {children}
    </label>
  );
}

export function NewDoctorForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [credential, setCredential] = useState<DraftCredential | null>(null);
  const [draftEmail, setDraftEmail] = useState("");
  const [draftPassword, setDraftPassword] = useState("");

  function handleOpenCredentialModal() {
    setDraftEmail(credential?.email ?? "");
    setDraftPassword(credential?.password ?? "");
    setIsModalOpen(true);
  }

  function handleSaveCredential(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setCredential({
      email: draftEmail.trim().toLowerCase(),
      password: draftPassword,
    });
    setIsModalOpen(false);
  }

  return (
    <>
      <form action={saveProjectAction} className="grid gap-5">
        {credential ? (
          <>
            <input
              type="hidden"
              name="doctorCredentialEmail"
              value={credential.email}
            />
            <input
              type="hidden"
              name="doctorCredentialPassword"
              value={credential.password}
            />
          </>
        ) : null}

        <Field label="Title">
          <input
            name="title"
            required
            placeholder="Title"
            className={inputClassName}
          />
        </Field>

        <Field label="Slug">
          <input
            name="slug"
            placeholder="Slug (optional)"
            className={inputClassName}
          />
        </Field>

        <Field label="Doctor Summary">
          <input
            name="excerpt"
            required
            placeholder="Doctor summary"
            className={inputClassName}
          />
        </Field>

        <Field label="Doctor Bio">
          <textarea
            name="description"
            required
            rows={4}
            placeholder="Doctor bio"
            className={textareaClassName}
          />
        </Field>

        <div className="grid gap-4 lg:grid-cols-3">
          <Field label="Specialty">
            <input
              name="sector"
              placeholder="Specialty"
              className={inputClassName}
            />
          </Field>

          <Field label="Clinic Location">
            <input
              name="location"
              placeholder="Clinic location"
              className={inputClassName}
            />
          </Field>

          <Field label="Status">
            <select
              name="status"
              defaultValue="Available"
              className={inputClassName}
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </Field>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Appointment Fee">
            <input
              name="appointmentFee"
              type="number"
              step="0.01"
              defaultValue={50}
              placeholder="Appointment Fee ($)"
              className={inputClassName}
            />
          </Field>

          <Field label="Years of Experience">
            <input
              name="yearsExperience"
              type="number"
              defaultValue={0}
              placeholder="Years of Experience"
              className={inputClassName}
            />
          </Field>
        </div>

        <Field label="Cover Image URL">
          <input
            name="coverImage"
            placeholder="Cover image URL"
            className={inputClassName}
          />
        </Field>

        <div className="grid gap-4 xl:grid-cols-2">
          <Field label="Gallery URLs">
            <textarea
              name="gallery"
              rows={4}
              placeholder="Gallery URLs (one per line)"
              className={textareaClassName}
            />
          </Field>

          <Field label="Doctor Highlights">
            <textarea
              name="details"
              rows={4}
              placeholder="Doctor highlights (one per line)"
              className={textareaClassName}
            />
          </Field>
        </div>

        <Field label="Available Time Slots">
          <textarea
            name="availableTimes"
            defaultValue={defaultAvailableTimes}
            rows={5}
            placeholder="Available time slots (one per line)"
            className={textareaClassName}
          />
        </Field>

        <div className="rounded-[24px] border border-[#dce8fb] bg-[#f8fbff] px-5 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                Doctor Login
              </p>
              <p className="text-sm font-medium text-[var(--brand-deep)]">
                {credential
                  ? `Email ready: ${credential.email}`
                  : "You can create the doctor login now, then save the profile with Add Doctor."}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleOpenCredentialModal}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  credential
                    ? "border border-[#d8e5fb] bg-white text-[var(--brand-deep)] hover:bg-[#f8fbff]"
                    : "bg-[var(--brand)] text-white hover:bg-[#1f68cb]"
                }`}
              >
                {credential ? "Update Email" : "Create Email"}
              </button>

              {credential ? (
                <button
                  type="button"
                  onClick={() => setCredential(null)}
                  className="rounded-xl border border-[#d8e5fb] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--brand-deep)] transition hover:bg-[#f8fbff]"
                >
                  Remove Email
                </button>
              ) : null}

              <button className="button button-primary rounded-xl px-5 py-2.5">
                Add Doctor
              </button>
            </div>
          </div>
        </div>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={credential ? "Update Doctor Email" : "Create Doctor Email"}
      >
        <form onSubmit={handleSaveCredential} className="grid gap-4">
          <Field label="Email">
            <input
              type="email"
              required
              value={draftEmail}
              onChange={(event) => setDraftEmail(event.target.value)}
              placeholder="doctor@example.com"
              className={inputClassName}
            />
          </Field>

          <Field label="Password">
            <input
              type="password"
              required
              value={draftPassword}
              onChange={(event) => setDraftPassword(event.target.value)}
              placeholder="Password"
              className={inputClassName}
            />
          </Field>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl border border-[#d8e5fb] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--brand-deep)] transition hover:bg-[#f8fbff]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f68cb]"
            >
              Save Email
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
