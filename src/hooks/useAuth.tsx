import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import * as auth from "@/lib/auth";
import type { AuthUser, SignInInput, SignUpInput, UserProfile } from "@/lib/auth";

interface AuthContextValue {
  user: AuthUser | null;
  profile: UserProfile | null;
  ready: boolean;
  isAuthenticated: boolean;
  signUp: (input: SignUpInput) => Promise<AuthUser>;
  signIn: (input: SignInInput) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  saveProfile: (profile: UserProfile) => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = auth.getSession();
    setUser(session?.user ?? null);
    setProfile(session?.profile ?? null);
    setReady(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      ready,
      isAuthenticated: !!user,
      signUp: async (input) => {
        const next = await auth.signUp(input);
        setUser(next);
        setProfile(null);
        return next;
      },
      signIn: async (input) => {
        const next = await auth.signIn(input);
        setUser(next);
        setProfile(auth.getSession()?.profile ?? null);
        return next;
      },
      signOut: async () => {
        await auth.signOut();
        setUser(null);
        setProfile(null);
      },
      saveProfile: async (nextProfile) => {
        if (!user) throw new auth.AuthError("You need to be signed in.");
        const saved = await auth.saveProfile(user.id, nextProfile);
        setProfile(saved);
        return saved;
      },
    }),
    [user, profile, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/** Convenience helper for greetings and personalisation. */
export function useFirstName() {
  const { user } = useAuth();
  return useCallback(() => auth.firstName(user), [user])();
}
