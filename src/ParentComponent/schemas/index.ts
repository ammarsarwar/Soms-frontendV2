import * as z from "zod";

// Define nested schemas
const Student = z.object({
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

const Grade = z.object({
  id: z.number(),
  name: z.string(),
  academic_year: z.object({
    id: z.number(),
    start_year: z.number(),
    end_year: z.number(),
    status: z.string(),
    created: z.string(),
    school: z.number(),
  }),
  department: z.object({
    id: z.number(),
    name: z.string(),
    campus: z.object({
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
    }),
  }),
});

const AssignedTeacher = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  status: z.string(),
});

// Define the Dismissal schema
export const Dismissal = z.object({
  id: z.number(),
  student: Student,
  section: z.object({
    id: z.number(),
    grade: Grade,
    home_room_teacher: z.nullable(z.unknown()), // Assuming it could be null
    name: z.string(),
    max_no_of_student: z.number(),
    created: z.string(), // Consider using a Date type if possible
  }),
  assigned_teacher: AssignedTeacher,
  attendance: z.string(),
  dismissal_date: z.string(), // Consider using a Date type if possible
  dismissal_time: z.string(), // Consider using a Time type if possible
  status: z.string(),
  dismissal_type: z.string(),
  dismissal_progress: z.string(),
  reason: z.string(),
  document: z.nullable(z.unknown()), // Assuming it could be null
  created_at: z.string(), // Consider using a Date type if possible
});

// Type export
export type TDismissalSchema = z.infer<typeof Dismissal>;
