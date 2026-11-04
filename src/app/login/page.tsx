
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  UserRound,
  ChevronDown,
  BookOpen,
  Users,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";

import { initialUsers } from "@/data/Data";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/common/ThemeToggle";

const CRIMSON = "#DC143C";

export default function LoginPage() {
  const [selectedUser, setSelectedUser] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { login, currentUser, loading } = useAuth();
  const router = useRouter();

  const admins = initialUsers.filter((user) => user.role === "admin");
  const students = initialUsers.filter((user) => user.role === "student");

  const selectedAccount = initialUsers.find(
    (user) => user.id === selectedUser
  );

  useEffect(() => {
    if (loading || !currentUser) return;

    router.replace(
      currentUser.role === "admin" ? "/admin" : "/student"
    );
  }, [currentUser, loading, router]);

  function handleLogin() {
    setError("");

    if (!selectedUser) {
      setError("Please select an account to continue.");
      return;
    }

    const user = initialUsers.find((item) => item.id === selectedUser);

    if (!user) {
      setError("Invalid account selected.");
      return;
    }

    try {
      setIsLoggingIn(true);
      login(selectedUser);

      router.replace(
        user.role === "admin" ? "/admin" : "/student"
      );
    } catch {
      setIsLoggingIn(false);
      setError("Unable to sign in. Please try again.");
    }
  }

  if (loading || currentUser) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div
          className="w-9 h-9 rounded-full border-[3px] animate-spin"
          style={{
            borderColor: `${CRIMSON} ${CRIMSON} transparent ${CRIMSON}`,
          }}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="h-[76px] border-b border-[var(--border)] px-5 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: CRIMSON }}
          >
            <GraduationCap size={22} className="text-white" />
          </div>

          <div>
            <h1 className="text-sm font-bold tracking-wide">
              Assignment Hub
            </h1>
            <p className="text-[10px] text-[var(--muted)] tracking-[2px] uppercase mt-0.5">
              Academic Workspace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-xs text-[#DC143C]">
            Welcome to your workspace
          </span>

          <div className="w-px h-7 bg-[#DC143C] hidden sm:block" />

          <div className="rounded-lg border border-[#DC143C] p-1">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="flex-1 flex items-center justify-center px-4 py-12 sm:px-8 relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute w-[450px] h-[450px] rounded-full blur-[160px] opacity-[0.08] pointer-events-none"
          style={{
            backgroundColor: CRIMSON,
            top: "15%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />

        <div className="relative z-10 w-full max-w-[1050px]">
          {/* Intro */}
         

          {/* Login Layout */}
          <div className="flex justify-center align-middle">

            {/* Login Panel */}
            <div className="bg-[var(--surface)] border border-[#DC143C] rounded-2xl p-7 sm:p-9 flex flex-col justify-center shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_12px_35px_rgba(0,0,0,0.18)]">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: CRIMSON }}
                  />

                  <span className="text-xs text-[var(--muted)]">
                    ACCOUNT LOGIN
                  </span>
                </div>

                <h3 className="text-2xl font-bold">Sign in</h3>

                <p className="text-sm text-[var(--muted)] mt-2">
                  Select your account to continue.
                </p>
              </div>

              {/* Account Select */}
              <div>
                <label
                  htmlFor="user"
                  className="block text-xs font-semibold text-[var(--foreground)] mb-3"
                >
                  Select your account
                </label>

                <div className="relative">
                  <select
                    id="user"
                    value={selectedUser}
                    disabled={isLoggingIn}
                    onChange={(event) => {
                      setSelectedUser(event.target.value);
                      setError("");
                    }}
                    className="w-full appearance-none bg-[var(--surface-tertiary)] border border-[var(--border)] rounded-xl px-4 py-4 pr-12 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[#DC143C] disabled:opacity-50"
                  >
                    <option value="">Choose an account</option>

                    <optgroup label="Administrators">
                      {admins.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} — Admin
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="Students">
                      {students.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} — Student
                        </option>
                      ))}
                    </optgroup>
                  </select>

                  <ChevronDown
                    size={17}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
                  />
                </div>
              </div>

              {/* Selected User */}
              {selectedAccount && (
                <div className="mt-4 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: `${CRIMSON}20`,
                      color: CRIMSON,
                    }}
                  >
                    <UserRound size={19} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {selectedAccount.name}
                    </p>

                    <p className="text-xs text-[var(--muted)] mt-1">
                      {selectedAccount.role === "admin"
                        ? "Administrator account"
                        : "Student account"}
                    </p>
                  </div>

                  <CheckCircle2 size={19} style={{ color: CRIMSON }} />
                </div>
              )}

              {/* Error */}
              {error && (
                <p role="alert" className="text-xs mt-4 text-red-500">
                  {error}
                </p>
              )}

              {/* Login Button */}
              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full mt-7 rounded-xl px-5 py-4 flex items-center justify-center gap-3 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
                style={{ backgroundColor: CRIMSON }}
              >
                {isLoggingIn
                  ? "Opening workspace..."
                  : "Continue to Dashboard"}

                {!isLoggingIn && <ArrowRight size={18} />}
              </button>

              {/* Demo Notice */}
              <div className="mt-7 flex items-start gap-3 border-t border-[var(--border)] pt-6">
                <LockKeyhole
                  size={17}
                  className="text-[var(--muted)] mt-0.5 shrink-0"
                />

                <div>
                  <p className="text-xs font-semibold">
                    Demo environment
                  </p>

                  <p className="text-[11px] text-[var(--muted)] leading-5 mt-1">
                    Mock Login.
                    <br />
                    No password Required
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="flex flex-col sm:flex-row justify-between gap-3 mt-7">
            <p className="text-[10px] text-[var(--muted)]">
              © 2026 Assignment Hub. All rights reserved.
            </p>

            <p className="text-[10px] text-[var(--muted)]">
              Student & Professor Workspace
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
