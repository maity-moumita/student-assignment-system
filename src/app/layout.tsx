import type { Metadata } from "next";

import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { AssignmentProvider } from "@/context/AssignmentContext";

export const metadata: Metadata = {
  title: "Assignment Hub",
  description: "Student Assignment System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AssignmentProvider>
            {children}
          </AssignmentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}