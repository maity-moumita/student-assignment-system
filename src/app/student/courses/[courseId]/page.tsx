
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
  UserPlus,
} from "lucide-react";

import DashboardLayout from "@/components/common/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useAssignments } from "@/context/AssignmentContext";
import { useGroups } from "@/context/GroupContext";
import { initialCourses } from "@/data/Data";

interface StudentCoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

// Main student course content
function StudentCourseContent({
  params,
}: StudentCoursePageProps) {
  const { courseId } = use(params);

  const { currentUser } = useAuth();
  const { assignments, submissions } = useAssignments();
  const { getMyGroup } = useGroups();

  const course = initialCourses.find(
    (item) => item.id === courseId
  );

  const courseAssignments = assignments.filter(
    (assignment) =>
      assignment.courseId === courseId &&
      assignment.assignedTo.includes(currentUser?.id ?? "")
  );

  const group =
    course && currentUser
      ? getMyGroup(course.id, currentUser.id)
      : undefined;

  if (!currentUser) {
    return (
      <DashboardLayout role="student" title="Course">
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
      <DashboardLayout role="student" title="Course Not Found">
        <div className="flex min-h-[50vh] flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-white">
            Course not found
          </h2>

          <Link
            href="/student"
            className="mt-4 inline-flex items-center gap-2 text-[#D7F35C]"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student" title={course.code}>
      <div className="space-y-8">

        {/* Back navigation */}
        <Link
          href="/student"
          className="inline-flex items-center gap-2 text-sm text-[#93A5A1] transition hover:text-[#D7F35C]"
        >
          <ArrowLeft size={16} />
          Back to courses
        </Link>

        {/* Course heading */}
        <section className="rounded-3xl border border-white/10 bg-[#14231D] p-6 md:p-8">
          <span className="rounded-full bg-[#D7F35C]/10 px-3 py-1 text-xs font-semibold text-[#D7F35C]">
            {course.code}
          </span>

          <h1 className="mt-4 text-2xl font-bold text-white md:text-3xl">
            {course.name}
          </h1>

          <p className="mt-2 text-sm text-[#93A5A1]">
            View your assignments, deadlines, and submission status.
          </p>
        </section>

        {/* Group information */}
        <section className="rounded-2xl border border-white/10 bg-[#1B2D25] p-5 md:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="flex items-center gap-2 font-semibold text-white">
                <Users size={19} className="text-[#D7F35C]" />
                Your course group
              </h2>

              {group ? (
                <div className="mt-3">
                  <p className="font-medium text-[#D7F35C]">
                    {group.name}
                  </p>

                  <p className="mt-1 text-sm text-[#93A5A1]">
                    You are part of a group for this course.
                  </p>
                </div>
              ) : (
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#93A5A1]">
                  You are not part of any group. Create or join one to
                  submit this assignment.
                </p>
              )}
            </div>

            <Link
              href="/student/groups"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D7F35C]/30 px-4 py-3 text-sm font-semibold text-[#D7F35C] transition hover:bg-[#D7F35C]/10"
            >
              <UserPlus size={16} />
              {group ? "Manage group" : "Create / Join group"}
            </Link>
          </div>
        </section>

        {/* Assignments */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-white">
              Assignments
            </h2>

            <p className="mt-1 text-sm text-[#93A5A1]">
              All assignments assigned to you in this course.
            </p>
          </div>

          {courseAssignments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-[#1B2D25] px-6 py-14 text-center">
              <FileText
                size={32}
                className="mx-auto text-[#93A5A1]"
              />

              <h3 className="mt-4 font-semibold text-white">
                No assignments available
              </h3>

              <p className="mt-2 text-sm text-[#93A5A1]">
                Your professor has not assigned any work yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {courseAssignments.map((assignment) => {
                const deadline = new Date(assignment.dueDate);

                const validDeadline = !Number.isNaN(
                  deadline.getTime()
                );

                const isOverdue =
                  validDeadline &&
                  deadline.getTime() < Date.now();

                const isGroupAssignment =
                  String(assignment.submissionType).toLowerCase() ===
                  "group";

                // Find an individual submission
                const individualSubmission = submissions.find(
                  (submission) =>
                    submission.assignmentId === assignment.id &&
                    submission.studentId === currentUser.id &&
                    submission.status === "submitted"
                );

                // Group acknowledgement must use a shared group-level record.
                const isAcknowledged =
                  !isGroupAssignment &&
                  Boolean(individualSubmission);

                const submittedAt =
                  individualSubmission?.submittedAt;

                return (
                  <article
                    key={assignment.id}
                    className="rounded-2xl border border-white/10 bg-[#1B2D25] p-5 md:p-6"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
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
                          isAcknowledged
                            ? "bg-emerald-400/10 text-emerald-300"
                            : isOverdue
                              ? "bg-red-400/10 text-red-300"
                              : "bg-amber-400/10 text-amber-300"
                        }`}
                      >
                        {isAcknowledged
                          ? "Acknowledged"
                          : isOverdue
                            ? "Overdue"
                            : "Pending"}
                      </span>
                    </div>

                    {/* Assignment details */}
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
                        {isAcknowledged ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <Clock size={16} />
                        )}

                        {isAcknowledged
                          ? "Submitted"
                          : "Not submitted"}
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

                    {/* Individual acknowledgement */}
                    {isAcknowledged && individualSubmission && (
                      <div className="mt-5 rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-4">
                        <p className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                          <CheckCircle2 size={16} />
                          Assignment acknowledged
                        </p>

                        {submittedAt && (
                          <p className="mt-2 text-xs text-[#93A5A1]">
                            Submitted on:{" "}
                            {new Date(submittedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Group assignment without a group */}
                    {isGroupAssignment && !group && (
                      <div className="mt-5 rounded-xl border border-amber-400/15 bg-amber-400/5 p-4">
                        <p className="text-sm text-amber-200">
                          You are not part of any group. Create or join
                          one to submit this assignment.
                        </p>

                        <Link
                          href="/student/groups"
                          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#D7F35C]"
                        >
                          Go to groups
                          <ArrowLeft
                            size={14}
                            className="rotate-180"
                          />
                        </Link>
                      </div>
                    )}

                    {/* Group assignment with a group */}
                    {isGroupAssignment && group && (
                      <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm text-[#93A5A1]">
                          This is a group assignment. Only your group
                          leader can acknowledge the submission.
                        </p>
                      </div>
                    )}
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

// Page wrapper: Suspense handles dynamic route parameters
export default function StudentCoursePage({
  params,
}: StudentCoursePageProps) {
  return (
    <Suspense
      fallback={
        <DashboardLayout role="student" title="Loading course">
          <div className="flex min-h-[50vh] items-center justify-center">
            <p className="text-[#93A5A1]">
              Loading course details...
            </p>
          </div>
        </DashboardLayout>
      }
    >
      <StudentCourseContent params={params} />
    </Suspense>
  );
}
