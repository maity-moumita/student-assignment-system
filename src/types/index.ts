
export type UserRole = "admin" | "student";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  driveLink: string;
  createdBy: string;
  assignedTo: string[];
  createdAt: string;
};

export type SubmissionStatus =
  | "submitted"
  | "not_submitted";

export type Submission = {
  id: string;
  assignmentId: string;
  studentId: string;
  status: SubmissionStatus;
  submittedAt: string | null;
};
