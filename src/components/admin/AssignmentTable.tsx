
"use client";

import {
  CalendarDays,
  Pencil,
  Trash2,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { useState } from "react";

import type { Assignment } from "@/types";

import StudentStatus from "./StudentStatus";

import type { User, Submission } from "@/types";

type AssignmentTableProps = {
  assignments: Assignment[];
  students: User[];
  submissions: Submission[];
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignment: Assignment) => void;
};

export default function AssignmentTable({
  assignments,
  students,
  submissions,
  onEdit,
  onDelete,
}: AssignmentTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    null
  );

  if (assignments.length === 0) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <h3 className="font-semibold text-lg">
          No assignments yet
        </h3>

        <p className="text-sm text-[var(--muted)] mt-2">
          Create your first assignment to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {assignments.map((assignment) => {
        const isExpanded = expandedId === assignment.id;

        const submittedCount = assignment.assignedTo.filter(
          (studentId) =>
            submissions.some(
              (item) =>
                item.assignmentId === assignment.id &&
                item.studentId === studentId &&
                item.status === "submitted"
            )
        ).length;

        return (
          <div
            key={assignment.id}
            className="glass rounded-2xl p-5"
          >

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

              {/* Assignment information */}

              <div className="flex-1 min-w-0">

                <h3 className="text-lg font-bold break-words">
                  {assignment.title}
                </h3>

                <p className="text-sm text-[var(--muted)] mt-2 line-clamp-2">
                  {assignment.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-4">

                  <span className="flex items-center gap-2 text-xs text-[var(--muted)]">
                    <CalendarDays size={15} />
                    {new Date(
                      `${assignment.dueDate}T00:00:00`
                    ).toLocaleDateString("en-IN")}
                  </span>

                  <span className="flex items-center gap-2 text-xs text-[var(--muted)]">
                    <Users size={15} />
                    {assignment.assignedTo.length} Students
                  </span>

                </div>

              </div>

              {/* Submission count */}

              <div className="flex flex-col gap-2 lg:min-w-32">

                <p className="text-sm font-semibold">
                  {submittedCount}/{assignment.assignedTo.length} Submitted
                </p>

                <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">

                  <div
                    className="h-full bg-[var(--teal)] rounded-full"
                    style={{
                      width: `${
                        assignment.assignedTo.length
                          ? (submittedCount /
                              assignment.assignedTo.length) *
                            100
                          : 0
                      }%`,
                    }}
                  />

                </div>

              </div>

              {/* Actions */}

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={() => onEdit(assignment)}
                  aria-label={`Edit ${assignment.title}`}
                  className="glass rounded-xl p-3 text-[var(--teal)] hover:bg-[var(--teal-light)]"
                >
                  <Pencil size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(assignment)}
                  aria-label={`Delete ${assignment.title}`}
                  className="glass rounded-xl p-3 text-[var(--pink)] hover:bg-[var(--pink-light)]"
                >
                  <Trash2 size={17} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setExpandedId(
                      isExpanded ? null : assignment.id
                    )
                  }
                  aria-label={
                    isExpanded
                      ? "Hide student statuses"
                      : "View student statuses"
                  }
                  aria-expanded={isExpanded}
                  className="glass rounded-xl p-3"
                >
                  {isExpanded ? (
                    <ChevronUp size={17} />
                  ) : (
                    <ChevronDown size={17} />
                  )}
                </button>

              </div>

            </div>

            {/* Expanded student statuses */}

            {isExpanded && (
              <div className="mt-5 border-t border-[var(--border)] pt-5">

                <StudentStatus
                  assignment={assignment}
                  students={students}
                  submissions={submissions}
                />

              </div>
            )}

          </div>
        );
      })}

    </div>
  );
}
