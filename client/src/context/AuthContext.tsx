import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { User } from "../types";

type AuthContextValue = {
  user: User;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const PUBLIC_USER: User = {
  id: "public",
  name: "Public Studio",
  email: "open-access@fontsmith.local",
  plan: "Open"
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useMemo<AuthContextValue>(
    () => ({
      user: PUBLIC_USER
    }),
    []
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
