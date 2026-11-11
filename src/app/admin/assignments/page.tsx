
"use client";

import { useMemo, useState } from "react";

import {
  Plus,
  Search,
  SlidersHorizontal,
  BookOpen,
  CalendarDays,
  Users,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  X,
} from "lucide-react";

import DashboardLayout from "@/components/common/DashboardLayout";

import AssignmentForm from "@/components/admin/AssignmentForm";

import StudentStatus from "@/components/admin/StudentStatus";

import { useAuth } from "@/context/AuthContext";
import { useAssignments } from "@/context/AssignmentContext";

import { initialUsers } from "@/data/Data";

import type { Assignment } from "@/types";

type FilterType =
  | "all"
  | "pending"
  | "completed"
  | "overdue";

type SortType = "dueDate" | "newest" | "title";

export default function AdminAssignmentsPage() {
  const { currentUser } = useAuth();

  const {
    assignments,
    submissions,
    loading,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  } = useAssignments();

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<FilterType>("all");

  const [sortBy, setSortBy] = useState<SortType>("dueDate");

  const [formOpen, setFormOpen] = useState(false);

  const [editingAssignment, setEditingAssignment] =
    useState<Assignment | null>(null);

  const [expandedId, setExpandedId] = useState<string | null>(
    null
  );

  // Get students

  const students = initialUsers.filter(
    (user) => user.role === "student"
  );

  // Get only assignments created by logged-in admin

  const myAssignments = useMemo(() => {
    return assignments.filter(
      (assignment) =>
        assignment.createdBy === currentUser?.id
    );
  }, [assignments, currentUser]);

  // Calculate assignment statistics

  function getStats(assignment: Assignment) {
    const submitted = assignment.assignedTo.filter(
      (studentId) =>
        submissions.some(
          (item) =>
            item.assignmentId === assignment.id &&
            item.studentId === studentId &&
            item.status === "submitted"
        )
    ).length;

    const total = assignment.assignedTo.length;

    const pending = total - submitted;

    const progress =
      total === 0
        ? 0
        : Math.round((submitted / total) * 100);

    return {
      submitted,
      pending,
      total,
      progress,
    };
  }

  // Search, filter and sort

  const filteredAssignments = useMemo(() => {
    let result = myAssignments.filter((assignment) => {
      const matchesSearch =
        assignment.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        assignment.description
          .toLowerCase()
          .includes(search.toLowerCase());

      const stats = getStats(assignment);

      const dueDate = new Date(
        assignment.dueDate
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const isOverdue =
        stats.pending > 0 && dueDate < today;

      const matchesFilter =
        filter === "all" ||
        (filter === "pending" && stats.pending > 0) ||
        (filter === "completed" &&
          stats.total > 0 &&
          stats.pending === 0) ||
        (filter === "overdue" && isOverdue);

      return matchesSearch && matchesFilter;
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
    search,
    filter,
    sortBy,
  ]);

  // Overall statistics

  const totalSubmissions = myAssignments.reduce(
    (sum, assignment) =>
      sum + assignment.assignedTo.length,
    0
  );

  const totalSubmitted = myAssignments.reduce(
    (sum, assignment) =>
      sum + getStats(assignment).submitted,
    0
  );

  const totalPending = totalSubmissions - totalSubmitted;

  const completion =
    totalSubmissions === 0
      ? 0
      : Math.round(
          (totalSubmitted / totalSubmissions) * 100
        );

  // Create assignment

  function handleCreate(assignment: Assignment) {
    if (!currentUser) return;

    createAssignment({
      ...assignment,
      createdBy: currentUser.id,
    });
  }

  // Edit assignment

  function handleEdit(assignment: Assignment) {
    if (assignment.createdBy !== currentUser?.id) return;

    setEditingAssignment(assignment);
    setFormOpen(true);
  }

  // Delete assignment

  function handleDelete(assignment: Assignment) {
    if (assignment.createdBy !== currentUser?.id) return;

    const confirmed = window.confirm(
      `Delete "${assignment.title}"? This will also delete its submission records.`
    );

    if (confirmed) {
      deleteAssignment(assignment.id);
    }
  }

  // Save assignment

  function handleSave(assignment: Assignment) {
    if (!currentUser) return;

    if (editingAssignment) {
      updateAssignment(assignment.id, {
        ...assignment,
        createdBy: currentUser.id,
      });
    } else {
      handleCreate(assignment);
    }

    setEditingAssignment(null);
    setFormOpen(false);
  }

  function openCreateForm() {
    setEditingAssignment(null);
    setFormOpen(true);
  }

  return (
    <DashboardLayout
      role="admin"
      title="Assignment Management"
    >

      {/* Page heading */}

      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <div>
          <p className="text-sm font-semibold tracking-wider text-[var(--teal)]">
            ASSIGNMENT MANAGEMENT
          </p>

          <h2 className="text-2xl md:text-3xl font-bold mt-2">
            My Assignments
          </h2>

          <p className="text-sm text-[var(--muted)] mt-2">
            Create, manage and monitor your assignments.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="teal-button rounded-xl px-5 py-3 flex items-center justify-center gap-2 font-semibold"
        >
          <Plus size={19} />
          Create Assignment
        </button>

      </section>

      {/* Summary cards */}

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7">

        <SummaryCard
          title="Total Assignments"
          value={myAssignments.length}
          color="teal"
          icon={<BookOpen size={21} />}
        />

        <SummaryCard
          title="Submitted"
          value={totalSubmitted}
          color="pink"
          icon={<Users size={21} />}
        />

        <SummaryCard
          title="Pending"
          value={totalPending}
          color="teal"
          icon={<CalendarDays size={21} />}
        />

      </section>

      {/* Overall completion */}

      <section className="glass rounded-2xl p-6 mb-8">

        <div className="flex justify-between items-center gap-3">

          <div>
            <h3 className="font-semibold">
              Overall Submission Progress
            </h3>

            <p className="text-xs text-[var(--muted)] mt-1">
              Across all assignments created by you
            </p>
          </div>

          <span className="text-xl font-bold text-[var(--teal)]">
            {completion}%
          </span>

        </div>

        <div className="h-3 bg-[var(--border)] rounded-full overflow-hidden mt-5">

          <div
            className="h-full bg-[var(--teal)] rounded-full transition-all duration-500"
            style={{ width: `${completion}%` }}
          />

        </div>

        <p className="text-xs text-[var(--muted)] mt-3">
          {totalSubmitted} of {totalSubmissions} submissions completed
        </p>

      </section>

      {/* Search */}

      <section>

        <div className="mb-5">

          <h3 className="text-xl font-bold">
            Assignment List
          </h3>

          <p className="text-sm text-[var(--muted)] mt-1">
            Manage your assignments and track student activity.
          </p>

        </div>

        <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">

          <Search
            size={19}
            className="text-[var(--muted)] shrink-0"
          />

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

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center mt-5 mb-6">

          <div className="flex items-center gap-2 text-[var(--teal)]">
            <SlidersHorizontal size={19} />
            <span className="text-sm font-semibold">
              Filters
            </span>
          </div>

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as FilterType)
            }
            aria-label="Filter assignments"
            className="glass rounded-xl px-4 py-3 text-sm flex-1"
          >
            <option value="all">All Assignments</option>
            <option value="pending">Pending Submissions</option>
            <option value="completed">Fully Submitted</option>
            <option value="overdue">Overdue</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as SortType)
            }
            aria-label="Sort assignments"
            className="glass rounded-xl px-4 py-3 text-sm flex-1"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="newest">Newest First</option>
            <option value="title">Title A-Z</option>
          </select>

          <span className="text-xs text-[var(--muted)]">
            {filteredAssignments.length} assignments
          </span>

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
              size={34}
              className="mx-auto text-[var(--teal)]"
            />

            <h3 className="font-semibold text-lg mt-4">
              {myAssignments.length === 0
                ? "No assignments created yet"
                : "No matching assignments"}
            </h3>

            <p className="text-sm text-[var(--muted)] mt-2">
              {myAssignments.length === 0
                ? "Create your first assignment to get started."
                : "Try changing your search or filters."}
            </p>

            {myAssignments.length === 0 && (
              <button
                type="button"
                onClick={openCreateForm}
                className="teal-button rounded-xl px-5 py-3 mt-5"
              >
                Create Assignment
              </button>
            )}

          </div>
        ) : (

          <div className="space-y-5">

            {filteredAssignments.map((assignment) => {
              const stats = getStats(assignment);

              const expanded = expandedId === assignment.id;

              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const dueDate = new Date(
                assignment.dueDate
              );

              const overdue =
                stats.pending > 0 && dueDate < today;

              return (
                <article
                  key={assignment.id}
                  className="glass glass-hover rounded-2xl p-5 md:p-6"
                >

                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">

                    {/* Assignment details */}

                    <div className="flex-1 min-w-0">

                      <h3 className="text-lg font-bold">
                        {assignment.title}
                      </h3>

                      <p className="text-sm text-[var(--muted)] mt-2 leading-6">
                        {assignment.description}
                      </p>

                      <div className="flex flex-wrap gap-4 mt-4">

                        <span className="flex items-center gap-2 text-xs text-[var(--muted)]">
                          <CalendarDays size={15} />

                          {dueDate.toLocaleDateString("en-IN")}
                        </span>

                        <span className="flex items-center gap-2 text-xs text-[var(--muted)]">
                          <Users size={15} />

                          {stats.total} Students
                        </span>

                        <a
                          href={assignment.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-[var(--teal)] font-semibold"
                        >
                          <ExternalLink size={15} />
                          Drive Link
                        </a>

                      </div>

                      {overdue && (
                        <span className="inline-block mt-4 rounded-full px-3 py-1 text-xs font-semibold bg-[var(--pink-light)] text-[var(--pink)]">
                          Overdue
                        </span>
                      )}

                    </div>

                    {/* Progress */}

                    <div className="w-full xl:w-40 shrink-0">

                      <div className="flex justify-between text-sm font-semibold mb-2">
                        <span>{stats.submitted}/{stats.total}</span>
                        <span className="text-[var(--teal)]">
                          {stats.progress}%
                        </span>
                      </div>

                      <div className="h-2.5 bg-[var(--border)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--teal)] rounded-full transition-all"
                          style={{
                            width: `${stats.progress}%`,
                          }}
                        />
                      </div>

                      <p className="text-xs text-[var(--muted)] mt-2">
                        Submitted
                      </p>

                    </div>

                    {/* Actions */}

                    <div className="flex items-center gap-2">

                      <button
                        type="button"
                        onClick={() => handleEdit(assignment)}
                        aria-label="Edit assignment"
                        className="glass rounded-xl p-3 text-[var(--teal)] hover:bg-[var(--teal-light)]"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(assignment)}
                        aria-label="Delete assignment"
                        className="glass rounded-xl p-3 text-[var(--pink)] hover:bg-[var(--pink-light)]"
                      >
                        <Trash2 size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(
                            expanded ? null : assignment.id
                          )
                        }
                        aria-label="Toggle student details"
                        aria-expanded={expanded}
                        className="glass rounded-xl p-3"
                      >
                        {expanded ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>

                    </div>

                  </div>

                  {/* Student status details */}

                  {expanded && (
                    <div className="mt-6 pt-5 border-t border-[var(--border)]">

                      <StudentStatus
                        assignment={assignment}
                        students={students}
                        submissions={submissions}
                      />

                    </div>
                  )}

                </article>
              );
            })}

          </div>
        )}

      </section>

      {/* Create/Edit form */}

      <AssignmentForm
        open={formOpen}
        students={students}
        editingAssignment={editingAssignment}
        onClose={() => {
          setFormOpen(false);
          setEditingAssignment(null);
        }}
        onSave={handleSave}
      />

    </DashboardLayout>
  );
}

// Reusable summary card

function SummaryCard({
  title,
  value,
  color,
  icon,
}: {
  title: string;
  value: number;
  color: "teal" | "pink";
  icon: React.ReactNode;
}) {
  const pink = color === "pink";

  return (
    <div className="glass rounded-2xl p-5">

      <div className="flex items-center justify-between gap-2">

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
