"use client";

import { useState, type FormEvent } from "react";
import { saveProjectAction } from "@/app/dashboard/actions";
import { Modal } from "@/components/ui/Modal";

type DraftCredential = {
  email: string;
  password: string;
};

const defaultAvailableTimes =
  "8:00 am\n8:30 am\n9:00 am\n9:30 am\n10:00 am\n10:30 am\n11:00 am\n11:30 am";

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
      <form action={saveProjectAction} className="grid gap-3">
        {credential ? (
          <>
            <input type="hidden" name="doctorCredentialEmail" value={credential.email} />
            <input type="hidden" name="doctorCredentialPassword" value={credential.password} />
          </>
        ) : null}

        <input
          name="title"
          required
          placeholder="Title"
          className="rounded-lg border border-[var(--line)] px-3 py-2"
        />
        <input
          name="slug"
          placeholder="Slug (optional)"
          className="rounded-lg border border-[var(--line)] px-3 py-2"
        />
        <input
          name="excerpt"
          required
          placeholder="Doctor summary"
          className="rounded-lg border border-[var(--line)] px-3 py-2"
        />
        <textarea
          name="description"
          required
          rows={3}
          placeholder="Doctor bio"
          className="rounded-lg border border-[var(--line)] px-3 py-2"
        />

        <div className="grid gap-3 md:grid-cols-3">
          <input
            name="sector"
            placeholder="Specialty"
            className="rounded-lg border border-[var(--line)] px-3 py-2"
          />
          <input
            name="location"
            placeholder="Clinic location"
            className="rounded-lg border border-[var(--line)] px-3 py-2"
          />
          <select
            name="status"
            defaultValue="Available"
            className="rounded-lg border border-[var(--line)] bg-white px-3 py-2"
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            name="appointmentFee"
            type="number"
            step="0.01"
            defaultValue={50}
            placeholder="Appointment Fee ($)"
            className="rounded-lg border border-[var(--line)] px-3 py-2"
          />
          <input
            name="yearsExperience"
            type="number"
            defaultValue={0}
            placeholder="Years of Experience"
            className="rounded-lg border border-[var(--line)] px-3 py-2"
          />
        </div>

        <input
          name="coverImage"
          placeholder="Cover image URL"
          className="rounded-lg border border-[var(--line)] px-3 py-2"
        />
        <textarea
          name="gallery"
          rows={3}
          placeholder="Gallery URLs (one per line)"
          className="rounded-lg border border-[var(--line)] px-3 py-2"
        />
        <textarea
          name="details"
          rows={3}
          placeholder="Doctor highlights (one per line)"
          className="rounded-lg border border-[var(--line)] px-3 py-2"
        />
        <textarea
          name="availableTimes"
          defaultValue={defaultAvailableTimes}
          rows={4}
          placeholder="Available time slots (one per line)"
          className="rounded-lg border border-[var(--line)] px-3 py-2"
        />

        <div className="flex flex-col items-start gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleOpenCredentialModal}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
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
                className="rounded-lg border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Remove Email
              </button>
            ) : null}
          </div>

          {credential ? (
            <p className="text-sm font-medium text-[var(--brand-deep)]">
              Email ready: {credential.email}
            </p>
          ) : (
            <p className="text-xs font-medium text-[var(--muted)]">
              You can create the doctor login now, then save the profile with Add Doctor.
            </p>
          )}

          <button className="button button-primary w-fit">Add Doctor</button>
        </div>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={credential ? "Update Doctor Email" : "Create Doctor Email"}
      >
        <form onSubmit={handleSaveCredential} className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={draftEmail}
              onChange={(event) => setDraftEmail(event.target.value)}
              placeholder="doctor@example.com"
              className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm outline-none transition focus:border-[var(--brand)]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              value={draftPassword}
              onChange={(event) => setDraftPassword(event.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm outline-none transition focus:border-[var(--brand)]"
            />
          </div>

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 rounded-lg border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f68cb]"
            >
              Save Email
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
