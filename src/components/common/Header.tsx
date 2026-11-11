
"use client";

import { useState } from "react";

import {
  Menu,
  LogOut,
  UserCircle,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

import ThemeToggle from "./ThemeToggle";

type HeaderProps = {
  title: string;
  setOpen: (open: boolean) => void;
};

export default function Header({
  title,
  setOpen,
}: HeaderProps) {
  const { currentUser, logout } = useAuth();

  const [showProfile, setShowProfile] = useState(false);

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  return (
    <header className="glass rounded-2xl px-4 md:px-6 py-4 flex items-center justify-between gap-3">

      {/* Left side */}

      <div className="flex items-center gap-3">

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="md:hidden p-2 rounded-lg hover:bg-[var(--teal-light)]"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-lg md:text-xl font-bold">
            {title}
          </h1>

          <p className="text-xs text-[var(--muted)] hidden sm:block">
            Welcome to your workspace
          </p>
        </div>

      </div>

      {/* Right side */}

      <div className="flex items-center gap-3">

        <ThemeToggle />

        <div className="relative">

          <button
            type="button"
            onClick={() => setShowProfile(!showProfile)}
            aria-label="Toggle profile menu"
            aria-expanded={showProfile}
            className="flex items-center gap-2 glass rounded-xl p-2"
          >

            <div className="w-9 h-9 rounded-lg bg-[var(--accent-light)] flex items-center justify-center">
              <UserCircle
                size={21}
                className="text-[#53675C]"
              />
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold">
                {currentUser?.name}
              </p>

              <p className="text-xs text-[var(--muted)] capitalize">
                {currentUser?.role === "admin" ? "Professor" : "Student"}
              </p>
            </div>

            <ChevronDown
              size={15}
              className="hidden sm:block"
            />

          </button>

          {showProfile && (
            <>
              <button
                type="button"
                aria-label="Close profile menu"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setShowProfile(false)}
              />

              <div className="absolute right-0 top-14 z-50 glass-strong rounded-xl p-2 w-48 shadow-xl">

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full p-3 rounded-lg text-sm hover:bg-[var(--accent-light)] hover:text-[#53675C]"
                >
                  <LogOut size={18} />
                  Logout
                </button>

              </div>
            </>
          )}

        </div>

      </div>

    </header>
  );
}
