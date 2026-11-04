
"use client";

import { useState, type ReactNode } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";
import ProtectedRoute from "./ProtectedRoute";

import type { UserRole } from "@/types";

type DashboardLayoutProps = {
  children: ReactNode;
  role: UserRole;
  title: string;
};

export default function DashboardLayout({
  children,
  role,
  title,
}: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <ProtectedRoute role={role}>

      <div className="min-h-screen flex">

        {/* Sidebar */}

        <Sidebar
          role={role}
          open={open}
          setOpen={setOpen}
        />

        {/* Main content */}

        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8">

          <Header
            title={title}
            setOpen={setOpen}
          />

          <div className="mt-6">
            {children}
          </div>

        </main>

      </div>

    </ProtectedRoute>
  );
}
