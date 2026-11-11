
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  UserRound,
  UsersRound,
  CheckCircle2,
  LockKeyhole,
  Sparkles,
  BookOpen,
  ChevronDown,
  Leaf,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

type LoginRole = "student" | "admin";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] =
    useState<LoginRole>("student");

  const [selectedUser, setSelectedUser] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { login, currentUser, loading, users } = useAuth();
  const router = useRouter();

  const availableUsers = users.filter(
    (user) => user.role === selectedRole
  );

  const selectedAccount = users.find(
    (user) => user.id === selectedUser
  );

  useEffect(() => {
    if (loading || !currentUser) return;

    router.replace(
      currentUser.role === "admin" ? "/admin" : "/student"
    );
  }, [currentUser, loading, router]);

  function handleRoleChange(role: LoginRole) {
    setSelectedRole(role);
    setSelectedUser("");
    setError("");
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!selectedUser) {
      setError("Please select your demo account to continue.");
      return;
    }

    const user = users.find(
      (item) => item.id === selectedUser
    );

    if (!user || user.role !== selectedRole) {
      setError("Invalid account. Please select another account.");
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
      <main className="min-h-screen bg-[#14231D] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-[#D7F35C] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[#93A5A1] text-sm mt-5">
            Preparing your workspace...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#14231D] text-[#F5F7F2] flex flex-col lg:flex-row overflow-hidden">

      {/* LEFT PANEL */}

      <section className="relative lg:w-[54%] min-h-[340px] lg:min-h-screen flex flex-col justify-between p-7 sm:p-12 lg:p-16 overflow-hidden">

        {/* Decorative background */}
        <div className="absolute -top-32 -left-32 w-[450px] h-[450px] rounded-full bg-[#D7F35C]/10 blur-[130px] pointer-events-none" />

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#93A5A1]/10 blur-[130px] pointer-events-none" />

        {/* Brand */}
        <Link href="/" className="relative z-10 flex items-center gap-3 w-fit">
          <div className="w-11 h-11 rounded-xl bg-[#D7F35C] flex items-center justify-center shadow-lg shadow-[#D7F35C]/10">
            <GraduationCap size={25} className="text-[#14231D]" />
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight">
              join<span className="text-[#D7F35C]">eazy</span>
            </h1>
            <p className="text-[9px] uppercase tracking-[2.5px] text-[#93A5A1]">
              Academic workspace
            </p>
          </div>
        </Link>

        {/* Hero content */}
        <div className="relative z-10 max-w-xl mt-14 lg:mt-0">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#93A5A1]/30 bg-[#93A5A1]/10 text-xs font-semibold text-[#C2D0C7]">
            <Sparkles size={14} className="text-[#D7F35C]" />
            A better way to stay organized
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold leading-[1.12] tracking-tight mt-8">
            Learning works
            <br />
            better when
            <br />
            <span className="text-[#D7F35C]">
              everything connects.
            </span>
          </h2>

          <p className="text-[#A9B9B0] text-sm sm:text-base leading-8 max-w-md mt-7">
            Your courses, assignments and teams come together
            in one thoughtful workspace. Sign in and make
            every deadline count.
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D7F35C]/10 flex items-center justify-center">
                <BookOpen size={19} className="text-[#D7F35C]" />
              </div>
              <div>
                <p className="text-sm font-semibold">Smart assignments</p>
                <p className="text-xs text-[#93A5A1] mt-1">
                  Stay on top of your work
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D7F35C]/10 flex items-center justify-center">
                <UsersRound size={19} className="text-[#D7F35C]" />
              </div>
              <div>
                <p className="text-sm font-semibold">Team collaboration</p>
                <p className="text-xs text-[#93A5A1] mt-1">
                  Work better together
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom information */}
        <div className="relative z-10 hidden lg:flex items-center justify-between mt-12 pt-7 border-t border-white/10">
          <p className="text-xs text-[#93A5A1]">
            Designed for students and professors.
          </p>

          <div className="flex items-center gap-2 text-xs text-[#D7F35C]">
            <Leaf size={14} />
            Learn. Collaborate. Grow.
          </div>
        </div>

      </section>

      {/* RIGHT PANEL */}

      <section className="flex-1 bg-[#F3F5EF] text-[#14231D] flex items-center justify-center px-5 py-12 sm:px-10 lg:px-12">

        <div className="w-full max-w-[440px]">

          {/* Form heading */}
          <div className="mb-9">

            <div className="w-12 h-12 rounded-2xl bg-[#14231D] flex items-center justify-center mb-6">
              <LockKeyhole size={22} className="text-[#D7F35C]" />
            </div>

            <p className="text-xs font-bold tracking-[2px] text-[#73867D] uppercase">
              Welcome back
            </p>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3">
              Sign in to Joineazy
            </h2>

            <p className="text-sm text-[#77877F] mt-3 leading-6">
              Choose your role and demo account to access your workspace.
            </p>

          </div>

          {/* Login card */}
          <form onSubmit={handleLogin}>

            {/* Role selection */}
            <label className="block text-sm font-bold mb-3">
              Select your workspace
            </label>

            <div className="grid grid-cols-2 gap-3 mb-7">

              <button
                type="button"
                onClick={() => handleRoleChange("student")}
                className={`rounded-2xl p-4 border-2 text-left transition-all duration-200 ${
                  selectedRole === "student"
                    ? "border-[#14231D] bg-[#14231D] text-white shadow-lg shadow-[#14231D]/10"
                    : "border-[#DCE3DB] bg-white text-[#14231D] hover:border-[#93A5A1]"
                }`}
              >
                <GraduationCap
                  size={22}
                  className={
                    selectedRole === "student"
                      ? "text-[#D7F35C]"
                      : "text-[#71857A]"
                  }
                />

                <p className="font-bold text-sm mt-3">
                  Student
                </p>

                <p className={`text-[11px] mt-1 ${
                  selectedRole === "student"
                    ? "text-[#93A5A1]"
                    : "text-[#84918A]"
                }`}>
                  Learning workspace
                </p>

                {selectedRole === "student" && (
                  <CheckCircle2
                    size={17}
                    className="text-[#D7F35C] mt-3"
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange("admin")}
                className={`rounded-2xl p-4 border-2 text-left transition-all duration-200 ${
                  selectedRole === "admin"
                    ? "border-[#14231D] bg-[#14231D] text-white shadow-lg shadow-[#14231D]/10"
                    : "border-[#DCE3DB] bg-white text-[#14231D] hover:border-[#93A5A1]"
                }`}
              >
                <ShieldCheck
                  size={22}
                  className={
                    selectedRole === "admin"
                      ? "text-[#D7F35C]"
                      : "text-[#71857A]"
                  }
                />

                <p className="font-bold text-sm mt-3">
                  Professor
                </p>

                <p className={`text-[11px] mt-1 ${
                  selectedRole === "admin"
                    ? "text-[#93A5A1]"
                    : "text-[#84918A]"
                }`}>
                  Teaching workspace
                </p>

                {selectedRole === "admin" && (
                  <CheckCircle2
                    size={17}
                    className="text-[#D7F35C] mt-3"
                  />
                )}
              </button>

            </div>

            {/* Account selector */}
            <label
              htmlFor="user"
              className="block text-sm font-bold mb-3"
            >
              Choose your demo account
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
    style={{
      backgroundColor: "#E8EEE7",
      color: selectedUser ? "#14231D" : "#536D5D",
    }}
    className="w-full appearance-none rounded-xl border border-[#93A5A1]/50 px-4 py-4 pr-12 text-sm font-semibold outline-none transition-all focus:border-[#14231D] focus:ring-4 focus:ring-[#93A5A1]/20 disabled:opacity-50"
  >
    <option
      value=""
      style={{ backgroundColor: "#E8EEE7", color: "#536D5D" }}
    >
      Choose an account
    </option>

    {availableUsers.map((user) => (
      <option
        key={user.id}
        value={user.id}
        style={{ backgroundColor: "#E8EEE7", color: "#14231D" }}
      >
        {user.name}
      </option>
    ))}
  </select>

  <ChevronDown
    size={18}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#536D5D] pointer-events-none"
  />
</div>

            {/* Account preview */}
            {selectedAccount && (
              <div className="mt-4 p-4 rounded-xl bg-[#] border border-[#] flex items-center gap-3 animate-fade-in">

                <div className="w-11 h-11 rounded-full bg-[#14231D] flex items-center justify-center shrink-0">
                  <UserRound size={20} className="text-[#D7F35C]" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">
                    {selectedAccount.name}
                  </p>

                  <p className="text-xs text-[#71857A] mt-1">
                    {selectedRole === "admin"
                      ? "Professor account"
                      : "Student account"}
                  </p>
                </div>

                <CheckCircle2
                  size={19}
                  className="text-[#456F50]"
                />

              </div>
            )}

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoggingIn || loading}
              className="w-full mt-7 rounded-xl bg-[#14231D] text-[#D7F35C] px-5 py-4 flex items-center justify-center gap-3 text-sm font-bold hover:bg-[#20382D] hover:shadow-lg hover:shadow-[#14231D]/15 transition-all duration-200 active:scale-[0.99] disabled:opacity-60"
            >
              {isLoggingIn
                ? "Opening your workspace..."
                : "Continue to dashboard"}

              {!isLoggingIn && <ArrowRight size={19} />}
            </button>

          </form>

          {/* Register link */}
          <div className="mt-7 text-center">

            <p className="text-sm text-[#77877F]">
              New to Joineazy?{" "}
              <Link
                href="/register"
                className="font-bold text-[#304C3C] hover:text-[#829C32] transition-colors underline underline-offset-4"
              >
                Create an account
              </Link>
            </p>

          </div>

          {/* Demo information */}
          <div className="mt-8 rounded-2xl bg-white border border-[#E1E7DF] p-5">

            <div className="flex items-start gap-3">

              <div className="w-9 h-9 rounded-xl bg-[#EAF0E5] flex items-center justify-center shrink-0">
                <LockKeyhole size={17} className="text-[#536D4B]" />
              </div>

              <div>
                <p className="text-xs font-bold">
                  Demo environment
                </p>

                <p className="text-xs text-[#829087] leading-6 mt-1">
                  Select a seeded account to explore the application.
                  No password is required for this demonstration.
                </p>
              </div>

            </div>

          </div>

          {/* Footer */}
          <footer className="mt-9 text-center">

            <p className="text-[10px] text-[#A0AAA3] mt-2">
              Learn. Collaborate. Grow.
            </p>
          </footer>

        </div>

      </section>

    </main>
  );
}
