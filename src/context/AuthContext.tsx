
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { User } from "@/types";
import { initialUsers } from "@/data/Data";

type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  login: (userId: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  // Check saved user when application starts

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("currentUser");

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);

        const validUser = initialUsers.find(
          (user) =>
            user.id === parsedUser.id &&
            user.role === parsedUser.role
        );

        if (validUser) {
          setCurrentUser(validUser);
        } else {
          localStorage.removeItem("currentUser");
        }
      }
    } catch (error) {
      console.error("Unable to restore user:", error);
      localStorage.removeItem("currentUser");
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function

  function login(userId: string) {
    const user = initialUsers.find(
      (item) => item.id === userId
    );

    if (!user) {
      throw new Error("User not found");
    }

    localStorage.setItem(
      "currentUser",
      JSON.stringify(user)
    );

    setCurrentUser(user);
  }

  // Logout function

  function logout() {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
