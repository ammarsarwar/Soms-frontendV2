import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
});

const StudentDataSchema = z.object({
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

const CourseSchema = z.object({
  id: z.number(),
  course: z.object({
    id: z.number(),
    title: z.string(),
    max_grade: z.string(),
    created: z.string(),
    grade: z.number(),
  }),
  semester: z.number(),
  section: z.number(),
  teacher: z.number(),
  substitute: z.object({}).nullable(),
});
const SkillSchema = z.object({
  id: z.number(),
  name: z.string(),
  points: z.number(),
  icon: z.unknown().nullable(),
});
const RewardSchema = z.object({
  id: z.number(),
  skill: z.array(SkillSchema),
  student: StudentDataSchema,
  rewarded_by: UserSchema,
  course: CourseSchema,
  description: z.string().nullable(),
  created: z.string(),
});

export type RewardSimple = z.infer<typeof RewardSchema>;
