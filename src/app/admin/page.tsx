
"use client";

import { useMemo, useState } from "react";

import {
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import DashboardLayout from "@/components/common/DashboardLayout";

import AdminStats from "@/components/admin/AdminStats";

import AssignmentForm from "@/components/admin/AssignmentForm";

import AssignmentTable from "@/components/admin/AssignmentTable";

import EmptyState from "@/components/common/EmptyState";

import { useAuth } from "@/context/AuthContext";

import { useAssignments } from "@/context/AssignmentContext";

import { initialUsers } from "@/data/Data";

import type { Assignment } from "@/types";

type StatusFilter = "all" | "submitted" | "pending";

export default function AdminPage() {
  const { currentUser } = useAuth();

  const {
    assignments,
    submissions,
    loading,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  } = useAssignments();

  const [formOpen, setFormOpen] = useState(false);

  const [editingAssignment, setEditingAssignment] =
    useState<Assignment | null>(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  // Get all students

  const students = initialUsers.filter(
    (user) => user.role === "student"
  );

  // Show only assignments created by current admin

  const myAssignments = useMemo(() => {
    return assignments.filter(
      (assignment) =>
        assignment.createdBy === currentUser?.id
    );
  }, [assignments, currentUser]);

  // Get unique students assigned to this admin's assignments

  const assignedStudentIds = [
    ...new Set(
      myAssignments.flatMap(
        (assignment) => assignment.assignedTo
      )
    ),
  ];

  // Get submission records for admin's assignments

  const mySubmissions = submissions.filter((submission) =>
    myAssignments.some(
      (assignment) =>
        assignment.id === submission.assignmentId
    )
  );

  const submitted = mySubmissions.filter(
    (item) => item.status === "submitted"
  ).length;

  const pending = mySubmissions.filter(
    (item) => item.status === "not_submitted"
  ).length;

  // Search and filter assignments

  const filteredAssignments = useMemo(() => {
    return myAssignments.filter((assignment) => {
      const matchesSearch =
        assignment.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        assignment.description
          .toLowerCase()
          .includes(search.toLowerCase());

      const assignmentSubmissions = submissions.filter(
        (item) => item.assignmentId === assignment.id
      );

      const completed = assignmentSubmissions.some(
        (item) => item.status === "submitted"
      );

      const allSubmitted =
        assignment.assignedTo.length > 0 &&
        assignmentSubmissions.filter(
          (item) => item.status === "submitted"
        ).length === assignment.assignedTo.length;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "submitted" && allSubmitted) ||
        (statusFilter === "pending" && !allSubmitted);

      return matchesSearch && matchesStatus;
    });
  }, [
    myAssignments,
    submissions,
    search,
    statusFilter,
  ]);

  // Create assignment

  function handleCreate(assignment: Assignment) {
    if (!currentUser) return;

    createAssignment({
      ...assignment,
      createdBy: currentUser.id,
    });

    setEditingAssignment(null);
    setFormOpen(false);
  }

  // Edit assignment

  function handleEdit(assignment: Assignment) {
    if (assignment.createdBy !== currentUser?.id) {
      return;
    }

    setEditingAssignment(assignment);
    setFormOpen(true);
  }

  // Save edited assignment

  function handleUpdate(assignment: Assignment) {
    if (!currentUser) return;

    const existing = myAssignments.find(
      (item) => item.id === assignment.id
    );

    if (!existing) return;

    updateAssignment(assignment.id, {
      ...assignment,
      createdBy: currentUser.id,
    });

    setEditingAssignment(null);
    setFormOpen(false);
  }

  // Delete assignment

  function handleDelete(assignment: Assignment) {
    if (assignment.createdBy !== currentUser?.id) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${assignment.title}"?`
    );

    if (confirmed) {
      deleteAssignment(assignment.id);
    }
  }

  // Save form

  function handleSave(assignment: Assignment) {
    if (editingAssignment) {
      handleUpdate(assignment);
    } else {
      handleCreate(assignment);
    }
  }

  function openCreateForm() {
    setEditingAssignment(null);
    setFormOpen(true);
  }

  return (
    <DashboardLayout
      role="admin"
      title="Admin Dashboard"
    >

      {/* Welcome */}

      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <div>
          <p className="text-sm font-semibold text-[var(--teal)]">
            PROFESSOR WORKSPACE
          </p>

          <h2 className="text-2xl md:text-3xl font-bold mt-2">
            Welcome, {currentUser?.name}
          </h2>

          <p className="text-sm text-[var(--muted)] mt-2">
            Manage assignments and monitor student progress.
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

      {/* Statistics */}

      <AdminStats
        totalAssignments={myAssignments.length}
        totalStudents={assignedStudentIds.length}
        submitted={submitted}
        pending={pending}
      />

      {/* Overall class progress */}

      <section className="glass rounded-2xl p-6 mt-7">

        <div className="flex items-center justify-between gap-3">

          <div>
            <h3 className="text-lg font-semibold">
              Overall Submission Progress
            </h3>

            <p className="text-sm text-[var(--muted)] mt-1">
              Across your assignments
            </p>
          </div>

          <span className="text-2xl font-bold text-[var(--teal)]">
            {submitted + pending === 0
              ? 0
              : Math.round(
                  (submitted / (submitted + pending)) * 100
                )}%
          </span>

        </div>

        <div className="w-full h-3 bg-[var(--border)] rounded-full overflow-hidden mt-5">

          <div
            className="h-full bg-[var(--teal)] rounded-full transition-all duration-500"
            style={{
              width: `${
                submitted + pending === 0
                  ? 0
                  : (submitted / (submitted + pending)) * 100
              }%`,
            }}
          />

        </div>

        <p className="text-xs text-[var(--muted)] mt-3">
          {submitted} of {submitted + pending} submissions completed
        </p>

      </section>

      {/* Assignment management */}

      <section className="mt-10">

        <div className="mb-6">

          <h3 className="text-xl font-bold">
            My Assignments
          </h3>

          <p className="text-sm text-[var(--muted)] mt-1">
            Create, manage and monitor your assignments.
          </p>

        </div>

        {/* Search */}

        <div className="glass rounded-xl p-3 flex items-center gap-3 mb-4">

          <Search
            size={19}
            className="text-[var(--muted)]"
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

        <div className="flex flex-wrap items-center gap-3 mb-6">

          <SlidersHorizontal
            size={17}
            className="text-[var(--teal)]"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as StatusFilter)
            }
            aria-label="Filter assignments by completion"
            className="glass rounded-xl p-3 text-sm"
          >
            <option value="all">All Assignments</option>
            <option value="submitted">Fully Submitted</option>
            <option value="pending">Pending Submissions</option>
          </select>

          <span className="text-xs text-[var(--muted)]">
            {filteredAssignments.length} assignments
          </span>

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
          <AssignmentTable
            assignments={filteredAssignments}
            students={students}
            submissions={submissions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

      </section>

      {/* Assignment Form */}

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
