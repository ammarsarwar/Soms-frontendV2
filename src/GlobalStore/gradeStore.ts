import { create } from "zustand";

interface StoreState {
  fetchTrigger: number;
  triggerFetch: () => void;
  assignedCourse?: number;
  setAssignedCourse: (value: number) => void;
  
}

export const useStore = create<StoreState>((set) => ({
  fetchTrigger: 0,
  course: undefined,
  setAssignedCourse: (value) => {
    set((state) => ({ ...state, assignedCourse: value }));
  },
  triggerFetch: () =>
    set((state) => ({ fetchTrigger: state.fetchTrigger + 1 })),
}));
