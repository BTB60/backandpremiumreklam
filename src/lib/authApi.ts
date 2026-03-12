// Hybrid Auth System - localStorage + API sync
// This solves the Vercel serverless stateless issue

const USERS_KEY = "premiumreklam_users";
const CURRENT_USER_KEY = "currentUser";

export interface User {
  id: string;
  fullName: string;
  username: string;
  phone: string;
  email: string;
  password: string;
  role: "ADMIN" | "DECORATOR" | "VENDOR";
  level: number;
  totalOrders: number;
  totalSales: number;
  bonusPoints: number;
  referralCode: string;
  createdAt: string;
}

// Get all users from localStorage
function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    // Initialize with default admin
    const defaultUsers: User[] = [
      {
        id: "1",
        fullName: "Admin",
        username: "admin",
        phone: "+994507988177",
        email: "premiumreklam@bk.ru",
        password: "admin123",
        role: "ADMIN",
        level: 100,
        totalOrders: 0,
        totalSales: 0,
        bonusPoints: 0,
        referralCode: "ADMIN001",
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(stored);
}

// Save users to localStorage
function saveUsers(users: User[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const authApi = {
  // Register new user
  async register(userData: {
    fullName: string;
    username: string;
    phone?: string;
    password: string;
  }): Promise<User> {
    const users = getUsers();

    // Check if username exists
    if (users.find(u => u.username === userData.username)) {
      throw new Error("Bu istifadəçi adı artıq mövcuddur");
    }

    // Create new user
    const newUser: User = {
      id: generateId(),
      fullName: userData.fullName,
      username: userData.username,
      phone: userData.phone || "",
      email: "",
      password: userData.password,
      role: "DECORATOR",
      level: 1,
      totalOrders: 0,
      totalSales: 0,
      bonusPoints: 0,
      referralCode: `REF${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  },

  // Login
  async login(username: string, password: string): Promise<User> {
    const users = getUsers();
    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      throw new Error("İstifadəçi adı və ya şifrə yanlışdır");
    }

    // Save to current user
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

    return userWithoutPassword as User;
  },

  // Get current user
  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // Logout
  logout() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Get all users (for admin)
  getAllUsers(): User[] {
    return getUsers().map(({ password, ...user }) => user as User);
  },
};

export default authApi;
