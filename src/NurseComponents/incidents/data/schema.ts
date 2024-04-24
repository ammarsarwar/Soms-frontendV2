import { z } from "zod";

const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});

const branchSchema = z.object({
  id: z.number(),
  name: z.string(),
  school: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

const campusSchema = z.object({
  id: z.number(),
  name: z.string(),
  branch: branchSchema,
});

const academicYearSchema = z.object({
  id: z.number(),
  start_year: z.number(),
  end_year: z.number(),
  status: z.string(),
  created: z.string(),
  school: z.number(),
});

const departmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  campus: campusSchema,
});

const gradeSchema = z.object({
  id: z.number(),
  name: z.string(),
  academic_year: academicYearSchema,
  department: departmentSchema,
});

const sectionSchema = z.object({
  id: z.number(),
  name: z.string(),
  max_no_of_student: z.number(),
  created: z.string(),
  grade: z.number(),
  home_room_teacher: z.string().nullable(),
});

const studentSchema = z.object({
  id: z.number(),
  student_first_name_english: z.string(),
  student_middle_name_english: z.string(),
  student_last_name_english: z.string(),
  student_first_name_arabic: z.string(),
  student_middle_name_arabic: z.string(),
  student_last_name_arabic: z.string(),
  parent_name_arabic: z.string().optional(),
  parent_name_english: z.string().optional(),
  parent_email: z.string().optional(),
});

const nurseSchema = z.object({
  id: z.number(),
  user: userSchema,
  created_by: userSchema,
  userRole: z.string(),
  created_at: z.string(),
  school: z.number(),
  branch: z.number(),
  campus: z.number(),
  department: z.string().nullable(),
});

const incidentRecordSchema = z.object({
  id: z.number(),
  nurse: nurseSchema,
  student: studentSchema,
  section: sectionSchema,
  campus: campusSchema,
  date_time_of_incident: z.string(),
  location: z.string(),
  description: z.string(),
  actions_taken: z.string(),
  acknowledged_by_parent: z.boolean(),
});

export type IncidentData = z.infer<typeof incidentRecordSchema>;
