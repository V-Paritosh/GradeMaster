import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

export type AuthUser = { id: string; uid: string; email?: string } | null;

type AuthState = {
  user: AuthUser;
  setUser: (user: AuthUser) => void;
  fetchUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    const user = auth.currentUser;
    set({
      user: user
        ? { id: user.uid, uid: user.uid, email: user.email ?? undefined }
        : null,
    });
  },
}));

if (typeof window !== "undefined") {
  onAuthStateChanged(auth, (user) => {
    useAuthStore.getState().setUser(
      user ? { id: user.uid, uid: user.uid, email: user.email ?? undefined } : null
    );
  });
}
