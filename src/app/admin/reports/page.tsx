
"use client";

import { useMemo } from "react";

import {
  ChartNoAxesCombined,
  BookOpen,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  CalendarDays,
} from "lucide-react";

import DashboardLayout from "@/components/common/DashboardLayout";

import { useAuth } from "@/context/AuthContext";
import { useAssignments } from "@/context/AssignmentContext";

import { initialUsers } from "@/data/Data";

export default function AdminReportsPage() {
  const { currentUser } = useAuth();

  const { assignments, submissions, loading } =
    useAssignments();

  // Only assignments created by this admin

  const myAssignments = useMemo(
    () =>
      assignments.filter(
        (assignment) =>
          assignment.createdBy === currentUser?.id
      ),
    [assignments, currentUser]
  );

  const students = initialUsers.filter(
    (user) => user.role === "student"
  );

  // Calculate assignment-wise reports

  const assignmentReports = useMemo(() => {
    return myAssignments.map((assignment) => {
      const assignedStudents = students.filter(
        (student) =>
          assignment.assignedTo.includes(student.id)
      );

      const submitted = assignedStudents.filter(
        (student) =>
          submissions.some(
            (item) =>
              item.assignmentId === assignment.id &&
              item.studentId === student.id &&
              item.status === "submitted"
          )
      ).length;

      const total = assignedStudents.length;

      const pending = total - submitted;

      const progress =
        total === 0
          ? 0
          : Math.round((submitted / total) * 100);

      return {
        ...assignment,
        total,
        submitted,
        pending,
        progress,
      };
    });
  }, [myAssignments, students, submissions]);

  // Overall statistics

  const totalAssignments = myAssignments.length;

  const totalOpportunities = assignmentReports.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const totalSubmitted = assignmentReports.reduce(
    (sum, item) => sum + item.submitted,
    0
  );

  const totalPending =
    totalOpportunities - totalSubmitted;

  const completion =
    totalOpportunities === 0
      ? 0
      : Math.round(
          (totalSubmitted / totalOpportunities) * 100
        );

  const assignedStudentIds = [
    ...new Set(
      myAssignments.flatMap(
        (assignment) => assignment.assignedTo
      )
    ),
  ];

  // Student-wise reports

  const studentReports = useMemo(() => {
    return students
      .map((student) => {
        const assigned = myAssignments.filter(
          (assignment) =>
            assignment.assignedTo.includes(student.id)
        );

        const submitted = assigned.filter(
          (assignment) =>
            submissions.some(
              (item) =>
                item.assignmentId === assignment.id &&
                item.studentId === student.id &&
                item.status === "submitted"
            )
        ).length;

        const total = assigned.length;

        return {
          ...student,
          total,
          submitted,
          pending: total - submitted,
          progress:
            total === 0
              ? 0
              : Math.round((submitted / total) * 100),
        };
      })
      .filter((student) => student.total > 0)
      .sort((a, b) => b.progress - a.progress);
  }, [students, myAssignments, submissions]);

  return (
    <DashboardLayout
      role="admin"
      title="Submission Reports"
    >

      {/* Heading */}

      <section className="mb-8">

        <p className="text-sm font-semibold text-[var(--pink)]">
          ANALYTICS & REPORTS
        </p>

        <h2 className="text-2xl md:text-3xl font-bold mt-2">
          Submission Overview
        </h2>

        <p className="text-sm text-[var(--muted)] mt-2">
          Monitor assignment completion and student performance.
        </p>

      </section>

      {loading ? (
        <div className="glass rounded-2xl p-10 text-center">
          <div className="w-8 h-8 border-4 border-[var(--teal)] border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="text-sm text-[var(--muted)] mt-4">
            Loading reports...
          </p>
        </div>
      ) : (
        <>

          {/* Statistics */}

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            <ReportCard
              title="Total Assignments"
              value={totalAssignments}
              icon={BookOpen}
              color="teal"
            />

            <ReportCard
              title="Assigned Students"
              value={assignedStudentIds.length}
              icon={Users}
              color="pink"
            />

            <ReportCard
              title="Submitted"
              value={totalSubmitted}
              icon={CheckCircle}
              color="teal"
            />

            <ReportCard
              title="Pending"
              value={totalPending}
              icon={Clock}
              color="pink"
            />

          </section>

          {/* Overall analytics */}

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-7">

            {/* Completion rate */}

            <div className="glass rounded-2xl p-6 lg:col-span-2">

              <div className="flex justify-between items-center gap-3">

                <div>
                  <h3 className="font-semibold text-lg">
                    Overall Completion Rate
                  </h3>

                  <p className="text-sm text-[var(--muted)] mt-1">
                    Submission performance across all your assignments
                  </p>
                </div>

                <TrendingUp
                  size={23}
                  className="text-[var(--teal)]"
                />

              </div>

              <div className="flex items-center gap-5 mt-7">

                <div className="relative w-32 h-32 shrink-0">

                  <svg
                    viewBox="0 0 120 120"
                    className="w-full h-full -rotate-90"
                    role="img"
                    aria-label={`Completion rate ${completion}%`}
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      stroke="var(--border)"
                      strokeWidth="12"
                    />

                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      stroke="var(--teal)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${completion * 3.016} 301.6`}
                    />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">
                      {completion}%
                    </span>
                  </div>

                </div>

                <div className="space-y-4 flex-1">

                  <div className="flex items-center gap-3">

                    <span className="w-3 h-3 rounded-full bg-[var(--teal)]" />

                    <div>
                      <p className="text-sm font-semibold">
                        {totalSubmitted} Submitted
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        Completed assignments
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <span className="w-3 h-3 rounded-full bg-[var(--pink)]" />

                    <div>
                      <p className="text-sm font-semibold">
                        {totalPending} Pending
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        Awaiting submission
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* Summary */}

            <div className="glass rounded-2xl p-6">

              <div className="w-11 h-11 rounded-xl bg-[var(--pink-light)] flex items-center justify-center">
                <ChartNoAxesCombined
                  size={23}
                  className="text-[var(--pink)]"
                />
              </div>

              <h3 className="font-semibold mt-5">
                Report Summary
              </h3>

              <div className="mt-5 space-y-4">

                <SummaryRow
                  label="Assignments created"
                  value={totalAssignments}
                />

                <SummaryRow
                  label="Submission opportunities"
                  value={totalOpportunities}
                />

                <SummaryRow
                  label="Students assigned"
                  value={assignedStudentIds.length}
                />

                <SummaryRow
                  label="Completion rate"
                  value={`${completion}%`}
                />

              </div>

            </div>

          </section>

          {/* Assignment reports */}

          <section className="mt-10">

            <div className="mb-5">
              <h3 className="text-xl font-bold">
                Assignment Performance
              </h3>

              <p className="text-sm text-[var(--muted)] mt-1">
                Completion rates for each assignment you created.
              </p>
            </div>

            {assignmentReports.length === 0 ? (
              <EmptyReport />
            ) : (

              <div className="space-y-4">

                {assignmentReports.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="glass rounded-2xl p-5"
                  >

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3">

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

                      <span className="text-xl font-bold text-[var(--teal)]">
                        {assignment.progress}%
                      </span>

                    </div>

                    <div className="h-2.5 bg-[var(--border)] rounded-full overflow-hidden mt-5">

                      <div
                        className="h-full bg-[var(--teal)] rounded-full transition-all duration-500"
                        style={{
                          width: `${assignment.progress}%`,
                        }}
                      />

                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 text-xs">

                      <span className="text-[var(--teal)] font-semibold">
                        {assignment.submitted} Submitted
                      </span>

                      <span className="text-[var(--pink)] font-semibold">
                        {assignment.pending} Pending
                      </span>

                      <span className="text-[var(--muted)]">
                        {assignment.total} Students
                      </span>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </section>

          {/* Student performance */}

          <section className="mt-10">

            <div className="mb-5">
              <h3 className="text-xl font-bold">
                Student Performance
              </h3>

              <p className="text-sm text-[var(--muted)] mt-1">
                Individual submission performance across your assignments.
              </p>
            </div>

            {studentReports.length === 0 ? (
              <EmptyReport />
            ) : (

              <div className="glass rounded-2xl overflow-hidden">

                <div className="overflow-x-auto">

                  <table className="w-full text-sm text-left">

                    <thead className="bg-[var(--teal-light)]">

                      <tr>
                        <th className="p-4">Student</th>
                        <th className="p-4">Assigned</th>
                        <th className="p-4">Submitted</th>
                        <th className="p-4">Pending</th>
                        <th className="p-4">Progress</th>
                      </tr>

                    </thead>

                    <tbody>

                      {studentReports.map((student) => (
                        <tr
                          key={student.id}
                          className="border-t border-[var(--border)]"
                        >

                          <td className="p-4 min-w-40">

                            <p className="font-semibold">
                              {student.name}
                            </p>

                            <p className="text-xs text-[var(--muted)] mt-1">
                              {student.email}
                            </p>

                          </td>

                          <td className="p-4">
                            {student.total}
                          </td>

                          <td className="p-4 text-[var(--teal)] font-semibold">
                            {student.submitted}
                          </td>

                          <td className="p-4 text-[var(--pink)] font-semibold">
                            {student.pending}
                          </td>

                          <td className="p-4 min-w-36">

                            <div className="font-semibold mb-2">
                              {student.progress}%
                            </div>

                            <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[var(--teal)] rounded-full"
                                style={{
                                  width: `${student.progress}%`,
                                }}
                              />
                            </div>

                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>

              </div>
            )}

          </section>

        </>
      )}

    </DashboardLayout>
  );
}

// Statistics card

function ReportCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
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
              ? "bg-[var(--pink-light)]"
              : "bg-[var(--teal-light)]"
          }`}
        >
          <Icon
            size={21}
            className={
              pink
                ? "text-[var(--pink)]"
                : "text-[var(--teal)]"
            }
          />
        </div>

      </div>

      <h3 className="text-3xl font-bold mt-5">
        {value}
      </h3>

    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex justify-between gap-3 text-sm">
      <span className="text-[var(--muted)]">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>
    </div>
  );
}

function EmptyReport() {
  return (
    <div className="glass rounded-2xl p-10 text-center">

      <ChartNoAxesCombined
        size={32}
        className="mx-auto text-[var(--teal)]"
      />

      <h3 className="font-semibold mt-4">
        No report data available
      </h3>

      <p className="text-sm text-[var(--muted)] mt-2">
        Create assignments and assign them to students to see analytics.
      </p>

    </div>
  );
}
