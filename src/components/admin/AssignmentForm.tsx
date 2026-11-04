
"use client";

import { useEffect, useState } from "react";

import { X, Save } from "lucide-react";

import type { Assignment, User } from "@/types";

type AssignmentFormProps = {
  open: boolean;
  students: User[];
  editingAssignment: Assignment | null;
  onClose: () => void;
  onSave: (assignment: Assignment) => void;
};

export default function AssignmentForm({
  open,
  students,
  editingAssignment,
  onClose,
  onSave,
}: AssignmentFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [driveLink, setDriveLink] = useState("");

  const [assignAll, setAssignAll] = useState(true);

  const [selectedStudents, setSelectedStudents] =
    useState<string[]>([]);

  const [error, setError] = useState("");

  const [saving, setSaving] = useState(false);

  // Fill form when editing

  useEffect(() => {
    if (!open) return;

    if (editingAssignment) {
      setTitle(editingAssignment.title);
      setDescription(editingAssignment.description);
      setDueDate(editingAssignment.dueDate);
      setDriveLink(editingAssignment.driveLink);

      setAssignAll(
        editingAssignment.assignedTo.length === students.length
      );

      setSelectedStudents(
        editingAssignment.assignedTo
      );
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
      setDriveLink("");
      setAssignAll(true);
      setSelectedStudents([]);
    }

    setError("");
  }, [open, editingAssignment, students]);

  if (!open) return null;

  function toggleStudent(studentId: string) {
    setSelectedStudents((previous) =>
      previous.includes(studentId)
        ? previous.filter((id) => id !== studentId)
        : [...previous, studentId]
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Please enter the title and description.");
      return;
    }

    if (!dueDate || Number.isNaN(new Date(`${dueDate}T00:00:00`).getTime())) {
      setError("Please select a valid due date.");
      return;
    }

    if (!driveLink.trim()) {
      setError("Please enter a Google Drive link.");
      return;
    }

    try {
      const url = new URL(driveLink);

      if (!["http:", "https:"].includes(url.protocol)) {
        setError("Please enter a valid HTTP or HTTPS link.");
        return;
      }
    } catch {
      setError("Please enter a valid Drive URL.");
      return;
    }

    const assignedTo = assignAll
      ? students.map((student) => student.id)
      : selectedStudents;

    if (assignedTo.length === 0) {
      setError("Please select at least one student.");
      return;
    }

    setSaving(true);

    const assignment: Assignment = {
      id: editingAssignment?.id ?? crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      dueDate,
      driveLink: driveLink.trim(),
      createdBy: editingAssignment?.createdBy ?? "",
      assignedTo,
      createdAt:
        editingAssignment?.createdAt ??
        new Date().toISOString(),
    };

    try {
      onSave(assignment);
      onClose();
    } catch {
      setError("Unable to save assignment. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="assignment-form-title"
        className="glass-strong w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 md:p-8"
      >

        {/* Header */}

        <div className="flex items-center justify-between mb-7">

          <div>
            <h2
              id="assignment-form-title"
              className="text-xl font-bold"
            >
              {editingAssignment
                ? "Edit Assignment"
                : "Create Assignment"}
            </h2>

            <p className="text-sm text-[var(--muted)] mt-1">
              Enter assignment information below.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close form"
            className="glass rounded-xl p-2"
          >
            <X size={20} />
          </button>

        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}

          <div>
            <label htmlFor="assignment-title" className="block text-sm font-semibold mb-2">
              Assignment Title *
            </label>

            <input
              id="assignment-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter assignment title"
              className="w-full glass rounded-xl p-3 outline-none focus:border-[var(--teal)]"
              required
            />
          </div>

          {/* Description */}

          <div>
            <label htmlFor="assignment-description" className="block text-sm font-semibold mb-2">
              Description *
            </label>

            <textarea
              id="assignment-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the assignment..."
              rows={4}
              className="w-full glass rounded-xl p-3 outline-none resize-none focus:border-[var(--teal)]"
              required
            />
          </div>

          {/* Due date */}

          <div>
            <label htmlFor="assignment-due-date" className="block text-sm font-semibold mb-2">
              Due Date *
            </label>

            <input
              id="assignment-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full glass rounded-xl p-3 outline-none focus:border-[var(--teal)]"
              required
            />
          </div>

          {/* Drive link */}

          <div>
            <label htmlFor="assignment-drive-link" className="block text-sm font-semibold mb-2">
              Google Drive Link *
            </label>

            <input
              id="assignment-drive-link"
              type="url"
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full glass rounded-xl p-3 outline-none focus:border-[var(--teal)]"
              required
            />
          </div>

          {/* Student selection */}

          <div className="glass rounded-xl p-4">

            <h3 className="font-semibold text-sm mb-4">
              Assign To Students
            </h3>

            <label className="flex items-center gap-3 mb-4 cursor-pointer">

              <input
                type="checkbox"
                checked={assignAll}
                onChange={(e) => setAssignAll(e.target.checked)}
                className="accent-teal-600 w-4 h-4"
              />

              <span className="text-sm font-medium">
                Assign to all students ({students.length})
              </span>

            </label>

            {!assignAll && (
              <div className="border-t border-[var(--border)] pt-4">

                <p className="text-xs text-[var(--muted)] mb-3">
                  Select individual students:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {students.map((student) => (
                    <label
                      key={student.id}
                      className="flex items-center gap-3 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleStudent(student.id)}
                        className="accent-teal-600 w-4 h-4"
                      />

                      {student.name}
                    </label>
                  ))}

                </div>

                <p className="text-xs text-[var(--teal)] mt-4">
                  {selectedStudents.length} students selected
                </p>

              </div>
            )}

          </div>

          {/* Error */}

          {error && (
            <p role="alert" className="text-sm text-[var(--pink)]">
              {error}
            </p>
          )}

          {/* Buttons */}

          <div className="flex flex-col sm:flex-row gap-3 pt-3">

            <button
              type="button"
              onClick={onClose}
              className="glass rounded-xl p-3 flex-1"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="teal-button rounded-xl p-3 flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />

              {saving
                ? "Saving..."
                : editingAssignment
                  ? "Update Assignment"
                  : "Create Assignment"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}
