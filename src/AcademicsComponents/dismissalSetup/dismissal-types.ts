import { z } from "zod";

const StudentSchema = z.object({
  id: z.number(),
  student_first_name_english: z.string(),
  student_middle_name_english: z.string(),
  student_last_name_english: z.string(),
  student_first_name_arabic: z.string(),
  student_middle_name_arabic: z.string(),
  student_last_name_arabic: z.string(),
  parent_name_arabic: z.string(),
  parent_name_english: z.string(),
  parent_email: z.string(),
});

const AcademicYearSchema = z.object({
  id: z.number(),
  start_year: z.number(),
  end_year: z.number(),
  status: z.string(),
  created: z.string(),
  school: z.number(),
});

const CampusSchema = z.object({
  id: z.number(),
  name: z.string(),
  branch: z.object({
    id: z.number(),
    name: z.string(),
    school: z.object({
      id: z.number(),
      name: z.string(),
    }),
  }),
});

const DepartmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  campus: CampusSchema,
});

const GradeSchema = z.object({
  id: z.number(),
  name: z.string(),
  academic_year: AcademicYearSchema,
  department: DepartmentSchema,
});

const SectionSchema = z.object({
  id: z.number(),
  grade: GradeSchema,
  home_room_teacher: z.nullable(z.unknown()),
  name: z.string(),
  max_no_of_student: z.number(),
  created: z.string(),
});

export const DismissalSchema = 
  z.object({
    id: z.number(),
    student: StudentSchema,
    section: SectionSchema,
    assigned_teacher: z.nullable(z.unknown()),
    dismissal_date: z.string(),
    dismissal_time: z.string(),
    status: z.string(),
    dismissal_type: z.string(),
    dismissal_progress: z.string(),
    reason: z.string(),
  })

export type TDismissalSchema = z.infer<typeof DismissalSchema>