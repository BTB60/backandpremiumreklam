// Client-side Auth API - uses localStorage for session, API for server operations

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

// Safe localStorage access
const getStorage = () => {
  if (typeof window === "undefined") return null;
  return {
    get: (key: string) => localStorage.getItem(key),
    set: (key: string, value: string) => localStorage.setItem(key, value),
    remove: (key: string) => localStorage.removeItem(key),
  };
};

export const authApi = {
  // Register new user via API
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

    const storage = getStorage();
    if (storage && data.user) {
      storage.set("currentUser", JSON.stringify(data.user));
    }

    return data.user;
  },

  // Login via API
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

    const storage = getStorage();
    if (storage && data.user) {
      storage.set("currentUser", JSON.stringify(data.user));
    }

    return data.user;
  },

  // Get current user from localStorage
  getCurrentUser(): User | null {
    const storage = getStorage();
    if (!storage) return null;
    const stored = storage.get("currentUser");
    return stored ? JSON.parse(stored) : null;
  },

  // Logout
  logout() {
    const storage = getStorage();
    if (storage) {
      storage.remove("currentUser");
    }
  },

  // Get all users via API (for admin)
  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE}/users`);
    const data = await response.json();
    return data.users || [];
  },

  // Get user by ID via API
  async getUserById(id: number): Promise<User | null> {
    const users = await this.getAllUsers();
    return users.find(u => u.id === id) || null;
  },
};

export default authApi;
