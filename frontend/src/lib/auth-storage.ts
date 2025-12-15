/**
 * Auth Storage Helper
 * Centralized helper untuk manage authentication storage (token + user data)
 * Mencegah konflik antara localStorage manual dan Zustand persist
 */

import type { User } from "@/types";

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_STORAGE_KEY = "auth-storage";

/**
 * Save auth token to localStorage
 */
export const saveAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

/**
 * Get auth token from localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Remove auth token from localStorage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * Check if auth token exists
 */
export const hasAuthToken = (): boolean => {
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Clear all auth data from localStorage
 * This includes both manual token and Zustand persist storage
 */
export const clearAuthStorage = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

/**
 * Check if user is authenticated
 * Returns true only if both token and user data exist
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const authStorage = localStorage.getItem(AUTH_STORAGE_KEY);
  
  if (!token) return false;
  
  try {
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return !!parsed?.state?.user && !!parsed?.state?.isAuthenticated;
    }
  } catch {
    // Invalid JSON, clear storage
    clearAuthStorage();
  }
  
  return false;
};

/**
 * Get stored user data from Zustand persist
 */
export const getStoredUser = (): User | null => {
  try {
    const authStorage = localStorage.getItem(AUTH_STORAGE_KEY);
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return parsed?.state?.user || null;
    }
  } catch {
    return null;
  }
  return null;
};

/**
 * Debug: Print current auth storage state
 */
export const debugAuthStorage = (): void => {
  console.group("🔐 Auth Storage Debug");
  console.log("Token:", getAuthToken() ? "✅ Exists" : "❌ Missing");
  console.log("Token Value:", getAuthToken());
  
  const user = getStoredUser();
  console.log("User Data:", user ? "✅ Exists" : "❌ Missing");
  if (user) {
    console.log("User:", user);
  }
  
  console.log("Is Authenticated:", isAuthenticated() ? "✅ Yes" : "❌ No");
  console.groupEnd();
};

/**
 * Validate auth state consistency
 * Returns true if token and user data are in sync
 */
export const validateAuthState = (): {
  isValid: boolean;
  issues: string[];
} => {
  const issues: string[] = [];
  const token = getAuthToken();
  const user = getStoredUser();
  
  if (!token && user) {
    issues.push("User data exists but token is missing");
  }
  
  if (token && !user) {
    issues.push("Token exists but user data is missing");
  }
  
  if (!token && !user) {
    // Both missing is valid (logged out state)
    return { isValid: true, issues: [] };
  }
  
  if (token && user) {
    // Both exist - check if user has required fields
    if (!user.id) issues.push("User ID is missing");
    if (!user.email) issues.push("User email is missing");
    if (!user.role) issues.push("User role is missing");
  }
  
  return {
    isValid: issues.length === 0,
    issues,
  };
};

/**
 * Fix inconsistent auth state
 * Call this if validation fails
 */
export const fixAuthState = (): void => {
  const { isValid, issues } = validateAuthState();
  
  if (!isValid) {
    console.warn("⚠️ Auth state is inconsistent:", issues);
    console.log("🔧 Clearing all auth data...");
    clearAuthStorage();
  }
};
