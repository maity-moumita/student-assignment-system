
"use client";

import { useMemo, useState } from "react";

import {
  Users,
  Search,
  CheckCircle,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  TrendingUp,
} from "lucide-react";

import DashboardLayout from "@/components/common/DashboardLayout";

import { useAuth } from "@/context/AuthContext";
import { useAssignments } from "@/context/AssignmentContext";

import { initialUsers } from "@/data/Data";

type FilterType = "all" | "submitted" | "pending";

export default function AdminStudentsPage() {
  const { currentUser } = useAuth();

  const { assignments, submissions, loading } =
    useAssignments();

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<FilterType>("all");

  const [expandedStudent, setExpandedStudent] =
    useState<string | null>(null);

  // Get all students

  const students = initialUsers.filter(
    (user) => user.role === "student"
  );

  // Only assignments created by this admin

  const myAssignments = useMemo(
    () =>
      assignments.filter(
        (assignment) =>
          assignment.createdBy === currentUser?.id
      ),
    [assignments, currentUser]
  );

  // Calculate student information

  const studentData = useMemo(() => {
    return students.map((student) => {
      const assignedAssignments = myAssignments.filter(
        (assignment) =>
          assignment.assignedTo.includes(student.id)
      );

      const submittedCount = assignedAssignments.filter(
        (assignment) =>
          submissions.some(
            (submission) =>
              submission.assignmentId === assignment.id &&
              submission.studentId === student.id &&
              submission.status === "submitted"
          )
      ).length;

      const total = assignedAssignments.length;

      const pending = total - submittedCount;

      const progress =
        total === 0
          ? 0
          : Math.round((submittedCount / total) * 100);

      return {
        ...student,
        assignedAssignments,
        total,
        submitted: submittedCount,
        pending,
        progress,
      };
    });
  }, [students, myAssignments, submissions]);

  // Search and filter

  const filteredStudents = studentData.filter((student) => {
    const matchesSearch =
      student.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      student.email
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "submitted" &&
        student.total > 0 &&
        student.pending === 0) ||
      (filter === "pending" && student.pending > 0);

    return matchesSearch && matchesFilter;
  });

  // Overall statistics

  const totalStudents = students.length;

  const totalSubmissions = studentData.reduce(
    (sum, student) => sum + student.total,
    0
  );

  const totalSubmitted = studentData.reduce(
    (sum, student) => sum + student.submitted,
    0
  );

  const totalPending = totalSubmissions - totalSubmitted;

  const averageProgress =
    totalSubmissions === 0
      ? 0
      : Math.round(
          (totalSubmitted / totalSubmissions) * 100
        );

  return (
    <DashboardLayout
      role="admin"
      title="Student Management"
    >
      {/* Page heading */}

      <section className="mb-8">
        <p className="text-sm font-semibold text-[var(--teal)]">
          STUDENT MANAGEMENT
        </p>

        <h2 className="text-2xl md:text-3xl font-bold mt-2">
          Your Students
        </h2>

        <p className="text-sm text-[var(--muted)] mt-2">
          Monitor students assigned to your assignments
          and track their submission progress.
        </p>
      </section>

      {/* Statistics */}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={Users}
          color="teal"
        />

        <StatCard
          title="Submission Opportunities"
          value={totalSubmissions}
          icon={BookOpen}
          color="pink"
        />

        <StatCard
          title="Submitted"
          value={totalSubmitted}
          icon={CheckCircle}
          color="teal"
        />

        <StatCard
          title="Pending"
          value={totalPending}
          icon={Clock}
          color="pink"
        />

      </section>

      {/* Overall progress */}

      <section className="glass rounded-2xl p-6 mt-7">

        <div className="flex justify-between items-center gap-3">

          <div>
            <h3 className="font-semibold text-lg">
              Student Completion Rate
            </h3>

            <p className="text-sm text-[var(--muted)] mt-1">
              Overall performance across your assignments
            </p>
          </div>

          <span className="text-2xl font-bold text-[var(--teal)]">
            {averageProgress}%
          </span>

        </div>

        <div className="h-3 rounded-full bg-[var(--border)] mt-5 overflow-hidden">
          <div
            className="h-full bg-[var(--teal)] rounded-full transition-all duration-500"
            style={{ width: `${averageProgress}%` }}
          />
        </div>

        <p className="text-xs text-[var(--muted)] mt-3">
          {totalSubmitted} of {totalSubmissions} submissions completed
        </p>

      </section>

      {/* Students list */}

      <section className="mt-10">

        <div className="mb-5">
          <h3 className="text-xl font-bold">
            Student Directory
          </h3>

          <p className="text-sm text-[var(--muted)] mt-1">
            View individual student performance.
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
            placeholder="Search by student name or email..."
            aria-label="Search students"
            className="bg-transparent outline-none w-full text-sm"
          />

        </div>

        {/* Filters */}

        <div className="flex flex-wrap gap-2 mb-6">

          {(
            [
              ["all", "All Students"],
              ["submitted", "Completed"],
              ["pending", "Pending Work"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filter === value
                  ? "bg-[var(--teal)] text-white"
                  : "glass text-[var(--muted)]"
              }`}
            >
              {label}
            </button>
          ))}

        </div>

        {/* Loading */}

        {loading ? (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-sm text-[var(--muted)]">
              Loading student records...
            </p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <Users
              size={32}
              className="mx-auto text-[var(--teal)]"
            />

            <h3 className="font-semibold mt-4">
              No students found
            </h3>

            <p className="text-sm text-[var(--muted)] mt-2">
              Try changing your search or filters.
            </p>
          </div>
        ) : (

          <div className="space-y-4">

            {filteredStudents.map((student) => {
              const expanded =
                expandedStudent === student.id;

              return (
                <div
                  key={student.id}
                  className="glass rounded-2xl p-5"
                >

                  {/* Student information */}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 shrink-0 rounded-xl bg-[var(--teal-light)] flex items-center justify-center">
                        <Users
                          size={22}
                          className="text-[var(--teal)]"
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold">
                          {student.name}
                        </h3>

                        <p className="text-xs text-[var(--muted)] mt-1">
                          {student.email}
                        </p>
                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedStudent(
                          expanded ? null : student.id
                        )
                      }
                      aria-expanded={expanded}
                      className="glass rounded-xl px-4 py-2 text-sm flex items-center justify-center gap-2"
                    >
                      {expanded ? "Hide Details" : "View Details"}

                      {expanded ? (
                        <ChevronUp size={17} />
                      ) : (
                        <ChevronDown size={17} />
                      )}
                    </button>

                  </div>

                  {/* Student statistics */}

                  <div className="grid grid-cols-3 gap-3 mt-6">

                    <MiniStat
                      title="Assigned"
                      value={student.total}
                    />

                    <MiniStat
                      title="Submitted"
                      value={student.submitted}
                    />

                    <MiniStat
                      title="Pending"
                      value={student.pending}
                    />

                  </div>

                  {/* Progress */}

                  <div className="mt-5">

                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[var(--muted)]">
                        Completion
                      </span>

                      <span className="font-semibold text-[var(--teal)]">
                        {student.progress}%
                      </span>
                    </div>

                    <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--teal)] rounded-full transition-all"
                        style={{
                          width: `${student.progress}%`,
                        }}
                      />
                    </div>

                  </div>

                  {/* Expanded assignment details */}

                  {expanded && (
                    <div className="mt-6 pt-5 border-t border-[var(--border)]">

                      <h4 className="font-semibold mb-4">
                        Assignment Details
                      </h4>

                      {student.assignedAssignments.length === 0 ? (
                        <p className="text-sm text-[var(--muted)]">
                          No assignments have been assigned to this student by you.
                        </p>
                      ) : (

                        <div className="space-y-3">

                          {student.assignedAssignments.map(
                            (assignment) => {
                              const isSubmitted = submissions.some(
                                (item) =>
                                  item.assignmentId === assignment.id &&
                                  item.studentId === student.id &&
                                  item.status === "submitted"
                              );

                              return (
                                <div
                                  key={assignment.id}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass rounded-xl p-4"
                                >

                                  <div>
                                    <p className="text-sm font-semibold">
                                      {assignment.title}
                                    </p>

                                    <p className="text-xs text-[var(--muted)] mt-1">
                                      Due:{" "}
                                      {new Date(
                                        `${assignment.dueDate}T00:00:00`
                                      ).toLocaleDateString("en-IN")}
                                    </p>
                                  </div>

                                  <span
                                    className={`text-xs font-semibold px-3 py-2 rounded-full ${
                                      isSubmitted
                                        ? "bg-[var(--teal-light)] text-[var(--teal)]"
                                        : "bg-[var(--pink-light)] text-[var(--pink)]"
                                    }`}
                                  >
                                    {isSubmitted
                                      ? "Submitted"
                                      : "Not Submitted"}
                                  </span>

                                </div>
                              );
                            }
                          )}

                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}

      </section>

    </DashboardLayout>
  );
}

// Statistics card

function StatCard({
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

function MiniStat({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="glass rounded-xl p-3">
      <p className="text-xs text-[var(--muted)]">
        {title}
      </p>

      <p className="text-xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}
