import { publicFetcher, protectedFetcher } from "@/endpoints/fetchers";
import type {
  LoginDto,
  RegisterDto,
  AuthResponse,
  MeResponse,
  LogoutResponse,
} from "@/types/auth";

// REGISTER
export async function registerApi(dto: RegisterDto): Promise<AuthResponse> {
  return publicFetcher<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

// LOGIN
export async function loginApi(dto: LoginDto): Promise<AuthResponse> {
  return publicFetcher<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

// CURRENT USER
export async function meApi(): Promise<MeResponse> {
  return protectedFetcher<MeResponse>("/auth/me", {
    method: "GET",
  });
}

// REFRESH TOKENS
export async function refreshApi(): Promise<AuthResponse> {
  return publicFetcher<AuthResponse>("/auth/refresh", {
    method: "POST",
  });
}

// LOGOUT
export async function logoutApi(): Promise<LogoutResponse> {
  return protectedFetcher<LogoutResponse>("/auth/logout", {
    method: "POST",
  });
}