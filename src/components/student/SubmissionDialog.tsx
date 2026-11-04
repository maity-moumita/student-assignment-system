
"use client";

import { useState } from "react";

import {
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";

type SubmissionDialogProps = {
  open: boolean;
  assignmentTitle: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function SubmissionDialog({
  open,
  assignmentTitle,
  onClose,
  onConfirm,
}: SubmissionDialogProps) {
  const [finalConfirmation, setFinalConfirmation] =
    useState(false);

  if (!open) return null;

  function handleClose() {
    setFinalConfirmation(false);
    onClose();
  }

  function handleConfirm() {
    onConfirm();
    setFinalConfirmation(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="submission-title"
        className="glass-strong w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200"
      >

        <div className="flex items-center justify-between">

          <div className="w-12 h-12 rounded-xl bg-[var(--teal-light)] flex items-center justify-center">
            {finalConfirmation ? (
              <AlertCircle
                size={24}
                className="text-[var(--pink)]"
              />
            ) : (
              <CheckCircle
                size={24}
                className="text-[var(--teal)]"
              />
            )}
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close confirmation"
            className="text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <X size={21} />
          </button>

        </div>

        <h2
          id="submission-title"
          className="text-xl font-bold mt-5"
        >
          {finalConfirmation
            ? "Final confirmation"
            : "Confirm submission"}
        </h2>

        <p className="text-sm text-[var(--muted)] mt-3 leading-6">
          {finalConfirmation
            ? `Are you absolutely sure that you have submitted "${assignmentTitle}"?`
            : `Have you completed and submitted "${assignmentTitle}"?`}
        </p>

        <div className="flex flex-col gap-3 mt-7">

          {!finalConfirmation ? (
            <>
              <button
                type="button"
                onClick={() => setFinalConfirmation(true)}
                className="teal-button w-full rounded-xl p-3 font-semibold"
              >
                Yes, I have submitted
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="glass w-full rounded-xl p-3 font-medium"
              >
                Not yet
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleConfirm}
                className="teal-button w-full rounded-xl p-3 font-semibold"
              >
                Yes, confirm submission
              </button>

              <button
                type="button"
                onClick={() => setFinalConfirmation(false)}
                className="glass w-full rounded-xl p-3 font-medium"
              >
                Go back
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
}
