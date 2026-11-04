
"use client";

import {
  BookOpen,
  Users,
  CheckCircle,
  Clock,
} from "lucide-react";

type AdminStatsProps = {
  totalAssignments: number;
  totalStudents: number;
  submitted: number;
  pending: number;
};

export default function AdminStats({
  totalAssignments,
  totalStudents,
  submitted,
  pending,
}: AdminStatsProps) {
  const stats = [
    {
      title: "My Assignments",
      value: totalAssignments,
      icon: BookOpen,
      color: "text-[var(--teal)]",
      background: "bg-[var(--teal-light)]",
    },
    {
      title: "Students",
      value: totalStudents,
      icon: Users,
      color: "text-[var(--pink)]",
      background: "bg-[var(--pink-light)]",
    },
    {
      title: "Submitted",
      value: submitted,
      icon: CheckCircle,
      color: "text-[var(--teal)]",
      background: "bg-[var(--teal-light)]",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock,
      color: "text-[var(--pink)]",
      background: "bg-[var(--pink-light)]",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="glass glass-hover rounded-2xl p-5"
          >

            <div className="flex items-center justify-between">

              <p className="text-sm text-[var(--muted)]">
                {item.title}
              </p>

              <div className={`${item.background} p-3 rounded-xl`}>
                <Icon size={21} className={item.color} />
              </div>

            </div>

            <h3 className="text-3xl font-bold mt-5">
              {item.value}
            </h3>

          </div>
        );
      })}

    </section>
  );
}
