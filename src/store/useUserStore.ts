import { create } from "zustand";
import User from "../interfaces/user";

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  logOut: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logOut: () => {
    set({ user: null });
},
}));
