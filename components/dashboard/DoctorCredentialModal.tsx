"use client";

import { saveDoctorCredentialAction } from "@/app/dashboard/actions";
import { Modal } from "@/components/ui/Modal";
import type { Doctor, DoctorCredential } from "@/lib/db";

type DoctorCredentialModalProps = {
  isOpen: boolean;
  onClose: () => void;
  doctor: Pick<Doctor, "id" | "title"> | null;
  credential?: DoctorCredential | null;
};

export function DoctorCredentialModal({
  isOpen,
  onClose,
  doctor,
  credential,
}: DoctorCredentialModalProps) {
  if (!doctor) {
    return null;
  }

  const isEditing = !!credential;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Update Doctor Email" : "Create Doctor Email"}
    >
      <form action={saveDoctorCredentialAction} className="grid gap-4">
        <input type="hidden" name="doctorId" value={doctor.id} />
        {credential ? <input type="hidden" name="credentialId" value={credential.id} /> : null}

        <div className="rounded-xl border border-[#dbe7fb] bg-[#f8fbff] px-4 py-3 text-sm text-[var(--brand-deep)]">
          <span className="font-semibold">Doctor:</span> {doctor.title}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            defaultValue={credential?.email}
            placeholder="doctor@example.com"
            className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm outline-none transition focus:border-[var(--brand)]"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password {isEditing ? "(leave blank to keep current)" : ""}
          </label>
          <input
            type="password"
            name="password"
            required={!isEditing}
            placeholder={isEditing ? "Enter new password" : "Password"}
            className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm outline-none transition focus:border-[var(--brand)]"
          />
        </div>

        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f68cb]"
          >
            {isEditing ? "Update Email" : "Create Email"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
