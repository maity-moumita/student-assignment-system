
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type {
  Assignment,
  Submission,
} from "@/types";

import {
  initialAssignments,
  initialSubmissions,
} from "@/data/Data";

// Context type

type AssignmentContextType = {
  assignments: Assignment[];
  submissions: Submission[];
  loading: boolean;
  error: string | null;

  createAssignment: (assignment: Assignment) => void;

  updateAssignment: (
    assignmentId: string,
    updatedData: Assignment
  ) => void;

  deleteAssignment: (assignmentId: string) => void;

  submitAssignment: (
    assignmentId: string,
    studentId: string
  ) => void;

  clearError: () => void;
};

// Create context

const AssignmentContext =
  createContext<AssignmentContextType | undefined>(
    undefined
  );

// Generate unique ID

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Validate assignment data

function isValidAssignment(item: unknown): item is Assignment {
  if (!item || typeof item !== "object") return false;

  const assignment = item as Assignment;

  return (
    typeof assignment.id === "string" &&
    typeof assignment.title === "string" &&
    typeof assignment.description === "string" &&
    typeof assignment.dueDate === "string" &&
    typeof assignment.driveLink === "string" &&
    typeof assignment.createdBy === "string" &&
    Array.isArray(assignment.assignedTo) &&
    typeof assignment.createdAt === "string"
  );
}

// Validate submission data

function isValidSubmission(item: unknown): item is Submission {
  if (!item || typeof item !== "object") return false;

  const submission = item as Submission;

  return (
    typeof submission.id === "string" &&
    typeof submission.assignmentId === "string" &&
    typeof submission.studentId === "string" &&
    (submission.status === "submitted" ||
      submission.status === "not_submitted") &&
    (submission.submittedAt === null ||
      typeof submission.submittedAt === "string")
  );
}

// Remove duplicate records

function normalizeAssignments(
  data: Assignment[]
): Assignment[] {
  const unique = new Map<string, Assignment>();

  data.forEach((assignment) => {
    unique.set(assignment.id, {
      ...assignment,
      assignedTo: [...new Set(assignment.assignedTo)],
    });
  });

  return Array.from(unique.values());
}

function normalizeSubmissions(
  data: Submission[],
  validAssignments: Assignment[]
): Submission[] {
  const unique = new Map<string, Submission>();

  data.forEach((submission) => {
    const assignment = validAssignments.find(
      (item) => item.id === submission.assignmentId
    );

    // Ignore records for deleted or unassigned students

    if (
      !assignment ||
      !assignment.assignedTo.includes(submission.studentId)
    ) {
      return;
    }

    const key = `${submission.assignmentId}_${submission.studentId}`;

    const existing = unique.get(key);

    // Prefer submitted records if duplicates exist

    if (
      !existing ||
      submission.status === "submitted"
    ) {
      unique.set(key, submission);
    }
  });

  return Array.from(unique.values());
}

// Provider

export function AssignmentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  // Load data from localStorage

  useEffect(() => {
    try {
      const savedAssignments =
        localStorage.getItem("assignments");

      const savedSubmissions =
        localStorage.getItem("submissions");

      let loadedAssignments: Assignment[];
      let loadedSubmissions: Submission[];

      // Load assignments

      if (savedAssignments !== null) {
        try {
          const parsed = JSON.parse(savedAssignments);

          if (!Array.isArray(parsed)) {
            throw new Error("Invalid assignments format");
          }

          loadedAssignments = parsed.filter(
            isValidAssignment
          );
        } catch {
          loadedAssignments = [...initialAssignments];

          setError(
            "Saved assignments were invalid. Demo assignments have been restored."
          );
        }
      } else {
        loadedAssignments = [...initialAssignments];
      }

      // Load submissions

      if (savedSubmissions !== null) {
        try {
          const parsed = JSON.parse(savedSubmissions);

          if (!Array.isArray(parsed)) {
            throw new Error("Invalid submissions format");
          }

          loadedSubmissions = parsed.filter(
            isValidSubmission
          );
        } catch {
          loadedSubmissions = [...initialSubmissions];

          setError(
            "Saved submission data was invalid. Default data has been restored."
          );
        }
      } else {
        loadedSubmissions = [...initialSubmissions];
      }

      const cleanAssignments =
        normalizeAssignments(loadedAssignments);

      const cleanSubmissions =
        normalizeSubmissions(
          loadedSubmissions,
          cleanAssignments
        );

      setAssignments(cleanAssignments);
      setSubmissions(cleanSubmissions);

    } catch (err) {
      console.error("Storage loading error:", err);

      setAssignments(
        normalizeAssignments([...initialAssignments])
      );

      setSubmissions(
        normalizeSubmissions(
          [...initialSubmissions],
          initialAssignments
        )
      );

      setError("Unable to load saved data. Default data was restored.");

    } finally {
      setLoading(false);
    }
  }, []);

  // Save assignments

  useEffect(() => {
    if (loading) return;

    try {
      localStorage.setItem(
        "assignments",
        JSON.stringify(assignments)
      );
    } catch (err) {
      console.error("Assignment saving error:", err);

      setError(
        "Unable to save assignments. Check your browser storage."
      );
    }
  }, [assignments, loading]);

  // Save submissions

  useEffect(() => {
    if (loading) return;

    try {
      localStorage.setItem(
        "submissions",
        JSON.stringify(submissions)
      );
    } catch (err) {
      console.error("Submission saving error:", err);

      setError(
        "Unable to save submissions. Check your browser storage."
      );
    }
  }, [submissions, loading]);

  // Clear errors

  function clearError() {
    setError(null);
  }

  // CREATE ASSIGNMENT

  function createAssignment(assignment: Assignment) {
    const existing = assignments.some(
      (item) => item.id === assignment.id
    );

    if (existing) {
      setError("An assignment with this ID already exists.");
      return;
    }

    const cleanAssignment: Assignment = {
      ...assignment,
      assignedTo: [...new Set(assignment.assignedTo)],
    };

    const newSubmissions: Submission[] =
      cleanAssignment.assignedTo.map((studentId) => ({
        id: generateId(),
        assignmentId: cleanAssignment.id,
        studentId,
        status: "not_submitted",
        submittedAt: null,
      }));

    setAssignments((previous) => [
      cleanAssignment,
      ...previous,
    ]);

    setSubmissions((previous) => [
      ...previous,
      ...newSubmissions,
    ]);

    setError(null);
  }

  // UPDATE ASSIGNMENT

  function updateAssignment(
    assignmentId: string,
    updatedData: Assignment
  ) {
    const exists = assignments.some(
      (item) => item.id === assignmentId
    );

    if (!exists) {
      setError("Assignment not found.");
      return;
    }

    if (updatedData.id !== assignmentId) {
      setError("Assignment ID cannot be changed.");
      return;
    }

    const cleanAssignment: Assignment = {
      ...updatedData,
      assignedTo: [...new Set(updatedData.assignedTo)],
    };

    // Update assignment

    setAssignments((previous) =>
      previous.map((assignment) =>
        assignment.id === assignmentId
          ? cleanAssignment
          : assignment
      )
    );

    // Preserve existing submissions

    setSubmissions((previous) => {
      const existingSubmissions = previous.filter(
        (item) => item.assignmentId === assignmentId
      );

      const otherSubmissions = previous.filter(
        (item) => item.assignmentId !== assignmentId
      );

      const updatedSubmissions =
        cleanAssignment.assignedTo.map((studentId) => {
          const existing = existingSubmissions.find(
            (item) => item.studentId === studentId
          );

          // Preserve previous submission status

          if (existing) {
            return existing;
          }

          // Add new pending submission

          return {
            id: generateId(),
            assignmentId,
            studentId,
            status: "not_submitted" as const,
            submittedAt: null,
          };
        });

      return [
        ...otherSubmissions,
        ...updatedSubmissions,
      ];
    });

    setError(null);
  }

  // DELETE ASSIGNMENT

  function deleteAssignment(assignmentId: string) {
    const exists = assignments.some(
      (item) => item.id === assignmentId
    );

    if (!exists) {
      setError("Assignment not found.");
      return;
    }

    // Delete assignment

    setAssignments((previous) =>
      previous.filter(
        (item) => item.id !== assignmentId
      )
    );

    // Delete related submissions

    setSubmissions((previous) =>
      previous.filter(
        (item) => item.assignmentId !== assignmentId
      )
    );

    setError(null);
  }

  // SUBMIT ASSIGNMENT

  function submitAssignment(
    assignmentId: string,
    studentId: string
  ) {
    const assignment = assignments.find(
      (item) =>
        item.id === assignmentId &&
        item.assignedTo.includes(studentId)
    );

    if (!assignment) {
      throw new Error(
        "Assignment not found or not assigned to this student."
      );
    }

    const existing = submissions.find(
      (item) =>
        item.assignmentId === assignmentId &&
        item.studentId === studentId
    );

    // Prevent duplicate submission

    if (existing?.status === "submitted") {
      return;
    }

    const submittedAt = new Date().toISOString();

    setSubmissions((previous) => {
      const alreadyExists = previous.find(
        (item) =>
          item.assignmentId === assignmentId &&
          item.studentId === studentId
      );

      if (alreadyExists) {
        return previous.map((item) =>
          item.assignmentId === assignmentId &&
          item.studentId === studentId
            ? {
                ...item,
                status: "submitted",
                submittedAt,
              }
            : item
        );
      }

      return [
        ...previous,
        {
          id: generateId(),
          assignmentId,
          studentId,
          status: "submitted",
          submittedAt,
        },
      ];
    });

    setError(null);
  }

  return (
    <AssignmentContext.Provider
      value={{
        assignments,
        submissions,
        loading,
        error,
        createAssignment,
        updateAssignment,
        deleteAssignment,
        submitAssignment,
        clearError,
      }}
    >
      {children}
    </AssignmentContext.Provider>
  );
}

// Custom hook

export function useAssignments() {
  const context = useContext(AssignmentContext);

  if (!context) {
    throw new Error(
      "useAssignments must be used inside AssignmentProvider"
    );
  }

  return context;
}
