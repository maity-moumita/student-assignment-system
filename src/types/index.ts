export type UserRole = "admin" | "student"; // admin is the internal Professor role
export type User = { id: string; name: string; email: string; role: UserRole };
export type SubmissionType = "individual" | "group";
export type Course = { id: string; name: string; code: string; semester: string; professorId: string; studentIds: string[]; description: string };
export type Assignment = { id: string; title: string; description: string; dueDate: string; driveLink: string; createdBy: string; assignedTo: string[]; createdAt: string; courseId?: string; submissionType?: SubmissionType };
export type SubmissionStatus = "submitted" | "not_submitted";
export type Submission = { id: string; assignmentId: string; studentId: string; status: SubmissionStatus; submittedAt: string | null; acknowledgedBy?: string | null };
export type StudentGroup = { id: string; courseId: string; name: string; leaderId: string; memberIds: string[]; createdAt: string };
