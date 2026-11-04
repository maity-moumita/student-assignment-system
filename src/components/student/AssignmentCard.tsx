
"use client";

import {
  CalendarDays,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

import type { Assignment } from "@/types";

type AssignmentCardProps = {
  assignment: Assignment;
  status: "submitted" | "not_submitted";
  submittedAt: string | null;
  onSubmit: () => void;
};

export default function AssignmentCard({
  assignment,
  status,
  submittedAt,
  onSubmit,
}: AssignmentCardProps) {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(
    `${assignment.dueDate}T00:00:00`
  );

  const isOverdue =
    status !== "submitted" && dueDate < today;

  const formattedDate = dueDate.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  return (
    <article className="glass glass-hover rounded-2xl p-5 flex flex-col">

      {/* Header */}

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          <h3 className="font-bold text-lg break-words">
            {assignment.title}
          </h3>

          <p className="text-sm text-[var(--muted)] mt-2 leading-6">
            {assignment.description}
          </p>

        </div>

        <div
          className={`shrink-0 p-2 rounded-xl ${
            status === "submitted"
              ? "bg-[var(--teal-light)]"
              : "bg-[var(--pink-light)]"
          }`}
        >
          {status === "submitted" ? (
            <CheckCircle
              size={21}
              className="text-[var(--teal)]"
            />
          ) : (
            <Clock
              size={21}
              className="text-[var(--pink)]"
            />
          )}
        </div>

      </div>

      {/* Status */}

      <div className="flex flex-wrap items-center gap-2 mt-5">

        {status === "submitted" ? (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--teal-light)] text-[var(--teal)]">
            Submitted
          </span>
        ) : isOverdue ? (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--pink-light)] text-[var(--pink)]">
            <AlertCircle size={12} className="inline mr-1" />
            Overdue
          </span>
        ) : (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--pink-light)] text-[var(--pink)]">
            Not Submitted
          </span>
        )}

      </div>

      {/* Due date */}

      <div className="flex items-center gap-2 mt-5 text-sm text-[var(--muted)]">

        <CalendarDays size={17} />

        <span>Due: {formattedDate}</span>

      </div>

      {submittedAt && (
        <p className="text-xs text-[var(--muted)] mt-2">
          Submitted on:{" "}
          {new Date(submittedAt).toLocaleDateString("en-IN")}
        </p>
      )}

      {/* Bottom actions */}

      <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-[var(--border)]">

        <a
          href={assignment.driveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="glass flex-1 min-w-0 rounded-xl p-3 text-sm font-medium flex items-center justify-center gap-2 hover:text-[var(--teal)] transition"
        >
          <ExternalLink size={16} />
          Drive Link
        </a>

        {status !== "submitted" && (
          <button
            type="button"
            onClick={onSubmit}
            className="teal-button flex-1 min-w-0 rounded-xl p-3 text-sm font-semibold"
          >
            Submit Assignment
          </button>
        )}

      </div>

    </article>
  );
}
