
"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import {
  ArrowRight,
  GraduationCap,
  BookOpen,
  Users,
  ShieldCheck,
} from "lucide-react";

import { initialUsers } from "@/data/Data";

import { useAuth } from "@/context/AuthContext";

import ThemeToggle from "@/components/common/ThemeToggle";

export default function LoginPage() {
  const [selectedUser, setSelectedUser] = useState("");

  const [error, setError] = useState("");

  const { login, currentUser, loading } = useAuth();

  const router = useRouter();

  // Redirect already logged-in users

  useEffect(() => {
    if (loading) return;

    if (currentUser) {
      if (currentUser.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/student");
      }
    }
  }, [currentUser, loading, router]);

  // Handle login

  function handleLogin() {
    setError("");

    if (!selectedUser) {
      setError("Please select an account first.");
      return;
    }

    try {
      const user = initialUsers.find(
        (item) => item.id === selectedUser
      );

      if (!user) {
        setError("Invalid account selected.");
        return;
      }

      login(selectedUser);

      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/student");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  if (loading || currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--teal)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 md:p-8">

      {/* Background decorations */}

      <div className="absolute w-72 h-72 bg-[var(--teal)] opacity-10 blur-[100px] rounded-full top-0 left-0" />

      <div className="absolute w-72 h-72 bg-[var(--pink)] opacity-10 blur-[100px] rounded-full bottom-0 right-0" />

      {/* Theme toggle */}

      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Main container */}

      <div className="glass-strong relative z-10 w-full max-w-5xl rounded-3xl overflow-hidden grid md:grid-cols-2">

        {/* Left panel */}

        <div className="relative bg-[#152a2b] text-white p-8 md:p-12 flex flex-col justify-between min-h-[540px] overflow-hidden">

          <div className="absolute w-64 h-64 bg-teal-400 opacity-20 blur-[90px] rounded-full -top-20 -right-20" />

          <div className="absolute w-64 h-64 bg-pink-400 opacity-20 blur-[90px] rounded-full bottom-0 -left-20" />

          <div className="relative z-10">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                <GraduationCap size={25} />
              </div>

              <span className="font-bold tracking-wide">
                ASSIGNMENT HUB
              </span>

            </div>

            <div className="mt-24">

              <p className="text-teal-300 text-xs tracking-[3px] font-semibold">
                LEARN · SUBMIT · ACHIEVE
              </p>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight mt-5">
                Your learning.
                <br />
                Your progress.
                <br />
                <span className="text-pink-300">
                  One workspace.
                </span>
              </h1>

              <p className="text-gray-300 text-sm leading-7 mt-6 max-w-sm">
                Manage your assignments, track submissions
                and stay connected with your professors
                through one simple workspace.
              </p>

            </div>

          </div>

          <div className="relative z-10 grid grid-cols-2 gap-3 mt-12">

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <BookOpen className="text-teal-300" size={22} />

              <p className="text-xs text-gray-300 mt-3">
                Assignment tracking
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <Users className="text-pink-300" size={22} />

              <p className="text-xs text-gray-300 mt-3">
                Student management
              </p>
            </div>

          </div>

        </div>

        {/* Right panel */}

        <div className="p-8 md:p-12 flex flex-col justify-center">

          <div className="mb-8">

            <div className="w-12 h-12 rounded-xl bg-[var(--teal-light)] flex items-center justify-center mb-5">
              <ShieldCheck
                size={25}
                className="text-[var(--teal)]"
              />
            </div>

            <h2 className="text-3xl font-bold">
              Welcome back!
            </h2>

            <p className="text-[var(--muted)] text-sm mt-2">
              Select your account to enter your workspace.
            </p>

          </div>

          <label
            htmlFor="user"
            className="text-sm font-semibold mb-2"
          >
            Choose your account
          </label>

          <select
            id="user"
            value={selectedUser}
            onChange={(e) => {
              setSelectedUser(e.target.value);
              setError("");
            }}
            className="w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] outline-none focus:border-[var(--teal)] transition"
          >

            <option value="">
              Select your account
            </option>

            <optgroup label="Administrators">
              {initialUsers
                .filter((user) => user.role === "admin")
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - Admin
                  </option>
                ))}
            </optgroup>

            <optgroup label="Students">
              {initialUsers
                .filter((user) => user.role === "student")
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - Student
                  </option>
                ))}
            </optgroup>

          </select>

          {error && (
            <p
              role="alert"
              className="text-sm text-[var(--pink)] mt-3"
            >
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleLogin}
            className="teal-button w-full rounded-xl p-4 mt-6 font-semibold flex items-center justify-center gap-3"
          >
            Continue to Dashboard

            <ArrowRight size={19} />
          </button>

          <div className="flex items-center gap-2 justify-center mt-8">
            <span className="w-2 h-2 rounded-full bg-[var(--pink)]" />

            <p className="text-xs text-[var(--muted)]">
              Demo login · No password required
            </p>
          </div>

        </div>

      </div>

    </main>
  );
}
