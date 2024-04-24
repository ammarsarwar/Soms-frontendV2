import { UserProfile } from "@/lib/types";
import { create } from "zustand";


interface UserProfileStoreState {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
}

export const useUserProfileStore = create<UserProfileStoreState>((set) => ({
  userProfile: {
    profile_id: undefined,
    userRole: "default",
  },
  setUserProfile: (profile) => set({ userProfile: profile }),
}));