"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  loginApi,
  registerApi,
  meApi,
  logoutApi,
} from "./auth";
import type { LoginDto, RegisterDto, AuthResponse, MeResponse } from "@/types/auth";

export const AUTH_KEYS = {
  me: ["auth", "me"] as const,
};

// Query: current user
export function useMeQuery() {
  return useQuery<MeResponse>({
    queryKey: AUTH_KEYS.me,
    queryFn: meApi,
    retry: false,
  });
}

// Mutation: login
export function useLoginMutation() {
  const qc = useQueryClient();

  return useMutation<AuthResponse, Error, LoginDto>({
    mutationFn: loginApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AUTH_KEYS.me });
    },
  });
}

// Mutation: register
export function useRegisterMutation() {
  const qc = useQueryClient();

  return useMutation<AuthResponse, Error, RegisterDto>({
    mutationFn: registerApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AUTH_KEYS.me });
    },
  });
}

// Mutation: logout
export function useLogoutMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      qc.removeQueries({ queryKey: AUTH_KEYS.me });
    },
  });
}