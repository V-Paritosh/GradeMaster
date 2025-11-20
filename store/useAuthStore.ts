import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

type AuthState = {
  user: any | null;
  setUser: (user: any | null) => void;
  fetchUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    const { data } = await supabase.auth.getUser();
    set({ user: data.user });
  },
}));

// Realtime listener for login/logout
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.getState().setUser(session?.user ?? null);
});