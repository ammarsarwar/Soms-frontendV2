import { create } from "zustand";
import { z } from "zod";

// Schema imports
import {  TStudentProfileListForReportsSchema } from "@/schemas";

interface ReportsStoreState {
  studentReportsData: TStudentProfileListForReportsSchema | null;
  addStudentReportsData: (reportsData: TStudentProfileListForReportsSchema) => void;
  departmentTypeSelected: string|null;
  addDepartmentTypeSelected: (value: string | null) => void;
}

export const useReportsStore = create<ReportsStoreState>((set) => ({
    studentReportsData: null,
    departmentTypeSelected: null,
    addStudentReportsData: (reportsData) =>
    set((state) => ({ ...state, studentReportsData: reportsData })),
    addDepartmentTypeSelected: (value) => {
      set((state) => ({ ...state, departmentTypeSelected: value }));
    },
}));
