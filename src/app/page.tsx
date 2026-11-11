
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  UsersRound,
  ShieldCheck,
  Sparkles,
  Clock3,
  GraduationCap,
} from "lucide-react";

const features = [
  {
    icon: BookOpenCheck,
    title: "Everything in one place",
    description:
      "Access your courses, assignments and submission details from one organized workspace.",
  },
  {
    icon: UsersRound,
    title: "Better group collaboration",
    description:
      "Create teams, join groups and coordinate assignment submissions with your classmates.",
  },
  {
    icon: Clock3,
    title: "Never miss a deadline",
    description:
      "Keep track of upcoming deadlines and monitor your assignment progress.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#14231D] text-[#F5F7F2] overflow-hidden">

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between border-b border-white/10">

        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D7F35C] flex items-center justify-center">
            <GraduationCap className="text-[#14231D]" size={23} />
          </div>

          <span className="text-xl font-extrabold tracking-tight">
            join<span className="text-[#D7F35C]">eazy</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-[#93A5A1]">
          <a href="#features" className="hover:text-[#D7F35C] transition">
            Features
          </a>
          <a href="#about" className="hover:text-[#D7F35C] transition">
            About
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold hover:text-[#D7F35C] transition px-3 py-2"
          >
            Log in
          </Link>

          <Link
            href="/register"
            className="bg-[#D7F35C] text-[#14231D] rounded-full px-5 py-2.5 text-sm font-bold hover:bg-[#e5ff77] transition"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-24 pb-24 lg:pt-32 lg:pb-32">

        <div className="absolute top-20 right-10 w-80 h-80 bg-[#D7F35C]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative grid lg:grid-cols-2 gap-16 items-center">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#93A5A1]/30 bg-[#93A5A1]/10 px-4 py-2 text-xs font-semibold text-[#C4D2C8] mb-8">
              <Sparkles size={14} className="text-[#D7F35C]" />
              A smarter academic workspace
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight">
              Your work.
              <br />
              Your teams.
              <br />
              <span className="text-[#D7F35C]">
                Your progress.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base sm:text-lg leading-8 text-[#AABBB2]">
              Manage assignments, collaborate with classmates
              and stay ahead of every deadline. Everything your
              academic journey needs, in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">

              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#D7F35C] text-[#14231D] px-7 py-4 font-bold hover:bg-[#e5ff77] hover:-translate-y-1 transition-all"
              >
                Get started for free
                <ArrowRight size={19} />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#93A5A1]/40 px-7 py-4 font-semibold text-[#F5F7F2] hover:border-[#D7F35C] hover:text-[#D7F35C] transition"
              >
                Sign in to your account
              </Link>

            </div>

            <div className="flex flex-wrap gap-6 mt-10 text-sm text-[#93A5A1]">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#D7F35C]" />
                Simple to use
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#D7F35C]" />
                Built for collaboration
              </span>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="relative">

            <div className="absolute -inset-5 bg-[#D7F35C]/5 blur-3xl rounded-full" />

            <div className="relative rounded-3xl border border-[#93A5A1]/20 bg-[#1B3027] p-5 sm:p-7 shadow-2xl">

              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-xs text-[#93A5A1]">YOUR WORKSPACE</p>
                  <h3 className="text-xl font-bold mt-2">
                    Good morning!
                  </h3>
                </div>

                <div className="w-11 h-11 rounded-full bg-[#D7F35C] flex items-center justify-center">
                  <GraduationCap className="text-[#14231D]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-[#243C31] rounded-2xl p-4">
                  <p className="text-xs text-[#93A5A1]">Assignments</p>
                  <p className="text-3xl font-bold mt-2">05</p>
                  <p className="text-xs text-[#D7F35C] mt-2">
                    This semester
                  </p>
                </div>

                <div className="bg-[#243C31] rounded-2xl p-4">
                  <p className="text-xs text-[#93A5A1]">Completed</p>
                  <p className="text-3xl font-bold mt-2">03</p>
                  <p className="text-xs text-[#D7F35C] mt-2">
                    Keep it going
                  </p>
                </div>
              </div>

              <div className="bg-[#243C31] rounded-2xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <p className="font-semibold text-sm">
                    Your progress
                  </p>
                  <span className="text-[#D7F35C] font-bold">
                    60%
                  </span>
                </div>

                <div className="h-2 rounded-full bg-[#14231D] overflow-hidden">
                  <div className="h-full w-[60%] rounded-full bg-[#D7F35C]" />
                </div>

                <p className="text-xs text-[#93A5A1] mt-3">
                  3 out of 5 assignments completed
                </p>
              </div>

              <div className="mt-5 space-y-3">
                <p className="text-xs text-[#93A5A1] font-semibold">
                  YOUR NEXT STEPS
                </p>

                {[
                  "Database Management",
                  "Software Engineering",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between bg-[#243C31] rounded-xl p-4"
                  >
                    <span className="text-sm font-medium">
                      {item}
                    </span>
                    <ArrowRight size={17} className="text-[#D7F35C]" />
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="bg-[#192B23] border-y border-white/5 py-24"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="max-w-2xl mb-14">
            <p className="text-sm font-bold tracking-widest text-[#D7F35C]">
              WHY JOINEAZY
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold mt-4">
              Less chaos.
              <span className="text-[#93A5A1]"> More progress.</span>
            </h2>

            <p className="text-[#93A5A1] mt-4 leading-7">
              A connected workspace designed to make academic
              collaboration and assignment management easier.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-[#93A5A1]/15 bg-[#14231D] p-7 hover:border-[#D7F35C]/50 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#D7F35C]/10 flex items-center justify-center mb-6">
                    <Icon size={23} className="text-[#D7F35C]" />
                  </div>

                  <h3 className="text-lg font-bold">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-[#93A5A1] leading-7 mt-3">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About / CTA */}
      <section
        id="about"
        className="max-w-7xl mx-auto px-6 lg:px-10 py-24 text-center"
      >
        <div className="max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#D7F35C] mx-auto flex items-center justify-center">
            <ShieldCheck size={28} className="text-[#14231D]" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold mt-7">
            Make every assignment
            <span className="text-[#D7F35C]"> count.</span>
          </h2>

          <p className="text-[#93A5A1] mt-5 leading-7">
            Start organizing your academic work and collaborating
            with your team.
          </p>

          <Link
            href="/register"
            className="inline-flex items-center gap-3 mt-9 bg-[#D7F35C] text-[#14231D] px-8 py-4 rounded-full font-bold hover:bg-[#e5ff77] transition"
          >
            Create your account
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-bold text-lg">
            join<span className="text-[#D7F35C]">eazy</span>
          </p>

          

          <div className="flex gap-5 text-sm text-[#93A5A1]">
            <Link href="/login" className="hover:text-[#D7F35C]">
              Login
            </Link>
            <Link href="/register" className="hover:text-[#D7F35C]">
              Register
            </Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
