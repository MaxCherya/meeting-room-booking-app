// Basic User returned from backend
export interface User {
    id: number;
    name: string;
    email: string;
}

// Login request payload
export interface LoginDto {
    email: string;
    password: string;
}

// Register request payload
export interface RegisterDto {
    name: string;
    email: string;
    password: string;
}

// Auth response after login/register
export interface AuthResponse {
    user: User;
}

// "me" endpoint
export type MeResponse = User;

// Refresh endpoint (in our simple backend just confirms user/ok)
export interface RefreshResponse {
    ok: boolean;
    user?: User;
}

// Logout endpoint
export interface LogoutResponse {
    ok: boolean;
}  