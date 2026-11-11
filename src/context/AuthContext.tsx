"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User, UserRole } from "@/types";
import { initialUsers } from "@/data/Data";

type AuthContextType = {
  currentUser: User | null; users: User[]; loading: boolean;
  login: (userId: string) => void;
  register: (name: string, email: string, role: UserRole) => User;
  logout: () => void;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const TOKEN_KEY = "joineazy_session";
const USERS_KEY = "joineazy_users";
export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem(USERS_KEY);
      const allUsers: User[] = savedUsers ? JSON.parse(savedUsers) : initialUsers;
      setUsers(allUsers);
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const user = allUsers.find((item) => item.id === payload.sub);
        if (user && payload.exp > Date.now()) setCurrentUser(user);
        else { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem("currentUser"); }
      } else {
        // Migrate Task 1 demo sessions once, then use token sessions.
        const legacy = localStorage.getItem("currentUser");
        if (legacy) {
          const parsed = JSON.parse(legacy);
          const user = allUsers.find((item) => item.id === parsed.id);
          if (user) { setCurrentUser(user); writeToken(user); }
        }
      }
    } catch (error) { console.error("Unable to restore session", error); localStorage.removeItem(TOKEN_KEY); }
    finally { setLoading(false); }
  }, []);
  function writeToken(user: User) {
    const encode = (value: object) => btoa(JSON.stringify(value));
    const header = encode({ alg: "none", typ: "JWT" });
    const payload = encode({ sub: user.id, role: user.role, exp: Date.now() + 7 * 86400000 });
    localStorage.setItem(TOKEN_KEY, `${header}.${payload}.demo-signature`);
    localStorage.setItem("currentUser", JSON.stringify(user));
  }
  function login(userId: string) {
    const user = users.find((item) => item.id === userId);
    if (!user) throw new Error("Account not found. Please choose a valid demo account.");
    writeToken(user); setCurrentUser(user);
  }
  function register(name: string, email: string, role: UserRole) {
    if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) throw new Error("An account with this email already exists.");
    const user: User = { id: `user-${crypto.randomUUID()}`, name: name.trim(), email: email.trim().toLowerCase(), role };
    const updated = [...users, user]; setUsers(updated); localStorage.setItem(USERS_KEY, JSON.stringify(updated)); writeToken(user); setCurrentUser(user); return user;
  }
  function logout() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem("currentUser"); setCurrentUser(null); }
  return <AuthContext.Provider value={{ currentUser, users, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used inside AuthProvider"); return context; }
