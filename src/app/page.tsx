import { BookOpen, Users, CheckCircle } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen p-6 md:p-10">

      {/* Header */}

      <header className="flex items-center justify-between mb-10">

        <div>
          <h1 className="text-2xl font-bold">
            Assignment Hub
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Student Assignment Management System
          </p>
        </div>

        <div className="glass rounded-full px-4 py-2 text-sm">
          Project Preview
        </div>

      </header>

      {/* Welcome section */}

      <section className="mb-10">

        <p className="text-sm text-gray-500">
          WELCOME TO YOUR WORKSPACE
        </p>

        <h2 className="text-3xl md:text-4xl font-bold mt-2">
          Manage everything
          <br />
          in one place.
        </h2>

      </section>

      {/* Statistics */}

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">

        <div className="glass glass-hover rounded-2xl p-6">

          <BookOpen size={24} />

          <h3 className="text-3xl font-bold mt-5">
            04
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Total Assignments
          </p>

        </div>

        <div className="glass glass-hover rounded-2xl p-6">

          <Users size={24} />

          <h3 className="text-3xl font-bold mt-5">
            07
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Total Users
          </p>

        </div>

        <div className="glass glass-hover rounded-2xl p-6">

          <CheckCircle size={24} />

          <h3 className="text-3xl font-bold mt-5">
            16
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Submission Records
          </p>

        </div>

      </section>

      {/* Glass preview */}

      <section className="glass rounded-2xl p-8 mt-8">

        <h3 className="text-xl font-semibold">
          Your workspace is ready.
        </h3>

        <p className="text-gray-500 mt-2">
          We will build the student and professor
          dashboards here.
        </p>

      </section>

    </main>
  );
}