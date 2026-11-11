
"use client";

import { useMemo, useState } from "react";

import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  BookOpen,
} from "lucide-react";

import DashboardLayout from "@/components/common/DashboardLayout";
import CourseGrid from "@/components/common/CourseGrid";
import Link from "next/link";
import { useGroups } from "@/context/GroupContext";

import StudentStats from "@/components/student/StudentStats";

import AssignmentCard from "@/components/student/AssignmentCard";

import SubmissionDialog from "@/components/student/SubmissionDialog";

import EmptyState from "@/components/common/EmptyState";

import { useAuth } from "@/context/AuthContext";

import { useAssignments } from "@/context/AssignmentContext";

import type { Assignment } from "@/types";

type StatusFilter = "all" | "submitted" | "not_submitted";
type DueFilter = "all" | "upcoming" | "overdue";
type SortOption = "newest" | "dueDate" | "title";

export default function StudentPage() {
  const { currentUser } = useAuth();
  const { getMyGroup } = useGroups();

  const {
    assignments,
    submissions,
    loading,
    submitAssignment,
  } = useAssignments();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [dueFilter, setDueFilter] =
    useState<DueFilter>("all");

  const [sortBy, setSortBy] =
    useState<SortOption>("dueDate");

  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  // Get student's assignments

  const studentAssignments = useMemo(() => {
    if (!currentUser) return [];

    return assignments.filter((assignment) =>
      assignment.assignedTo.includes(currentUser.id)
    );
  }, [assignments, currentUser]);

  // Get student's submission status

  function getSubmission(assignmentId: string) {
    return submissions.find(
      (item) =>
        item.assignmentId === assignmentId &&
        item.studentId === currentUser?.id
    );
  }

  // Calculate statistics

  const total = studentAssignments.length;

  const submitted = studentAssignments.filter(
    (assignment) =>
      getSubmission(assignment.id)?.status === "submitted"
  ).length;

  const pending = total - submitted;

  // Search, filter and sorting

  const filteredAssignments = useMemo(() => {
    let result = studentAssignments.filter((assignment) => {
      const submission = submissions.find(
        (item) =>
          item.assignmentId === assignment.id &&
          item.studentId === currentUser?.id
      );

      const status =
        submission?.status ?? "not_submitted";

      const matchesSearch =
        assignment.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        assignment.description
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dueDate = new Date(
        assignment.dueDate
      );

      const isOverdue =
        status !== "submitted" && dueDate < today;

      const matchesDue =
        dueFilter === "all" ||
        (dueFilter === "upcoming" && !isOverdue) ||
        (dueFilter === "overdue" && isOverdue);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDue
      );
    });

    // Sorting

    result = [...result].sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
      }

      return (
        new Date(a.dueDate).getTime() -
        new Date(b.dueDate).getTime()
      );
    });

    return result;
  }, [
    studentAssignments,
    submissions,
    currentUser,
    search,
    statusFilter,
    dueFilter,
    sortBy,
  ]);

  // Handle final submission

  function handleSubmission() {
    if (!currentUser || !selectedAssignment) return;

    if (selectedAssignment.submissionType === "group") {
      const group = selectedAssignment.courseId ? getMyGroup(selectedAssignment.courseId, currentUser.id) : undefined;
      if (!group || group.leaderId !== currentUser.id) return;
      const timestamp = new Date().toISOString();
      group.memberIds.forEach((memberId) => submitAssignment(selectedAssignment.id, memberId, currentUser.id, timestamp));
    } else {
      submitAssignment(selectedAssignment.id, currentUser.id);
    }

    setSelectedAssignment(null);
  }

  return (
    <DashboardLayout
      role="student"
      title="Student Dashboard"
    >

      {/* Welcome */}

      <section className="mb-8">

        <p className="text-sm text-[var(--teal)] font-semibold">
          STUDENT WORKSPACE
        </p>

        <h2 className="text-2xl md:text-3xl font-bold mt-2">
          Hello, {currentUser?.name}
        </h2>

        <p className="text-sm text-[var(--muted)] mt-2">
          Track your assignments and stay on top of your deadlines.
        </p>

      </section>

      <CourseGrid role="student" userId={currentUser?.id ?? ""} />

      {/* Statistics */}

      <StudentStats
        total={total}
        submitted={submitted}
        pending={pending}
      />

      {/* Overall progress */}

      <section className="glass rounded-2xl p-6 mt-7">

        <div className="flex justify-between items-center gap-3">

          <div>
            <h3 className="text-lg font-semibold">
              Overall Progress
            </h3>

            <p className="text-sm text-[var(--muted)] mt-1">
              Your assignment completion
            </p>
          </div>

          <span className="text-2xl font-bold text-[var(--teal)]">
            {total === 0
              ? 0
              : Math.round((submitted / total) * 100)}%
          </span>

        </div>

        <div className="w-full bg-[var(--border)] h-3 rounded-full mt-5 overflow-hidden">

          <div
            className="bg-[var(--teal)] h-full rounded-full transition-all duration-500"
            style={{
              width: `${
                total === 0
                  ? 0
                  : (submitted / total) * 100
              }%`,
            }}
          />

        </div>

        <p className="text-xs text-[var(--muted)] mt-3">
          {submitted} of {total} assignments submitted
        </p>

      </section>

      {/* Assignments heading */}

      <section className="mt-10">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

          <div>
            <h3 className="text-xl font-bold">
              My Assignments
            </h3>

            <p className="text-sm text-[var(--muted)] mt-1">
              View and manage your assigned work.
            </p>
          </div>

          <span className="text-sm text-[var(--muted)]">
            {filteredAssignments.length} results
          </span>

        </div>

        {/* Search */}

        <div className="glass rounded-xl flex items-center gap-3 px-4 py-3 mb-5">

          <Search
            size={19}
            className="text-[var(--muted)]"
          />

          <input
            type="search"
            aria-label="Search assignments"
            placeholder="Search assignments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          />

        </div>

        {/* Filters */}

        <div className="glass rounded-xl p-4 mb-6">

          <div className="flex items-center gap-2 mb-4">

            <SlidersHorizontal
              size={17}
              className="text-[var(--teal)]"
            />

            <span className="text-sm font-semibold">
              Filters and Sorting
            </span>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            <select
              aria-label="Filter by submission status"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as StatusFilter)
              }
              className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="not_submitted">Not Submitted</option>
            </select>

            <select
              aria-label="Filter by due date"
              value={dueFilter}
              onChange={(e) =>
                setDueFilter(e.target.value as DueFilter)
              }
              className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm"
            >
              <option value="all">All Due Dates</option>
              <option value="upcoming">Upcoming</option>
              <option value="overdue">Overdue</option>
            </select>

            <select
              aria-label="Sort assignments"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as SortOption)
              }
              className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="newest">Newest First</option>
              <option value="title">Title A-Z</option>
            </select>

          </div>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setDueFilter("all");
              setSortBy("dueDate");
            }}
            className="text-xs text-[var(--pink)] font-semibold mt-4"
          >
            Clear all filters
          </button>

        </div>

        {/* Loading */}

        {loading ? (
          <div className="glass rounded-2xl p-10 text-center">
            <div className="w-8 h-8 border-4 border-[var(--teal)] border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="text-sm text-[var(--muted)] mt-4">
              Loading assignments...
            </p>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <EmptyState />
        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {filteredAssignments.map((assignment) => {
              const ownSubmission = getSubmission(assignment.id);
              const group = assignment.submissionType === "group" && assignment.courseId && currentUser ? getMyGroup(assignment.courseId, currentUser.id) : undefined;
              const groupSubmission = group ? submissions.find(item => item.assignmentId === assignment.id && group.memberIds.includes(item.studentId) && item.status === "submitted") : undefined;
              const submission = assignment.submissionType === "group" ? groupSubmission : ownSubmission;
              const isLeader = !!group && group.leaderId === currentUser?.id;
              const noGroup = assignment.submissionType === "group" && !group;
              const groupMessage = noGroup ? "You are not part of any group. Create or join one to submit this assignment." : group && !isLeader && !submission ? `Only ${group.leaderId === currentUser?.id ? "you" : "your group leader"} can acknowledge this submission. Your leader is ${group.leaderId}.` : group && submission ? `Acknowledged by ${submission.acknowledgedBy === group.leaderId ? "your group leader" : "the group leader"} on ${new Date(submission.submittedAt || "").toLocaleString("en-IN")}` : undefined;
              return (
                <div key={assignment.id} className="relative">
                  <AssignmentCard assignment={assignment} status={submission?.status ?? "not_submitted"} submittedAt={submission?.submittedAt ?? null} canSubmit={assignment.submissionType !== "group" || isLeader} groupMessage={groupMessage} onSubmit={() => setSelectedAssignment(assignment)} />
                  {noGroup && <Link href="/student/groups" className="absolute bottom-[5.15rem] right-5 text-xs font-semibold text-[#53675C] underline underline-offset-4">Create or join a group</Link>}
                </div>
              );
            })}

          </div>
        )}

      </section>

      {/* Submission dialog */}

      <SubmissionDialog
        open={!!selectedAssignment}
        assignmentTitle={selectedAssignment?.title ?? ""}
        onClose={() => setSelectedAssignment(null)}
        onConfirm={handleSubmission}
      />

    </DashboardLayout>
  );
}
