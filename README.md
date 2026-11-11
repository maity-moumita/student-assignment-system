# Student Assignment System

A responsive academic course and assignment management platform built with **Next.js, React, TypeScript, and Tailwind CSS**.

Joineazy provides dedicated workspaces for professors and students to manage coursework, track assignment progress, coordinate group submissions, and stay updated on academic activities.

---

## Features

### 1. Professor Dashboard

- View dashboard statistics and assignment overviews.
- Create, edit, and delete assignments.
- Assign work to all students or selected students.
- Associate assignments with specific courses.
- Add assignment titles, descriptions, deadlines, and OneDrive links.
- Configure individual or group submission types.
- Monitor submitted and pending assignments.
- Track submission progress and class completion percentages.
- View assignments created by the currently logged-in professor.
- Filter and organize assignment records.

### 2. Student Dashboard

- View enrolled courses and assigned assignments.
- Check assignment descriptions and deadlines.
- Access learning resources through OneDrive links.
- Acknowledge individual submissions through a two-step confirmation flow.
- View submission status and acknowledgement timestamps.
- Track pending and completed assignments.
- Monitor overall assignment completion progress.
- Access course-specific assignment information.

### 3. Group Management

- Create groups for individual courses.
- Join existing groups.
- Automatically assign group leadership to the creator.
- View group members and group leader information.
- Restrict group assignment acknowledgement to the group leader.
- Share group acknowledgement status and timestamps with group members.
- Prevent students without a group from acknowledging group assignments.

### 4. Authentication and Access

- Role-based dashboards for professors and students.
- Demo login using predefined accounts.
- Self-service registration with role selection.
- Simulated JWT-style sessions stored in localStorage.
- Logout and session clearing.
- Role-based navigation and protected application routes.

### 5. Additional Features

- Course-specific professor and student dashboards.
- Persistent demo data using browser localStorage.
- Search, filtering, and sorting capabilities.
- Overdue assignment indicators.
- Assignment progress indicators.
- Loading, empty, and error states.
- Light and dark themes.
- Responsive layouts for desktop, tablet, and mobile devices.

---

## Demo Accounts

Use the following predefined accounts to explore the application.

The demo login uses account selection rather than password authentication.

| Role | Name | Email |
|---|---|---|
| Professor | John Smith | john@gmail.com |
| Professor | Sarah Wilson | sarah@gmail.com |
| Student | Rahul Sharma | rahul@gmail.com |
| Student | Priya Patel | priya@gmail.com |
| Student | Amit Kumar | amit@gmail.com |
| Student | Sneha Roy | sneha@gmail.com |
| Student | Rohit Das | rohit@gmail.com |

---

## Design System

Joineazy follows a modern visual identity inspired by the supplied design reference.

| Design Element | Color / Font | Usage |
|---|---|---|
| Deep Forest | `#14231D` | Navigation and high-emphasis surfaces |
| Soft Sage | `#93A5A1` | Supporting text and secondary elements |
| Electric Lime | `#D7F35C` | Primary actions, active states, and progress |
| Typography | Plus Jakarta Sans | Primary application font |

### Design Principles

- Generous whitespace and clear visual hierarchy.
- Rounded cards and subtle borders.
- Consistent spacing and typography.
- Clear assignment status indicators.
- Accessible contrast and readable text.
- Responsive layouts across screen sizes.
- Consistent light and dark theme experiences.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Application framework and routing |
| React | Component-based UI development |
| TypeScript | Static typing and maintainability |
| Tailwind CSS | Styling and responsive layouts |
| Lucide React | Interface icons |
| React Context API | Global state management |
| localStorage | Client-side data persistence |

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 20 or later recommended
- npm
- Git

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
```

### 2. Navigate to the project directory

```bash
cd student-assignment-system
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the application

Visit:

```text
http://localhost:3000
```

### 6. Create a production build

```bash
npm run build
```

### 7. Run the production application

```bash
npm start
```

---

## Project Structure

```text
student-assignment-system/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── courses/
│   │   │   │   └── [courseId]/
│   │   │   │       └── page.tsx
│   │   │   ├── assignments/
│   │   │   └── page.tsx
│   │   │
│   │   ├── student/
│   │   │   ├── courses/
│   │   │   │   └── [courseId]/
│   │   │   │       └── page.tsx
│   │   │   ├── groups/
│   │   │   └── page.tsx
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx
│   │   │
│   │   ├── register/
│   │   │   └── page.tsx
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── admin/
│   │   ├── common/
│   │   └── student/
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── AssignmentContext.tsx
│   │   ├── GroupContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── data/
│   │   └── Data.ts
│   │
│   ├── hooks/
│   │
│   ├── types/
│   │
│   └── utils/
│
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

*Note: The structure above represents the main application organization. Additional route and component files may exist in the project.*

### Folder Responsibilities

| Folder | Responsibility |
|---|---|
| `app/` | Application routes and page layouts |
| `components/admin/` | Professor dashboard components |
| `components/student/` | Student dashboard components |
| `components/common/` | Shared interface components |
| `context/` | Authentication, assignments, groups, and theme state |
| `data/` | Initial demo users, courses, assignments, and submissions |
| `hooks/` | Reusable React hooks |
| `types/` | TypeScript interfaces and types |
| `utils/` | Reusable utility functions |

---

## Component Architecture

Joineazy follows a modular, component-based architecture. Pages coordinate application layouts and state, while reusable components handle individual interface responsibilities.

### Professor Components

Located in `src/components/admin/`.

- **AdminStats:** Displays dashboard statistics.
- **AssignmentForm:** Handles assignment creation and editing.
- **AssignmentTable:** Displays and manages assignments.
- **StudentStatus:** Displays student submission information.

### Student Components

Located in `src/components/student/`.

- **StudentStats:** Displays student assignment statistics.
- **AssignmentCard:** Displays assignment information and actions.
- **SubmissionDialog:** Handles submission acknowledgement and confirmation.

### Common Components

Located in `src/components/common/`.

- **DashboardLayout:** Provides shared dashboard structure.
- **ThemeToggle:** Switches between light and dark themes.
- Shared navigation and interface elements.

---

## State Management

The application uses React Context API to manage shared state across components.

### AuthContext

- Maintains the currently logged-in user.
- Handles demo login and registration.
- Maintains user role information.
- Handles logout and simulated session state.

### AssignmentContext

- Manages assignments and submissions.
- Handles assignment creation, editing, and deletion.
- Updates student acknowledgement statuses.
- Tracks submission timestamps and progress.
- Synchronizes assignment data with localStorage.

### GroupContext

- Manages course-specific groups.
- Handles group creation and joining.
- Maintains group membership and leadership.
- Supports group acknowledgement workflows.

### ThemeContext

- Manages light and dark theme preferences.
- Updates the document theme.
- Persists the selected theme in localStorage.

---

## Key Design Decisions

### 1. Role-Based Architecture

Separate experiences are provided for professors and students. Users are directed to the appropriate dashboard according to their selected role.

### 2. Context API

React Context API provides centralized access to authentication, assignment, group, and theme state without excessive prop drilling.

### 3. localStorage Persistence

The application uses browser localStorage to retain demo users, assignments, submissions, groups, sessions, and theme preferences across page refreshes.

**Important:** This is a frontend demonstration. localStorage is not a secure database or a replacement for server-side authentication and authorization.

### 4. TypeScript

TypeScript interfaces define application data structures and help catch common development errors.

### 5. Reusable Components

The interface is divided into reusable components to improve readability, maintainability, and consistency.

### 6. Responsive Design

Tailwind CSS utility classes provide layouts that adapt to desktop, tablet, and mobile screen sizes.

### 7. Light and Dark Themes

A centralized theme context controls the application's appearance and persists user preferences.

---

## Submission Workflow

### Individual Assignment

1. The professor creates an individual assignment.
2. Students assigned to the course can view the assignment.
3. A student opens the assignment resource.
4. The student follows the acknowledgement confirmation flow.
5. The application records the student's submission status and timestamp.

### Group Assignment

1. The professor creates a group assignment.
2. Students create or join a course-specific group.
3. The group creator becomes its leader.
4. The group leader acknowledges the assignment.
5. The acknowledgement is shared across the group.

---

## Important Notes and Limitations

- The application uses simulated authentication for demonstration purposes.
- Application data is stored in browser localStorage.
- No production database or server-side authentication is configured in this frontend demonstration.
- localStorage data is browser-specific and can be cleared by the user.
- Production deployment should introduce server-side authentication, authorization, persistent database storage, and appropriate validation.

---

## Future Improvements

- MongoDB integration for persistent data storage.
- Secure server-side authentication and authorization.
- Real-time submission and group status updates.
- Email and deadline notifications.
- File upload and submission history.
- Professor analytics and reporting.
- More advanced course and student management.

---

## License

This project was developed as an academic assignment and demonstration of frontend application development.

---

**Built with Next.js, React, TypeScript, and Tailwind CSS.**
