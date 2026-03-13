// Client-side Auth API - uses localStorage only (serverless stateless fix)

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

const USERS_KEY = "premiumreklam_users";
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

// Get users from localStorage
function getLocalUsers(): any[] {
  const stored = storage.get(USERS_KEY);
  if (!stored) {
    // Initialize with default admin
    const defaultUsers = [
      {
        id: 1,
        full_name: "Admin",
        username: "admin",
        phone: "+994507988177",
        email: "premiumreklam@bk.ru",
        password_hash: "admin123",
        role: "ADMIN",
        level: 100,
        total_orders: 0,
        bonus_points: 0,
        created_at: new Date().toISOString(),
      },
    ];
    storage.set(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(stored);
}

// Save users to localStorage
function saveLocalUsers(users: any[]) {
  storage.set(USERS_KEY, JSON.stringify(users));
}

export const authApi = {
  // Register new user
  async register(userData: {
    fullName: string;
    username: string;
    phone?: string;
    password: string;
  }): Promise<User> {
    const users = getLocalUsers();
    
    // Check if username exists
    if (users.find((u: any) => u.username === userData.username)) {
      throw new Error("Bu istifadəçi adı artıq mövcuddur");
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      full_name: userData.fullName,
      username: userData.username,
      phone: userData.phone || "",
      email: "",
      password_hash: userData.password,
      role: "DECORATOR",
      level: 1,
      total_orders: 0,
      bonus_points: 0,
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    saveLocalUsers(users);

    // Save current user
    const { password_hash, ...userWithoutPassword } = newUser;
    storage.set(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword as User;
  },

  // Login
  async login(username: string, password: string): Promise<User> {
    const users = getLocalUsers();
    
    const user = users.find(
      (u: any) => u.username === username && u.password_hash === password
    );

    if (!user) {
      throw new Error("İstifadəçi adı və ya şifrə yanlışdır");
    }

    const { password_hash, ...userWithoutPassword } = user;
    storage.set(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword as User;
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
    const users = getLocalUsers();
    return users.map(({ password_hash, ...user }: any) => user as User);
  },
};

export default authApi;
