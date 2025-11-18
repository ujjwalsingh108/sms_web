import { create } from "zustand";
import { Database } from "@/lib/supabase/database.types";

type Role = Database["public"]["Tables"]["roles"]["Row"];
type Tenant = Database["public"]["Tables"]["tenants"]["Row"];
type Member = Database["public"]["Tables"]["members"]["Row"] & {
  role: Role;
  tenant: Tenant;
};

interface User {
  id: string;
  email?: string;
  full_name?: string;
}

interface UserStore {
  user: User | null;
  member: Member | null;
  setUser: (user: User | null) => void;
  setMember: (member: Member | null) => void;
  isAuthenticated: boolean;
  role: string | null;
  tenant: Tenant | null;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  member: null,
  isAuthenticated: false,
  role: null,
  tenant: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setMember: (member) =>
    set({
      member,
      role: member?.role?.name || null,
      tenant: member?.tenant || null,
    }),
}));
