"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useCallback, useState } from "react";
import type { User, LoginCredentials, RegisterCredentials } from "@/types";

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

function clerkUserToDomain(clerkUser: ReturnType<typeof useUser>["user"]): User | null {
  if (!clerkUser) return null;
  return {
    id:         clerkUser.id,
    name:       clerkUser.fullName ?? clerkUser.firstName ?? "Usuario",
    email:      clerkUser.primaryEmailAddress?.emailAddress ?? "",
    avatarUrl:  clerkUser.imageUrl ?? undefined,
    createdAt:  new Date(clerkUser.createdAt ?? Date.now()),
  };
}

export function useAuth(): UseAuthReturn {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut }                   = useClerk();
  const [error, setError]             = useState<string | null>(null);

  const login = useCallback(async (_credentials: LoginCredentials): Promise<boolean> => {
    return true;
  }, []);

  const register = useCallback(async (_credentials: RegisterCredentials): Promise<boolean> => {
    return true;
  }, []);

  const logout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const clearError = useCallback(() => setError(null), []);

  return {
    user:      clerkUserToDomain(clerkUser),
    isLoading: !isLoaded,
    error,
    login,
    register,
    logout,
    clearError,
  };
}
