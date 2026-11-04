
"use client";

import { useEffect, type ReactNode } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import type { UserRole } from "@/types";

type ProtectedRouteProps = {
  children: ReactNode;
  role: UserRole;
};

export default function ProtectedRoute({
  children,
  role,
}: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    if (currentUser.role !== role) {
      if (currentUser.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/student");
      }
    }
  }, [currentUser, loading, role, router]);

  if (
    loading ||
    !currentUser ||
    currentUser.role !== role
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">

        <div className="text-center">

          <div className="w-9 h-9 border-4 border-[var(--teal)] border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="text-sm text-[var(--muted)] mt-3">
            Loading workspace...
          </p>

        </div>

      </div>
    );
  }

  return <>{children}</>;
}
