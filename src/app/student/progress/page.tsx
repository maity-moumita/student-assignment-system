
"use client";

import { useMemo } from "react";

import {
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  CalendarDays,
  Target,
} from "lucide-react";

import DashboardLayout from "@/components/common/DashboardLayout";

import { useAuth } from "@/context/AuthContext";
import { useAssignments } from "@/context/AssignmentContext";

export default function StudentProgressPage() {
  const { currentUser } = useAuth();

  const {
    assignments,
    submissions,
    loading,
  } = useAssignments();

  // Get student's assignments

  const myAssignments = useMemo(() => {
    if (!currentUser) return [];

    return assignments.filter((assignment) =>
      assignment.assignedTo.includes(currentUser.id)
    );
  }, [assignments, currentUser]);

  // Calculate progress information

  const report = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let submitted = 0;
    let pending = 0;
    let overdue = 0;

    const details = myAssignments.map((assignment) => {
      const submission = submissions.find(
        (item) =>
          item.assignmentId === assignment.id &&
          item.studentId === currentUser?.id
      );

      const isSubmitted =
        submission?.status === "submitted";

      const dueDate = new Date(
        `${assignment.dueDate}T00:00:00`
      );

      if (isSubmitted) {
        submitted++;
      } else {
        pending++;

        if (dueDate < today) {
          overdue++;
        }
      }

      return {
        ...assignment,
        isSubmitted,
        submittedAt: submission?.submittedAt ?? null,
        isOverdue: !isSubmitted && dueDate < today,
      };
    });

    const total = details.length;

    const completion =
      total === 0
        ? 0
        : Math.round((submitted / total) * 100);

    return {
      total,
      submitted,
      pending,
      overdue,
      completion,
      details,
    };
  }, [myAssignments, submissions, currentUser]);

  // Recent submissions

  const recentSubmissions = report.details
    .filter((item) => item.isSubmitted && item.submittedAt)
    .sort(
      (a, b) =>
        new Date(b.submittedAt!).getTime() -
        new Date(a.submittedAt!).getTime()
    );

  if (loading) {
    return (
      <DashboardLayout
        role="student"
        title="My Progress"
      >
        <div className="glass rounded-2xl p-10 text-center">
          <div className="w-8 h-8 border-4 border-[var(--teal)] border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="text-sm text-[var(--muted)] mt-4">
            Loading your progress...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      role="student"
      title="My Progress"
    >

      {/* Heading */}

      <section className="mb-8">

        <p className="text-sm font-semibold text-[var(--pink)]">
          PERFORMANCE OVERVIEW
        </p>

        <h2 className="text-2xl md:text-3xl font-bold mt-2">
          My Learning Progress
        </h2>

        <p className="text-sm text-[var(--muted)] mt-2">
          Track your assignment completion and submission history.
        </p>

      </section>

      {/* Statistics */}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <ProgressCard
          title="Total Assignments"
          value={report.total}
          icon={<BookOpen size={21} />}
          color="teal"
        />

        <ProgressCard
          title="Submitted"
          value={report.submitted}
          icon={<CheckCircle size={21} />}
          color="pink"
        />

        <ProgressCard
          title="Pending"
          value={report.pending}
          icon={<Clock size={21} />}
          color="teal"
        />

        <ProgressCard
          title="Overdue"
          value={report.overdue}
          icon={<AlertCircle size={21} />}
          color="pink"
        />

      </section>

      {/* Overall completion */}

      <section className="glass rounded-2xl p-6 mt-7">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-[var(--teal-light)] flex items-center justify-center">
            <Target
              size={23}
              className="text-[var(--teal)]"
            />
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              Overall Completion
            </h3>

            <p className="text-xs text-[var(--muted)]">
              Your total submission performance
            </p>
          </div>

        </div>

        <div className="flex justify-between items-center mt-7 mb-3">

          <span className="text-sm text-[var(--muted)]">
            Assignment progress
          </span>

          <span className="text-2xl font-bold text-[var(--teal)]">
            {report.completion}%
          </span>

        </div>

        <div className="h-4 bg-[var(--border)] rounded-full overflow-hidden">

          <div
            className="h-full bg-[var(--teal)] rounded-full transition-all duration-700"
            style={{
              width: `${report.completion}%`,
            }}
          />

        </div>

        <div className="flex flex-wrap justify-between gap-2 mt-4">

          <p className="text-xs text-[var(--muted)]">
            {report.submitted} of {report.total} completed
          </p>

          <p className="text-xs text-[var(--muted)]">
            {report.pending} remaining
          </p>

        </div>

      </section>

      {/* Assignment breakdown */}

      <section className="mt-10">

        <div className="mb-5">
          <h3 className="text-xl font-bold">
            Assignment Breakdown
          </h3>

          <p className="text-sm text-[var(--muted)] mt-1">
            Progress of each assigned task.
          </p>
        </div>

        {report.details.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <BookOpen
              size={34}
              className="mx-auto text-[var(--teal)]"
            />

            <h3 className="font-semibold mt-4">
              No assignment data available
            </h3>

            <p className="text-sm text-[var(--muted)] mt-2">
              Your progress will appear here when assignments are assigned.
            </p>
          </div>
        ) : (

          <div className="space-y-4">

            {report.details.map((assignment) => (
              <div
                key={assignment.id}
                className="glass rounded-2xl p-5"
              >

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                  <div>
                    <h4 className="font-semibold">
                      {assignment.title}
                    </h4>

                    <p className="text-xs text-[var(--muted)] mt-2 flex items-center gap-2">
                      <CalendarDays size={14} />

                      Due:{" "}
                      {new Date(
                        `${assignment.dueDate}T00:00:00`
                      ).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  {assignment.isSubmitted ? (
                    <span className="text-xs font-semibold px-3 py-2 rounded-full bg-[var(--teal-light)] text-[var(--teal)]">
                      Submitted
                    </span>
                  ) : assignment.isOverdue ? (
                    <span className="text-xs font-semibold px-3 py-2 rounded-full bg-[var(--pink-light)] text-[var(--pink)]">
                      Overdue
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-3 py-2 rounded-full bg-[var(--pink-light)] text-[var(--pink)]">
                      Pending
                    </span>
                  )}

                </div>

                {assignment.isSubmitted && (
                  <p className="text-xs text-[var(--muted)] mt-3">
                    Submitted on:{" "}
                    {new Date(
                      assignment.submittedAt!
                    ).toLocaleDateString("en-IN")}
                  </p>
                )}

              </div>
            ))}

          </div>
        )}

      </section>

      {/* Submission history */}

      <section className="mt-10">

        <div className="mb-5">
          <h3 className="text-xl font-bold">
            Submission History
          </h3>

          <p className="text-sm text-[var(--muted)] mt-1">
            Your recently completed assignments.
          </p>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center">
            <Clock
              size={30}
              className="mx-auto text-[var(--pink)]"
            />

            <p className="text-sm text-[var(--muted)] mt-3">
              You haven't submitted any assignments yet.
            </p>
          </div>
        ) : (

          <div className="glass rounded-2xl p-5 space-y-4">

            {recentSubmissions.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between gap-3 border-b border-[var(--border)] last:border-0 pb-4 last:pb-0"
              >

                <div className="flex items-center gap-3 min-w-0">

                  <div className="w-10 h-10 shrink-0 rounded-xl bg-[var(--teal-light)] flex items-center justify-center">
                    <CheckCircle
                      size={19}
                      className="text-[var(--teal)]"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {assignment.title}
                    </p>

                    <p className="text-xs text-[var(--muted)] mt-1">
                      {new Date(
                        assignment.submittedAt!
                      ).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                </div>

                <span className="text-xs text-[var(--teal)] font-semibold shrink-0">
                  Completed
                </span>

              </div>
            ))}

          </div>
        )}

      </section>

    </DashboardLayout>
  );
}

// Reusable progress card

function ProgressCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "teal" | "pink";
}) {
  const pink = color === "pink";

  return (
    <div className="glass glass-hover rounded-2xl p-5">

      <div className="flex justify-between items-center gap-2">

        <p className="text-sm text-[var(--muted)]">
          {title}
        </p>

        <div
          className={`p-3 rounded-xl ${
            pink
              ? "bg-[var(--pink-light)] text-[var(--pink)]"
              : "bg-[var(--teal-light)] text-[var(--teal)]"
          }`}
        >
          {icon}
        </div>

      </div>

      <h3 className="text-3xl font-bold mt-5">
        {value}
      </h3>

    </div>
  );
}
