import apiClient from "./api";
import type { User } from "@/types";
import { clearAuthStorage } from "@/lib/auth-storage";

// Login request - backend only needs email and password
export interface LoginRequest {
  email: string;
  password: string;
}

// Register request
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: "tourist" | "agent";
}

// Login response - backend returns token
export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

// Register response - backend does NOT return token
export interface RegisterResponse {
  message: string;
  user: User;
}

// Login user
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/api/auth/login", data);
  return response.data;
};

// Register user - returns user but NO token
export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>("/api/auth/register", data);
  return response.data;
};

// Logout user - clear all auth data from localStorage
export const logout = (): void => {
  clearAuthStorage();
};

// Get current user profile
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>("/api/auth/me");
  return response.data;
};

// Update profile request
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

// Update profile response
export interface UpdateProfileResponse {
  message: string;
  user: User;
}

// Update user profile
export const updateProfile = async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
  const response = await apiClient.put<UpdateProfileResponse>("/api/auth/profile", data);
  return response.data;
};

// Change password request
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Change password response
export interface ChangePasswordResponse {
  message: string;
}

// Change password
export const changePassword = async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
  const response = await apiClient.post<ChangePasswordResponse>("/api/auth/change-password", data);
  return response.data;
};
