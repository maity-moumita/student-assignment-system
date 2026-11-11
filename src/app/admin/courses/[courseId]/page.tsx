
"use client";

import { Suspense, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  ExternalLink,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";

import DashboardLayout from "@/components/common/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useAssignments } from "@/context/AssignmentContext";
import { initialCourses, initialUsers } from "@/data/Data";

interface ProfessorCoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

// Main course content
function ProfessorCourseContent({
  params,
}: ProfessorCoursePageProps) {
  const { courseId } = use(params);

  const { currentUser } = useAuth();
  const { assignments, submissions } = useAssignments();

  // Find the professor's course
  const course = initialCourses.find(
    (item) =>
      item.id === courseId &&
      item.professorId === currentUser?.id
  );

  // Find assignments belonging to this course
  const courseAssignments = assignments.filter(
    (assignment) =>
      assignment.courseId === courseId &&
      assignment.createdBy === currentUser?.id
  );

  if (!currentUser) {
    return (
      <DashboardLayout role="admin" title="Course">
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-[#93A5A1]">
            Loading course...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout role="admin" title="Course Not Found">
        <div className="flex min-h-[50vh] flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-white">
            Course not found
          </h2>

          <Link
            href="/admin"
            className="mt-4 inline-flex items-center gap-2 text-[#D7F35C]"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Course statistics
  const totalAssignments = courseAssignments.length;

  const totalSubmitted = courseAssignments.reduce(
    (total, assignment) =>
      total +
      submissions.filter(
        (submission) =>
          submission.assignmentId === assignment.id &&
          submission.status === "submitted"
      ).length,
    0
  );

  const totalExpected = courseAssignments.reduce(
    (total, assignment) =>
      total + assignment.assignedTo.length,
    0
  );

  const overallProgress =
    totalExpected > 0
      ? Math.round((totalSubmitted / totalExpected) * 100)
      : 0;

  return (
    <DashboardLayout role="admin" title={course.code}>
      <div className="space-y-8">

        {/* Back navigation */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-[#93A5A1] transition hover:text-[#D7F35C]"
        >
          <ArrowLeft size={16} />
          Back to courses
        </Link>

        {/* Course heading */}
        <section className="rounded-3xl border border-white/10 bg-[#14231D] p-6 md:p-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div>
              <span className="rounded-full bg-[#D7F35C]/10 px-3 py-1 text-xs font-semibold text-[#D7F35C]">
                {course.code}
              </span>

              <h1 className="mt-4 text-2xl font-bold text-white md:text-3xl">
                {course.name}
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-[#93A5A1]">
                Manage assignments, monitor student progress, and
                review submissions for this course.
              </p>
            </div>

            <Link
              href="/admin/assignments/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D7F35C] px-5 py-3 text-sm font-bold text-[#14231D] transition hover:bg-[#c9e54d]"
            >
              Create assignment
            </Link>
          </div>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total assignments",
              value: totalAssignments,
              icon: FileText,
            },
            {
              label: "Expected submissions",
              value: totalExpected,
              icon: Users,
            },
            {
              label: "Submitted",
              value: totalSubmitted,
              icon: CheckCircle2,
            },
            {
              label: "Overall progress",
              value: `${overallProgress}%`,
              icon: TrendingUp,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-[#1B2D25] p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#93A5A1]">
                    {item.label}
                  </p>

                  <Icon
                    size={19}
                    className="text-[#D7F35C]"
                  />
                </div>

                <p className="mt-4 text-3xl font-bold text-white">
                  {item.value}
                </p>
              </div>
            );
          })}
        </section>

        {/* Assignments */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-white">
              Course assignments
            </h2>

            <p className="mt-1 text-sm text-[#93A5A1]">
              Track assignment deadlines and student submissions.
            </p>
          </div>

          {courseAssignments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-[#1B2D25] px-6 py-14 text-center">
              <FileText
                size={32}
                className="mx-auto text-[#93A5A1]"
              />

              <h3 className="mt-4 font-semibold text-white">
                No assignments yet
              </h3>

              <p className="mt-2 text-sm text-[#93A5A1]">
                Create your first assignment for this course.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {courseAssignments.map((assignment) => {
                const assignmentSubmissions = submissions.filter(
                  (submission) =>
                    submission.assignmentId === assignment.id &&
                    submission.status === "submitted"
                );

                const submittedCount =
                  assignmentSubmissions.length;

                const totalStudents =
                  assignment.assignedTo.length;

                const progress =
                  totalStudents > 0
                    ? Math.round(
                        (submittedCount / totalStudents) * 100
                      )
                    : 0;

                const pendingStudents = assignment.assignedTo.filter(
                  (studentId) =>
                    !assignmentSubmissions.some(
                      (submission) =>
                        submission.studentId === studentId
                    )
                );

                const deadline = new Date(assignment.dueDate);

                const validDeadline = !Number.isNaN(
                  deadline.getTime()
                );

                const isOverdue =
                  validDeadline &&
                  deadline.getTime() < Date.now();

                return (
                  <article
                    key={assignment.id}
                    className="rounded-2xl border border-white/10 bg-[#1B2D25] p-5 md:p-6"
                  >
                    <div className="flex flex-col justify-between gap-4 md:flex-row">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {assignment.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-[#93A5A1]">
                          {assignment.description}
                        </p>
                      </div>

                      <span
                        className={`h-fit w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                          isOverdue
                            ? "bg-red-400/10 text-red-300"
                            : "bg-[#D7F35C]/10 text-[#D7F35C]"
                        }`}
                      >
                        {isOverdue ? "Overdue" : "Active"}
                      </span>
                    </div>

                    {/* Assignment information */}
                    <div className="mt-5 flex flex-wrap gap-4 text-sm text-[#93A5A1]">
                      <span className="inline-flex items-center gap-2">
                        <CalendarClock size={16} />
                        {validDeadline
                          ? deadline.toLocaleString()
                          : "Invalid deadline"}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <Users size={16} />
                        {assignment.submissionType}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <CheckCircle2 size={16} />
                        {submittedCount}/{totalStudents} submitted
                      </span>
                    </div>

                    {/* OneDrive link */}
                    {assignment.driveLink && (
                      <a
                        href={assignment.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm text-[#D7F35C] hover:underline"
                      >
                        Open assignment on OneDrive
                        <ExternalLink size={14} />
                      </a>
                    )}

                    {/* Progress */}
                    <div className="mt-6">
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="text-[#93A5A1]">
                          Submission progress
                        </span>

                        <span className="font-semibold text-[#D7F35C]">
                          {progress}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-[#D7F35C] transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Submitted and pending students */}
                    <div className="mt-6 grid gap-5 border-t border-white/10 pt-5 md:grid-cols-2">

                      {/* Submitted */}
                      <div>
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-300">
                          <CheckCircle2 size={16} />
                          Submitted ({submittedCount})
                        </h4>

                        {assignmentSubmissions.length === 0 ? (
                          <p className="text-sm text-[#93A5A1]">
                            No submissions yet.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {assignmentSubmissions.map((submission) => {
                              const student = initialUsers.find(
                                (user) =>
                                  user.id === submission.studentId
                              );

                              return (
                                <div
                                  key={submission.id}
                                  className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white"
                                >
                                  {student?.name || "Student"}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Pending */}
                      <div>
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-300">
                          <Clock size={16} />
                          Pending ({pendingStudents.length})
                        </h4>

                        {pendingStudents.length === 0 ? (
                          <p className="text-sm text-[#93A5A1]">
                            Everyone has submitted.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {pendingStudents.map((studentId) => {
                              const student = initialUsers.find(
                                (user) => user.id === studentId
                              );

                              return (
                                <div
                                  key={studentId}
                                  className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white"
                                >
                                  {student?.name || "Student"}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

// Page wrapper: Suspense handles dynamic route params
export default function ProfessorCoursePage({
  params,
}: ProfessorCoursePageProps) {
  return (
    <Suspense
      fallback={
        <DashboardLayout role="admin" title="Loading course">
          <div className="flex min-h-[50vh] items-center justify-center">
            <p className="text-[#93A5A1]">
              Loading course details...
            </p>
          </div>
        </DashboardLayout>
      }
    >
      <ProfessorCourseContent params={params} />
    </Suspense>
  );
}
