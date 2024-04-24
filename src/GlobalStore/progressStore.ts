import { create } from "zustand";
import { z } from "zod";

// Schema imports
import { TUpdateProgressSchema, TPostReportDataSchema } from "@/schemas";

interface StoreState {
  section?: number;
  course?: number;
  student?: number;
  isProgressEditingEnabled: boolean;
  isProgressSingleEditingEnabled: boolean;
  isProgressSaving: boolean;
  preProgressEditRowId?: number;
  isProgressRefectched: boolean;
  myprogressStatus: TPostReportDataSchema[] | null;
  updateProgress: (index: number, progress: TPostReportDataSchema) => void;
  addProgress: (progress: TPostReportDataSchema) => void;
  setIsProgressRefetched: (enabled: boolean) => void;
  setSection: (value: number) => void;
  setPreProgressEditRowId: (value: number) => void;
  setCourse: (value: number) => void;
  setStudent: (value: number) => void;
  setProgressEditingEnabled: (enabled: boolean) => void;
  setProgressSingleEditingEnabled: (enabled: boolean) => void;
  setProgressIsSaving: (enabled: boolean) => void;
  // resetProgressStatus: () => void;
}

export const useProgressStore = create<StoreState>((set) => ({
  section: undefined,
  course: undefined,
  student: undefined,
  updateSingleProgress: undefined,
  isProgressEditingEnabled: false,
  isProgressSingleEditingEnabled: false,
  preProgressEditRowId: undefined,
  isProgressSaving: false,
  isProgressRefectched: false,
  myprogressStatus: null,
  updateProgress: (index, progress) =>
    set((state) => {
      const updatedProgress = [...(state.myprogressStatus || [])];
      updatedProgress[index] = progress;
      return { myprogressStatus: updatedProgress };
    }),
  addProgress: (progress) =>
    set((state) => ({
      myprogressStatus: [...(state.myprogressStatus || []), progress],
    })),
  setIsProgressRefetched: (enabled) => set({ isProgressRefectched: enabled }),
  setPreProgressEditRowId: (value) => set({ preProgressEditRowId: value }),
  setSection: (value) => set({ section: value }),
  setCourse: (value) => set({ course: value }),
  setStudent: (value) => set({ student: value }),
  setProgressEditingEnabled: (enabled) =>
    set({ isProgressEditingEnabled: enabled }),
  setProgressSingleEditingEnabled: (enabled) =>
    set({ isProgressSingleEditingEnabled: enabled }),
  setProgressIsSaving: (saving) => set({ isProgressSaving: saving }),
  // resetProgressStatus: () => set({ myReportDataStatus: null }),
}));
