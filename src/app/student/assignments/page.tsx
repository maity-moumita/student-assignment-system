
"use client";

import { useMemo, useState } from "react";

import {
  Search,
  SlidersHorizontal,
  BookOpen,
  X,
} from "lucide-react";

import DashboardLayout from "@/components/common/DashboardLayout";

import AssignmentCard from "@/components/student/AssignmentCard";

import SubmissionDialog from "@/components/student/SubmissionDialog";

import StudentStats from "@/components/student/StudentStats";

import { useAuth } from "@/context/AuthContext";
import { useGroups } from "@/context/GroupContext";
import Link from "next/link";
import { useAssignments } from "@/context/AssignmentContext";

import type { Assignment } from "@/types";
import { initialUsers } from "@/data/Data";

type StatusFilter = "all" | "submitted" | "not_submitted";

type DueFilter = "all" | "upcoming" | "overdue";

type SortOption = "dueDate" | "newest" | "title";

export default function StudentAssignmentsPage() {
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

  // Get only the logged-in student's assignments

  const myAssignments = useMemo(() => {
    if (!currentUser) return [];

    return assignments.filter((assignment) =>
      assignment.assignedTo.includes(currentUser.id)
    );
  }, [assignments, currentUser]);

  // Get submission for an assignment

  function getSubmission(assignmentId: string) {
    return submissions.find(
      (item) =>
        item.assignmentId === assignmentId &&
        item.studentId === currentUser?.id
    );
  }

  // Calculate statistics

  const total = myAssignments.length;

  const submitted = myAssignments.filter(
    (assignment) =>
      getSubmission(assignment.id)?.status === "submitted"
  ).length;

  const pending = total - submitted;

  // Search, filter and sorting

  const filteredAssignments = useMemo(() => {
    let result = myAssignments.filter((assignment) => {
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
        `${assignment.dueDate}T00:00:00`
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
    myAssignments,
    submissions,
    currentUser,
    search,
    statusFilter,
    dueFilter,
    sortBy,
  ]);

  // Confirm submission

  function handleSubmission() {
    if (!currentUser || !selectedAssignment) return;

    if (selectedAssignment.submissionType === "group") {
      const group = selectedAssignment.courseId
        ? getMyGroup(selectedAssignment.courseId, currentUser.id)
        : undefined;
      if (!group || group.leaderId !== currentUser.id) return;
      const timestamp = new Date().toISOString();
      group.memberIds.forEach((memberId) =>
        submitAssignment(selectedAssignment.id, memberId, currentUser.id, timestamp)
      );
    } else {
      submitAssignment(selectedAssignment.id, currentUser.id);
    }

    setSelectedAssignment(null);
  }

  return (
    <DashboardLayout
      role="student"
      title="My Assignments"
    >

      {/* Heading */}

      <section className="mb-8">

        <p className="text-sm font-semibold text-[var(--teal)]">
          STUDENT WORKSPACE
        </p>

        <h2 className="text-2xl md:text-3xl font-bold mt-2">
          My Assignments
        </h2>

        <p className="text-sm text-[var(--muted)] mt-2">
          View your assigned work, deadlines and submission status.
        </p>

      </section>

      {/* Statistics */}

      <StudentStats
        total={total}
        submitted={submitted}
        pending={pending}
      />

      {/* Assignment progress */}

      <section className="glass rounded-2xl p-6 mt-7">

        <div className="flex justify-between items-center gap-3">

          <div>
            <h3 className="font-semibold">
              Assignment Completion
            </h3>

            <p className="text-xs text-[var(--muted)] mt-1">
              Your current submission progress
            </p>
          </div>

          <span className="text-2xl font-bold text-[var(--teal)]">
            {total === 0
              ? 0
              : Math.round((submitted / total) * 100)}%
          </span>

        </div>

        <div className="h-3 bg-[var(--border)] rounded-full overflow-hidden mt-5">
          <div
            className="h-full bg-[var(--teal)] rounded-full transition-all duration-500"
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

      {/* Search and filters */}

      <section className="mt-10">

        <div className="mb-5">
          <h3 className="text-xl font-bold">
            All Assignments
          </h3>

          <p className="text-sm text-[var(--muted)] mt-1">
            {filteredAssignments.length} assignments found
          </p>
        </div>

        {/* Search */}

        <div className="glass rounded-xl p-3 flex items-center gap-3">

          <Search size={19} className="text-[var(--muted)]" />

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assignments..."
            aria-label="Search assignments"
            className="bg-transparent outline-none w-full text-sm"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={17} />
            </button>
          )}

        </div>

        {/* Filters */}

        <div className="glass rounded-xl p-4 mt-4 mb-6">

          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal
              size={18}
              className="text-[var(--teal)]"
            />

            <span className="text-sm font-semibold">
              Filters and Sorting
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as StatusFilter
                )
              }
              aria-label="Filter by status"
              className="glass rounded-xl p-3 text-sm"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="not_submitted">Not Submitted</option>
            </select>

            <select
              value={dueFilter}
              onChange={(e) =>
                setDueFilter(e.target.value as DueFilter)
              }
              aria-label="Filter by due date"
              className="glass rounded-xl p-3 text-sm"
            >
              <option value="all">All Due Dates</option>
              <option value="upcoming">Upcoming</option>
              <option value="overdue">Overdue</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as SortOption)
              }
              aria-label="Sort assignments"
              className="glass rounded-xl p-3 text-sm"
            >
              <option value="dueDate">Due Date</option>
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

        {/* Assignment cards */}

        {loading ? (
          <div className="glass rounded-2xl p-10 text-center">
            <div className="w-8 h-8 border-4 border-[var(--teal)] border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="text-sm text-[var(--muted)] mt-4">
              Loading assignments...
            </p>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">

            <BookOpen
              size={35}
              className="mx-auto text-[var(--teal)]"
            />

            <h3 className="font-semibold mt-4">
              {myAssignments.length === 0
                ? "No assignments assigned yet"
                : "No assignments found"}
            </h3>

            <p className="text-sm text-[var(--muted)] mt-2">
              {myAssignments.length === 0
                ? "Your professor has not assigned any work to you yet."
                : "Try changing your search or filters."}
            </p>

          </div>
        ) : (

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

            {filteredAssignments.map((assignment) => {
              const ownSubmission = getSubmission(assignment.id);
              const group = assignment.submissionType === "group" && assignment.courseId && currentUser
                ? getMyGroup(assignment.courseId, currentUser.id)
                : undefined;
              const groupSubmission = group
                ? submissions.find(item => item.assignmentId === assignment.id && group.memberIds.includes(item.studentId) && item.status === "submitted")
                : undefined;
              const submission = assignment.submissionType === "group" ? groupSubmission : ownSubmission;
              const isLeader = !!group && group.leaderId === currentUser?.id;
              const noGroup = assignment.submissionType === "group" && !group;
              const leaderName = group ? (initialUsers.find(user => user.id === group.leaderId)?.name || "your group leader") : "";
              const acknowledgedBy = submission?.acknowledgedBy === group?.leaderId ? leaderName : "you";
              const groupMessage = noGroup
                ? "You are not part of any group. Create or join one to submit this assignment."
                : group && submission
                  ? `Acknowledged by ${acknowledgedBy} on ${new Date(submission.submittedAt || "").toLocaleString("en-IN")}`
                  : group && !isLeader
                    ? `Only ${leaderName} can acknowledge this group submission.`
                    : undefined;

              return (
                <div key={assignment.id} className="relative">
                  <AssignmentCard
                    assignment={assignment}
                    status={submission?.status ?? "not_submitted"}
                    submittedAt={submission?.submittedAt ?? null}
                    canSubmit={assignment.submissionType !== "group" || isLeader}
                    groupMessage={groupMessage}
                    onSubmit={() => setSelectedAssignment(assignment)}
                  />
                  {noGroup && <Link href="/student/groups" className="absolute bottom-[5.15rem] right-5 text-xs font-bold text-[#53675C] underline underline-offset-4">Create or join a group</Link>}
                </div>
              );
            })}

          </div>
        )}

      </section>

      {/* Submission confirmation */}

      <SubmissionDialog
        open={!!selectedAssignment}
        assignmentTitle={selectedAssignment?.title ?? ""}
        onClose={() => setSelectedAssignment(null)}
        onConfirm={handleSubmission}
      />

    </DashboardLayout>
  );
}
