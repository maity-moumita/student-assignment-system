# Student Assignment System

A responsive web-based assignment management dashboard built with Next.js, React, TypeScript, and Tailwind CSS. The platform provides separate workspaces for administrators/professors and students to manage assignments, track submissions, and monitor academic progress.

## Features

### Admin / Professor Dashboard
- View assignment statistics and dashboard overview.
- Create, edit, and delete assignments.
- Assign assignments to all students or selected students.
- Add assignment descriptions, due dates, and Google Drive links.
- Track individual student submission statuses.
- Monitor class completion percentages.
- View assignments created by the logged-in administrator.

### Student Dashboard
- View assigned assignments.
- Check assignment descriptions and deadlines.
- Access assignment resources through Google Drive links.
- Submit assignments through a confirmation flow.
- Track submitted and pending assignments.
- View overall assignment completion progress.

### Additional Features
- Role-based dashboards for administrators and students.
- Demo login using predefined accounts.
- Persistent data using browser localStorage.
- Search, filtering, and sorting capabilities.
- Overdue assignment indicators.
- Light and dark themes.
- Responsive design for desktop, tablet, and mobile.
- Loading, empty, and error states.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | React framework and routing |
| React | UI development |
| TypeScript | Type safety |
| Tailwind CSS | Styling and responsive design |
| Lucide React | Icons |
| React Context API | Global state management |
| localStorage | Client-side data persistence |

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (20 or later recommended)
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

To run the production build locally:

```bash
npm start
```

---

## Project Folder Structure

```text
student-assignment-system/
│
├── public/
│
├── src/
│   │
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx
│   │   │
│   │   ├── student/
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
│   │   └── ThemeContext.tsx
│   │
│   ├── data/
│   │   └── Data.ts
│   │
│   ├── hooks/
│   │
│   ├── types/
│   │
│   ├── utils/
│   │
│   └── ...
│
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

### Folder Responsibilities

| Folder | Responsibility |
|---|---|
| `app/` | Application routes and page layouts |
| `components/admin/` | Admin-specific UI components |
| `components/student/` | Student-specific UI components |
| `components/common/` | Shared components such as theme toggle |
| `context/` | Authentication, assignment, and theme state |
| `data/` | Initial demo users, assignments, and submissions |
| `hooks/` | Reusable React hooks |
| `types/` | TypeScript interfaces and types |
| `utils/` | Reusable helper functions |

---

## Component Architecture

The application follows a modular component-based architecture. Pages handle the overall layout and connect the required components, while individual components handle specific UI responsibilities.

### Admin Components

Located in `src/components/admin/`.

- **AdminStats:** Displays dashboard statistics.
- **AssignmentForm:** Handles assignment creation and editing.
- **AssignmentTable:** Displays and manages assignments.
- **StudentStatus:** Displays individual student submission statuses.

### Student Components

Located in `src/components/student/`.

- **StudentStats:** Displays assignment statistics.
- **AssignmentCard:** Displays assignment information and actions.
- **SubmissionDialog:** Handles assignment submission confirmation.

### Common Components

Located in `src/components/common/`.

- **ThemeToggle:** Switches between light and dark themes.
- Shared UI elements used across the application.

### State Management

The application uses React Context API to share state across components.

**AuthContext**
- Maintains the currently logged-in user.
- Handles demo login and authentication state.
- Provides role information to the application.

**AssignmentContext**
- Manages assignments and submissions.
- Handles assignment creation, editing, and deletion.
- Updates student submission statuses.
- Synchronizes application data with localStorage.

**ThemeContext**
- Manages light and dark theme preferences.
- Updates the document theme.
- Persists the selected theme in localStorage.

---


## Key Design Decisions

### 1. Role-Based Architecture

Separate admin and student experiences are provided based on the logged-in user's role. Each role has access to its relevant dashboard and functionality.

### 2. Context API for State Management

React Context API is used to share authentication, assignment, submission, and theme states without passing props through multiple component levels.

### 3. localStorage for Persistence

The project uses browser localStorage to retain demo users' application data, assignments, submissions, and theme preferences across page refreshes.

**Note:** This is a frontend demonstration. localStorage is not a secure database or a replacement for server-side authentication and authorization.

### 4. TypeScript

TypeScript provides explicit data types for users, assignments, and submissions, helping reduce common development errors and improve maintainability.

### 5. Reusable Components

The UI is divided into smaller reusable components to keep the code organized, readable, and easier to maintain.

### 6. Responsive Design

Tailwind CSS utility classes are used to create layouts that adapt to different screen sizes.

### 7. Light and Dark Themes

A centralized theme context controls the application's color scheme. Theme preferences are saved in localStorage to maintain the selected appearance.

---
