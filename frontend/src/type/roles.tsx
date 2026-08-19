export type UserRole = "parent" | "enfant" | "docteur";
export type ApiRole = "PARENT" | "PATIENT" | "DOCTOR" | UserRole;

export interface User {
  role: ApiRole;
  name?: string;
  username?: string;
  email?: string | null;
  id: number;
  parent?: User | null;
  parents?: User[];
  children?: User[];
  patients?: User[];
  doctor?: User | null;
  doctors?: User[];
  prescription?: {
    id: number;
    duration?: number;
  } | null;
  corset?: {
    id: number;
  } | null;
}

export function normalizeRole(role?: ApiRole | null): UserRole {
  if (role === "PARENT" || role === "parent") return "parent";
  if (role === "DOCTOR" || role === "docteur") return "docteur";
  return "enfant";
}

export function displayName(user?: Pick<User, "username" | "name" | "email"> | null) {
  return user?.username ?? user?.name ?? user?.email ?? "Utilisateur";
}
