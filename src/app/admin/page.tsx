
"use client";

import DashboardLayout from "@/components/common/DashboardLayout";

import { useAuth } from "@/context/AuthContext";

import {
  BookOpen,
  Users,
  CheckCircle,
  Clock,
} from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  icon: React.ElementType;
  color: "teal" | "pink";
};

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: StatCardProps) {
  const iconColor =
    color === "pink"
      ? "text-[var(--pink)]"
      : "text-[var(--teal)]";

  return (
    <div className="glass glass-hover rounded-2xl p-5">

      <div className="flex justify-between items-center">

        <p className="text-sm text-[var(--muted)]">
          {title}
        </p>

        <Icon size={21} className={iconColor} />

      </div>

      <h3 className="text-3xl font-bold mt-5">
        {value}
      </h3>

    </div>
  );
}

export default function AdminPage() {
  const { currentUser } = useAuth();

  return (
    <DashboardLayout
      role="admin"
      title="Admin Dashboard"
    >

      {/* Welcome */}

      <section className="mb-8">

        <h2 className="text-2xl font-bold">
          Welcome back, {currentUser?.name} 👋
        </h2>

        <p className="text-sm text-[var(--muted)] mt-2">
          Manage assignments and monitor student progress.
        </p>

      </section>

      {/* Statistics */}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          title="Total Assignments"
          value="04"
          icon={BookOpen}
          color="teal"
        />

        <StatCard
          title="Total Students"
          value="05"
          icon={Users}
          color="pink"
        />

        <StatCard
          title="Submitted"
          value="08"
          icon={CheckCircle}
          color="teal"
        />

        <StatCard
          title="Pending"
          value="08"
          icon={Clock}
          color="pink"
        />

      </section>

      {/* Class progress */}

      <section className="glass rounded-2xl p-6 mt-8">

        <div className="flex justify-between items-center">

          <div>
            <h3 className="text-lg font-semibold">
              Class Submission Progress
            </h3>

            <p className="text-sm text-[var(--muted)] mt-1">
              Overall student submission status
            </p>
          </div>

          <span className="text-2xl font-bold text-[var(--teal)]">
            50%
          </span>

        </div>

        <div className="w-full h-3 bg-[var(--border)] rounded-full mt-5 overflow-hidden">

          <div
            className="h-full bg-[var(--teal)] rounded-full"
            style={{ width: "50%" }}
          />

        </div>

        <p className="text-xs text-[var(--muted)] mt-3">
          8 of 16 submissions completed
        </p>

      </section>

      {/* Quick actions */}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

        <div className="glass glass-hover rounded-2xl p-6">

          <div className="w-11 h-11 rounded-xl bg-[var(--teal-light)] flex items-center justify-center">
            <BookOpen
              size={22}
              className="text-[var(--teal)]"
            />
          </div>

          <h3 className="font-semibold mt-4">
            Manage Assignments
          </h3>

          <p className="text-sm text-[var(--muted)] mt-2">
            Create, update and manage student assignments.
          </p>

        </div>

        <div className="glass glass-hover rounded-2xl p-6">

          <div className="w-11 h-11 rounded-xl bg-[var(--pink-light)] flex items-center justify-center">
            <Users
              size={22}
              className="text-[var(--pink)]"
            />
          </div>

          <h3 className="font-semibold mt-4">
            Monitor Students
          </h3>

          <p className="text-sm text-[var(--muted)] mt-2">
            Track student submissions and class progress.
          </p>

        </div>

      </section>

    </DashboardLayout>
  );
}
