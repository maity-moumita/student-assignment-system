"use client";

import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function AdminPage() {
  const { currentUser, logout } = useAuth();

  return (
    <ProtectedRoute role="admin">
      <main className="min-h-screen p-8">

        <div className="glass rounded-2xl p-8">

          <h1 className="text-3xl font-bold">
            Welcome, {currentUser?.name}
          </h1>

          <p className="text-[var(--muted)] mt-2">
            This is your Admin Dashboard.
          </p>

          <button
            onClick={logout}
            className="teal-button rounded-xl px-6 py-3 mt-6"
          >
            Logout
          </button>

        </div>

      </main>
    </ProtectedRoute>
  );
}