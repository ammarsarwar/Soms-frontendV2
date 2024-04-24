import { z } from "zod";

const SkillSchema = z.object({
  id: z.number(),
  name: z.string(),
  points: z.number(),
  icon: z.nullable(z.any()), // Adjust based on the actual data type if known
});

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

const RewardedBySchema = z.object({
  id: z.number(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  status: z.string(),
});

const CourseInnerSchema = z.object({
  id: z.number(),
  title: z.string(),
  max_grade: z.string(),
  created: z.string(),
  grade: z.number(),
});

const CourseSchema = z.object({
  id: z.number(),
  course: CourseInnerSchema,
  semester: z.number(),
  section: z.number(),
  teacher: z.number(),
  substitute: z.nullable(z.any()), // Adjust based on the actual data type if known
});

const RewardSchema = z.object({
  id: z.number(),
  skill: z.array(SkillSchema),
  student: StudentSchema,
  rewarded_by: RewardedBySchema,
  course: CourseSchema,
  total_points: z.number(),
  description: z.string(),
  created: z.string(),
});

// Example of using the schema to parse data
// const result = RewardSchema.parse(yourDataObject);

export type RewardSimple = z.infer<typeof RewardSchema>;
