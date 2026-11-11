
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { AssignmentProvider } from "@/context/AssignmentContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { GroupProvider } from "@/context/GroupContext";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Student Assignment System",
  description: "A workspace for courses, assignments and collaborative learning.",
};

const themeScript = `
  (function () {
    try {
      const savedTheme = localStorage.getItem("theme");
      const theme = savedTheme === "dark" ? "dark" : "light";

      document.documentElement.classList.toggle(
        "dark",
        theme === "dark"
      );

      document.documentElement.style.colorScheme = theme;
    } catch (error) {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>

      <body className={jakarta.variable}>
        <ThemeProvider>
          <AuthProvider>
            <AssignmentProvider>
              <GroupProvider>{children}</GroupProvider>
            </AssignmentProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
