
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Assignment, Submission } from "@/types";

import {
  initialAssignments,
  initialSubmissions,
} from "@/data/Data";

type AssignmentContextType = {
  assignments: Assignment[];
  submissions: Submission[];
  loading: boolean;

  submitAssignment: (
    assignmentId: string,
    studentId: string
  ) => void;
};

const AssignmentContext =
  createContext<AssignmentContextType | undefined>(undefined);

export function AssignmentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [assignments, setAssignments] = useState<Assignment[]>(
    []
  );

  const [submissions, setSubmissions] = useState<Submission[]>(
    []
  );

  const [loading, setLoading] = useState(true);

  // Load saved data

  useEffect(() => {
    try {
      const savedAssignments = localStorage.getItem("assignments");

      const savedSubmissions = localStorage.getItem("submissions");

      setAssignments(
        savedAssignments
          ? JSON.parse(savedAssignments)
          : initialAssignments
      );

      setSubmissions(
        savedSubmissions
          ? JSON.parse(savedSubmissions)
          : initialSubmissions
      );
    } catch (error) {
      console.error("Unable to load assignment data:", error);

      setAssignments(initialAssignments);
      setSubmissions(initialSubmissions);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save assignments

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(
        "assignments",
        JSON.stringify(assignments)
      );
    }
  }, [assignments, loading]);

  // Save submissions

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(
        "submissions",
        JSON.stringify(submissions)
      );
    }
  }, [submissions, loading]);

  // Submit assignment

  function submitAssignment(
    assignmentId: string,
    studentId: string
  ) {
    const assignmentExists = assignments.some(
      (assignment) =>
        assignment.id === assignmentId &&
        assignment.assignedTo.includes(studentId)
    );

    if (!assignmentExists) {
      throw new Error("Assignment not found or not assigned to you.");
    }

    setSubmissions((previous) => {
      const existingSubmission = previous.find(
        (item) =>
          item.assignmentId === assignmentId &&
          item.studentId === studentId
      );

      if (existingSubmission?.status === "submitted") {
        return previous;
      }

      if (existingSubmission) {
        return previous.map((item) =>
          item.id === existingSubmission.id
            ? {
                ...item,
                status: "submitted",
                submittedAt: new Date().toISOString(),
              }
            : item
        );
      }

      return [
        ...previous,
        {
          id: crypto.randomUUID(),
          assignmentId,
          studentId,
          status: "submitted",
          submittedAt: new Date().toISOString(),
        },
      ];
    });
  }

  return (
    <AssignmentContext.Provider
      value={{
        assignments,
        submissions,
        loading,
        submitAssignment,
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
