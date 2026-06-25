"use client";

import { useState } from "react";
import { DoctorCredentialModal } from "@/components/dashboard/DoctorCredentialModal";
import type { Doctor, DoctorCredential } from "@/lib/db";

type DoctorCredentialActionsProps = {
  doctor: Pick<Doctor, "id" | "title">;
  credential?: DoctorCredential | null;
};

export function DoctorCredentialActions({
  doctor,
  credential,
}: DoctorCredentialActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-start gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-xl border border-[#d8e5fb] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--brand-deep)] transition hover:bg-[#f8fbff]"
        >
          Update Email
        </button>
        {credential?.email ? (
          <p className="text-sm font-medium text-[var(--muted)]">
            {credential.email}
          </p>
        ) : null}
      </div>

      <DoctorCredentialModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        doctor={doctor}
        credential={credential}
      />
    </>
  );
}
