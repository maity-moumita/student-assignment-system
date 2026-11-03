
import type {
  User,
  Assignment,
  Submission,
} from "@/types";

// Demo users

export const initialUsers: User[] = [
  {
    id: "admin-1",
    name: "John Smith",
    email: "john@gmail.com",
    role: "admin",
  },
  {
    id: "admin-2",
    name: "Sarah Wilson",
    email: "sarah@gmail.com",
    role: "admin",
  },
  {
    id: "student-1",
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    role: "student",
  },
  {
    id: "student-2",
    name: "Priya Patel",
    email: "priya@gmail.com",
    role: "student",
  },
  {
    id: "student-3",
    name: "Amit Kumar",
    email: "amit@gmail.com",
    role: "student",
  },
  {
    id: "student-4",
    name: "Sneha Roy",
    email: "sneha@gmail.com",
    role: "student",
  },
  {
    id: "student-5",
    name: "Rohit Das",
    email: "rohit@gmail.com",
    role: "student",
  },
];

// Demo assignments

export const initialAssignments: Assignment[] = [
  {
    id: "assignment-1",
    title: "React Fundamentals",
    description:
      "Build a simple React application using components, props and state.",
    dueDate: "2026-11-12",
    driveLink: "https://drive.google.com/",
    createdBy: "admin-1",
    assignedTo: [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
      "student-5",
    ],
    createdAt: "2026-11-01T10:00:00",
  },
  {
    id: "assignment-2",
    title: "JavaScript ES6",
    description:
      "Practice arrow functions, promises, map, filter and destructuring.",
    dueDate: "2026-11-15",
    driveLink: "https://drive.google.com/",
    createdBy: "admin-1",
    assignedTo: [
      "student-1",
      "student-2",
      "student-3",
    ],
    createdAt: "2026-11-02T10:00:00",
  },
  {
    id: "assignment-3",
    title: "HTML and CSS",
    description:
      "Create a responsive webpage using HTML and CSS.",
    dueDate: "2026-11-05",
    driveLink: "https://drive.google.com/",
    createdBy: "admin-2",
    assignedTo: [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
      "student-5",
    ],
    createdAt: "2026-11-01T12:00:00",
  },
  {
    id: "assignment-4",
    title: "Node.js Basics",
    description:
      "Create a basic HTTP server using Node.js.",
    dueDate: "2026-11-20",
    driveLink: "https://drive.google.com/",
    createdBy: "admin-2",
    assignedTo: [
      "student-3",
      "student-4",
      "student-5",
    ],
    createdAt: "2026-11-03T10:00:00",
  },
];

// Demo submission records

export const initialSubmissions: Submission[] = [
  {
    id: "sub-1",
    assignmentId: "assignment-1",
    studentId: "student-1",
    status: "submitted",
    submittedAt: "2026-11-03T10:00:00",
  },
  {
    id: "sub-2",
    assignmentId: "assignment-1",
    studentId: "student-2",
    status: "submitted",
    submittedAt: "2026-11-03T11:00:00",
  },
  {
    id: "sub-3",
    assignmentId: "assignment-1",
    studentId: "student-3",
    status: "not_submitted",
    submittedAt: null,
  },
  {
    id: "sub-4",
    assignmentId: "assignment-1",
    studentId: "student-4",
    status: "submitted",
    submittedAt: "2026-11-03T12:00:00",
  },
  {
    id: "sub-5",
    assignmentId: "assignment-1",
    studentId: "student-5",
    status: "not_submitted",
    submittedAt: null,
  },

  {
    id: "sub-6",
    assignmentId: "assignment-2",
    studentId: "student-1",
    status: "submitted",
    submittedAt: "2026-11-03T13:00:00",
  },
  {
    id: "sub-7",
    assignmentId: "assignment-2",
    studentId: "student-2",
    status: "not_submitted",
    submittedAt: null,
  },
  {
    id: "sub-8",
    assignmentId: "assignment-2",
    studentId: "student-3",
    status: "not_submitted",
    submittedAt: null,
  },

  {
    id: "sub-9",
    assignmentId: "assignment-3",
    studentId: "student-1",
    status: "submitted",
    submittedAt: "2026-11-02T09:00:00",
  },
  {
    id: "sub-10",
    assignmentId: "assignment-3",
    studentId: "student-2",
    status: "not_submitted",
    submittedAt: null,
  },
  {
    id: "sub-11",
    assignmentId: "assignment-3",
    studentId: "student-3",
    status: "submitted",
    submittedAt: "2026-11-03T09:00:00",
  },
  {
    id: "sub-12",
    assignmentId: "assignment-3",
    studentId: "student-4",
    status: "not_submitted",
    submittedAt: null,
  },
  {
    id: "sub-13",
    assignmentId: "assignment-3",
    studentId: "student-5",
    status: "not_submitted",
    submittedAt: null,
  },

  {
    id: "sub-14",
    assignmentId: "assignment-4",
    studentId: "student-3",
    status: "submitted",
    submittedAt: "2026-11-03T15:00:00",
  },
  {
    id: "sub-15",
    assignmentId: "assignment-4",
    studentId: "student-4",
    status: "not_submitted",
    submittedAt: null,
  },
  {
    id: "sub-16",
    assignmentId: "assignment-4",
    studentId: "student-5",
    status: "not_submitted",
    submittedAt: null,
  },
];
