
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  BookOpen,
  Users,
  ChartNoAxesCombined,
  GraduationCap,
  X,
} from "lucide-react";

import type { UserRole } from "@/types";

type SidebarProps = {
  role: UserRole;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const studentLinks = [
  {
    name: "Dashboard",
    href: "/student",
    icon: LayoutDashboard,
  },
  {
    name: "My Assignments",
    href: "/student/assignments",
    icon: BookOpen,
  },
  {
    name: "My Progress",
    href: "/student/progress",
    icon: ChartNoAxesCombined,
  },
];

const adminLinks = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Assignments",
    href: "/admin/assignments",
    icon: BookOpen,
  },
  {
    name: "Students",
    href: "/admin/students",
    icon: Users,
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: ChartNoAxesCombined,
  },
];

export default function Sidebar({
  role,
  open,
  setOpen,
}: SidebarProps) {
  const pathname = usePathname();

  const links =
    role === "admin" ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile overlay */}

      {open && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          h-screen w-64 flex-shrink-0
          glass-strong p-5 flex flex-col
          transition-transform duration-300
          md:translate-x-0
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Logo */}

        <div className="flex items-center justify-between mb-10">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-[var(--teal)] flex items-center justify-center">
              <GraduationCap
                size={24}
                className="text-white"
              />
            </div>

            <div>
              <h2 className="font-bold text-lg">
                Assignment Hub
              </h2>

              <p className="text-xs text-[var(--muted)]">
                Management Portal
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
            className="md:hidden"
          >
            <X size={20} />
          </button>

        </div>

        {/* User role */}

        <div className="pink-surface rounded-xl p-3 mb-8">

          <p className="text-xs opacity-70">
            LOGGED IN AS
          </p>

          <p className="font-semibold mt-1 capitalize">
            {role}
          </p>

        </div>

        {/* Navigation */}

        <p className="text-xs font-semibold text-[var(--muted)] mb-3 tracking-wider">
          MENU
        </p>

        <nav className="space-y-2">

          {links.map((item) => {
            const Icon = item.icon;

            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`
                  flex items-center gap-3
                  p-3 rounded-xl text-sm
                  transition-all duration-200
                  ${
                    active
                      ? "bg-[var(--teal-light)] text-[var(--teal)] font-semibold"
                      : "text-[var(--muted)] hover:bg-[var(--pink-light)] hover:text-[var(--pink)]"
                  }
                `}
              >
                <Icon size={19} />
                {item.name}
              </Link>
            );
          })}

        </nav>

        {/* Bottom section */}

        <div className="mt-auto glass rounded-xl p-4">

          <p className="text-sm font-semibold">
            Need assistance?
          </p>

          <p className="text-xs text-[var(--muted)] mt-1">
            Manage your work efficiently.
          </p>

        </div>

      </aside>
    </>
  );
}
