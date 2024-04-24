'use client'

import { create } from "zustand";

const userStore = (set: any) => ({
  first_name: null,
  last_name: null,
  email: null,
  isAuthenticated: false,
  updateUserEmail: (first_name: any) => set(() => ({ first_name: first_name })),
  updateUserRole: (last_name: any) => set(() => ({ last_name: last_name })),
  updateUserTenant: (email: any) => set(() => ({ email: email })),
  updateIsUserVerified: (isAuthenticated: any) =>
    set(() => ({ isAuthenticated: isAuthenticated })),
  reset: () => {
    set({
        first_name: null,
        last_name: null,
        email: null,
        isAuthenticated: false,
    });
  },
});

export const useUserStore = create(userStore);