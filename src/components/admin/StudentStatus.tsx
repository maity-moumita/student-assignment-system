
"use client";

import {
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";

import type {
  Assignment,
  User,
  Submission,
} from "@/types";

type StudentStatusProps = {
  assignment: Assignment;
  students: User[];
  submissions: Submission[];
};

export default function StudentStatus({
  assignment,
  students,
  submissions,
}: StudentStatusProps) {
  const assignedStudents = students.filter((student) =>
    assignment.assignedTo.includes(student.id)
  );

  const submittedCount = assignedStudents.filter(
    (student) =>
      submissions.some(
        (submission) =>
          submission.assignmentId === assignment.id &&
          submission.studentId === student.id &&
          submission.status === "submitted"
      )
  ).length;

  const total = assignedStudents.length;

  const progress =
    total === 0
      ? 0
      : Math.round((submittedCount / total) * 100);

  return (
    <div className="glass rounded-2xl p-5">

      {/* Heading */}

      <div className="flex items-center justify-between gap-3">

        <div>
          <h3 className="font-semibold">
            {assignment.title}
          </h3>

          <p className="text-xs text-[var(--muted)] mt-1">
            Student submission overview
          </p>
        </div>

        <div className="bg-[var(--teal-light)] rounded-xl p-2">
          <Users
            size={20}
            className="text-[var(--teal)]"
          />
        </div>

      </div>

      {/* Progress */}

      <div className="mt-5">

        <div className="flex justify-between items-center mb-2">

          <span className="text-sm text-[var(--muted)]">
            Class completion
          </span>

          <span className="font-bold text-[var(--teal)]">
            {progress}%
          </span>

        </div>

        <div
          className="w-full h-2.5 bg-[var(--border)] rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${assignment.title} completion`}
        >
          <div
            className="h-full bg-[var(--teal)] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-[var(--muted)] mt-2">
          {submittedCount} of {total} students submitted
        </p>

      </div>

      {/* Student list */}

      <div className="mt-5 space-y-3">

        {assignedStudents.map((student) => {
          const submission = submissions.find(
            (item) =>
              item.assignmentId === assignment.id &&
              item.studentId === student.id
          );

          const submitted =
            submission?.status === "submitted";

          return (
            <div
              key={student.id}
              className="flex items-center justify-between gap-3 border-t border-[var(--border)] pt-3"
            >

              <div className="min-w-0">

                <p className="text-sm font-medium truncate">
                  {student.name}
                </p>

                <p className="text-xs text-[var(--muted)] truncate">
                  {student.email}
                </p>

              </div>

              {submitted ? (
                <span className="shrink-0 flex items-center gap-1 text-xs font-semibold text-[var(--teal)]">
                  <CheckCircle size={15} />
                  Submitted
                </span>
              ) : (
                <span className="shrink-0 flex items-center gap-1 text-xs font-semibold text-[var(--pink)]">
                  <Clock size={15} />
                  Not Submitted
                </span>
              )}

            </div>
          );
        })}

        {total === 0 && (
          <p className="text-sm text-[var(--muted)]">
            No students assigned.
          </p>
        )}

      </div>

    </div>
  );
}
