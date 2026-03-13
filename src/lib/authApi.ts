// Client-side Auth API - uses API routes with Neon PostgreSQL

export interface User {
  id: number;
  full_name: string;
  username: string;
  phone: string;
  email: string;
  role: "ADMIN" | "DECORATOR" | "VENDOR";
  level: number;
  total_orders: number;
  bonus_points: number;
  created_at: string;
}

const API_BASE = "/api";
const CURRENT_USER_KEY = "currentUser";

// Safe localStorage access
const storage = {
  get: (key: string) => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  },
  set: (key: string, value: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
  },
  remove: (key: string) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },
};

export const authApi = {
  // Register new user
  async register(userData: {
    fullName: string;
    username: string;
    phone?: string;
    password: string;
  }): Promise<User> {
    const response = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Qeydiyyat xətası");
    }

    if (data.user) {
      storage.set(CURRENT_USER_KEY, JSON.stringify(data.user));
      return data.user;
    }

    throw new Error("Qeydiyyat xətası");
  },

  // Login
  async login(username: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Giriş xətası");
    }

    if (data.user) {
      storage.set(CURRENT_USER_KEY, JSON.stringify(data.user));
      return data.user;
    }

    throw new Error("Giriş xətası");
  },

  // Get current user
  getCurrentUser(): User | null {
    const stored = storage.get(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // Logout
  logout() {
    storage.remove(CURRENT_USER_KEY);
  },

  // Get all users (for admin)
  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE}/users`);
    const data = await response.json();
    return data.users || [];
  },
};

export default authApi;
