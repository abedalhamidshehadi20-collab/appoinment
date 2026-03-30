"use client";

import { useState, type ReactNode } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

type DeleteActionButtonProps = {
  action: (formData: FormData) => void | Promise<void>;
  values: Record<string, string>;
  dialogTitle: string;
  dialogMessage: string;
  buttonTitle: string;
  buttonClassName: string;
  confirmText?: string;
  children: ReactNode;
};

export function DeleteActionButton({
  action,
  values,
  dialogTitle,
  dialogMessage,
  buttonTitle,
  buttonClassName,
  confirmText = "Delete",
  children,
}: DeleteActionButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
      formData.append(key, value);
    }

    setIsDeleting(true);

    try {
      await action(formData);
      setIsDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsDialogOpen(true)}
        className={buttonClassName}
        title={buttonTitle}
        aria-label={buttonTitle}
      >
        {children}
      </button>

      <ConfirmDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirm}
        title={dialogTitle}
        message={dialogMessage}
        confirmText={confirmText}
        isLoading={isDeleting}
      />
    </>
  );
}
