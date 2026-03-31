"use client";

import { useState, useTransition, type FormEvent } from "react";
import { saveProjectAction } from "@/app/dashboard/actions";
import {
  DoctorFormField,
  defaultAvailableTimes,
  inputClassName,
  textareaClassName,
} from "@/components/dashboard/doctor-form-ui";
import { Modal } from "@/components/ui/Modal";

type DraftCredential = {
  email: string;
  password: string;
};

export function NewDoctorForm({
  onCancel,
}: {
  onCancel?: () => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, startTransition] = useTransition();
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      await saveProjectAction(formData);
      onCancel?.();
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
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

        <DoctorFormField label="Title">
          <input
            name="title"
            required
            placeholder="Title"
            className={inputClassName}
          />
        </DoctorFormField>

        <DoctorFormField label="Slug">
          <input
            name="slug"
            placeholder="Slug (optional)"
            className={inputClassName}
          />
        </DoctorFormField>

        <DoctorFormField label="Doctor Summary">
          <input
            name="excerpt"
            required
            placeholder="Doctor summary"
            className={inputClassName}
          />
        </DoctorFormField>

        <div className="md:col-span-2">
          <DoctorFormField label="Doctor Bio">
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Doctor bio"
              className={textareaClassName}
            />
          </DoctorFormField>
        </div>

        <div className="grid gap-6 md:col-span-2 md:grid-cols-3">
          <DoctorFormField label="Specialty">
            <input
              name="sector"
              placeholder="Specialty"
              className={inputClassName}
            />
          </DoctorFormField>

          <DoctorFormField label="Clinic Location">
            <input
              name="location"
              placeholder="Clinic location"
              className={inputClassName}
            />
          </DoctorFormField>

          <DoctorFormField label="Status">
            <select
              name="status"
              defaultValue="Available"
              className={inputClassName}
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </DoctorFormField>
        </div>

        <div className="grid gap-6 md:col-span-2 md:grid-cols-2">
          <DoctorFormField label="Appointment Fee">
            <input
              name="appointmentFee"
              type="number"
              step="0.01"
              defaultValue={50}
              placeholder="Appointment Fee ($)"
              className={inputClassName}
            />
          </DoctorFormField>

          <DoctorFormField label="Years of Experience">
            <input
              name="yearsExperience"
              type="number"
              defaultValue={0}
              placeholder="Years of Experience"
              className={inputClassName}
            />
          </DoctorFormField>
        </div>

        <div className="md:col-span-2">
          <DoctorFormField label="Cover Image URL">
            <input
              name="coverImage"
              placeholder="Cover image URL"
              className={inputClassName}
            />
          </DoctorFormField>
        </div>

        <DoctorFormField label="Gallery URLs">
          <textarea
            name="gallery"
            rows={4}
            placeholder="Gallery URLs (one per line)"
            className={textareaClassName}
          />
        </DoctorFormField>

        <DoctorFormField label="Doctor Highlights">
          <textarea
            name="details"
            rows={4}
            placeholder="Doctor highlights (one per line)"
            className={textareaClassName}
          />
        </DoctorFormField>

        <div className="md:col-span-2">
          <DoctorFormField label="Available Time Slots">
            <textarea
              name="availableTimes"
              defaultValue={defaultAvailableTimes}
              rows={5}
              placeholder="Available time slots (one per line)"
              className={textareaClassName}
            />
          </DoctorFormField>
        </div>

        <div className="md:col-span-2 border-t border-[#edf2fb] pt-2">
          <div className="flex flex-col gap-5">
            <div className="rounded-[24px] border border-[#dce8fb] bg-[#f8fbff] px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                  Doctor Login
                </p>
                <p className="mt-1 text-sm font-medium text-[var(--brand-deep)]">
                  {credential
                    ? `Email ready: ${credential.email}`
                    : "You can create the doctor login now, then save the profile with Add Doctor."}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenCredentialModal}
                  disabled={isSubmitting}
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
                    disabled={isSubmitting}
                    className="rounded-xl border border-[#d8e5fb] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--brand-deep)] transition hover:bg-[#f8fbff]"
                  >
                    Remove Email
                  </button>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              {onCancel ? (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="rounded-xl border border-[#d8e5fb] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--brand-deep)] transition hover:bg-[#f8fbff]"
                >
                  Cancel
                </button>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="button button-primary rounded-xl px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Saving..." : "Add Doctor"}
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
          <DoctorFormField label="Email">
            <input
              type="email"
              required
              value={draftEmail}
              onChange={(event) => setDraftEmail(event.target.value)}
              placeholder="doctor@example.com"
              className={inputClassName}
            />
          </DoctorFormField>

          <DoctorFormField label="Password">
            <input
              type="password"
              required
              value={draftPassword}
              onChange={(event) => setDraftPassword(event.target.value)}
              placeholder="Password"
              className={inputClassName}
            />
          </DoctorFormField>

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
