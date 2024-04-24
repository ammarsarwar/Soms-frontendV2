import { create } from "zustand";

interface GradingStoreState {
  assignedCourse?: number;
  setAssignedCourse: (value: number) => void;
  course?: number;
  setCourse: (value: number) => void;
  isGradeRefetched: boolean;
  setIsGradeRefetched: (enabled: boolean) => void;
}

export const useGradingStore = create<GradingStoreState>((set) => ({
  fetchTrigger: 0,
  course: undefined,
  assignedCourse: undefined,
  isGradeRefetched: false,
  setIsGradeRefetched: (enabled) => set({ isGradeRefetched: enabled }),
  setAssignedCourse: (value) => {
    set((state) => ({ ...state, assignedCourse: value }));
  },
  setCourse: (value) => {
    set((state) => ({ ...state, course: value }));
  },
}));
