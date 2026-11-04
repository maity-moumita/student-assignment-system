
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { AssignmentProvider } from "@/context/AssignmentContext";
import { ThemeProvider } from "@/context/ThemeContext";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Assignment Hub",
  description: "Student Assignment Management System",
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

      <body className={`${geist.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <AuthProvider>
            <AssignmentProvider>
              {children}
            </AssignmentProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
