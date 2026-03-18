const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export const authApi = {
  async register(userData: any) {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || "Error");
    return data;
  },

  async login(username: string, password: string) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || "Error");
    return data;
  },

  getCurrentUser() {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser");
    }
  },
};

export default authApi;
