export type UserRole = "admin" | "user" | "manager";

export type UserStatus = "active" | "inactive" | "blocked";

export interface User {
  id?: number;
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role?: UserRole;
  status?: UserStatus;
  created_at?: Date;
  updated_at?: Date;
}

export const userRoles: UserRole[] = ["admin", "user", "manager"];
