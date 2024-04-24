import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
});

const CourseSchema = z.object({
  id: z.number(),
  title: z.string(),
  max_grade: z.string(),
  created: z.string(),
  grade: z.number(),
});
const SkillSchema = z.object({
  id: z.number(),
  name: z.string(),
  points: z.number(),
  icon: z.unknown().nullable(),
});
const RewardDataSchema = z.object({
  skill: z.array(SkillSchema),
  rewarded_by: UserSchema,
  total_points: z.number().nullable(),
  description: z.string().nullable(),
  course: CourseSchema.nullable(),
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
  reward_id: z.number().nullable(),
  reward_data: RewardDataSchema,
});

export type Reward = z.infer<typeof StudentDataSchema>;
