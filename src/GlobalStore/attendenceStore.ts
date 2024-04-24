import { TPostAttendenceSchema } from "@/schemas";
import {create} from "zustand";

interface StoreState {
  section?: number;
  course?: number;
  student?: number;
  myDate?: string;
  isEditingEnabled: boolean;
  isSingleEditingEnabled: boolean;
  isSaving: boolean;
  preEditRowId?: number;
  myattendanceStatus: TPostAttendenceSchema[];
  isRefectched: boolean;
  isAssessmentRefectched: boolean;
  setIsRefetched: (enabled: boolean) => void;
  setIsAssessmentRefetched: (enabled: boolean) => void;
  setSection: (value: number) => void;
  setPreEditRowId: (value: number) => void;
  setCourse: (value: number) => void;
  setStudent: (value: number) => void;
  setMyDate: (value: string) => void;
  addAttendance: (attendance: { student: number; course: number; status: string, date?: string }) => void;
  setEditingEnabled: (enabled: boolean) => void;
  setSingleEditingEnabled: (enabled: boolean) => void;
  updateAttendance: (
    index: number,
    attendance: { student: number; course: number; status: string; date?: string }
  ) => void;
  setIsSaving: (enabled: boolean) => void;
  resetAttendanceStatus: () => void;
}

export const useAttendenceStore = create<StoreState>((set) => ({
  section: undefined,
  course: undefined,
  student: undefined,
   myDate: undefined,
   myattendanceStatus: [],
   isEditingEnabled: false,
   isSingleEditingEnabled: false,
   preEditRowId:undefined,
   isSaving: false,
   isRefectched: false,
   isAssessmentRefectched: false,
   setIsRefetched: (enabled) => set({ isRefectched: enabled }),
   setIsAssessmentRefetched: (enabled) => set({ isAssessmentRefectched: enabled }),
   setPreEditRowId:(value) => {
    set((state) => ({ ...state, preEditRowId: value }));
  },
  addAttendance: (attendance) => set((state) => ({ myattendanceStatus: [...state.myattendanceStatus, attendance] })),
  setSection: (value) => {
    set((state) => ({ ...state, section: value }));
  },
  setCourse: (value) => {
    set((state) => ({ ...state, course: value }));
  },
  setStudent: (value) => {
    set((state) => ({ ...state, student: value }));
  },
  updateAttendance: (index, attendance) =>
  set((state) => {
    const updatedStatus = [...state.myattendanceStatus];
    updatedStatus[index] = attendance;
    return { myattendanceStatus: updatedStatus };
  }),
  setMyDate: (value) => {
    set((state) => ({ ...state, myDate: value }));
  },
  setEditingEnabled: (enabled) => set({ isEditingEnabled: enabled }),
  setSingleEditingEnabled: (enabled) => set({ isSingleEditingEnabled: enabled }),
  setIsSaving: (saving) => set({ isSaving: saving }),
  resetAttendanceStatus: () => set({ myattendanceStatus: [] }),
}));