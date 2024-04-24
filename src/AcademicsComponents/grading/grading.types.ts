import { z } from "zod";

export const QuizSchema = z.object({
  id: z.number(),
  name: z.string(),
  total_marks: z.string(),
  grade_record: z.nullable(z.number()),
  obtained_marks: z.nullable(z.number()),
  weighted_marks: z.nullable(z.number()),
  weightage: z.string(),
});

const StudentGradingSchema = z.object({
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
  course: z.number(),
  max_grade: z.number(),
  quizes: z.array(QuizSchema),
});

export type TQuizSchema = z.infer<typeof QuizSchema>
export type TStudentGradingSchema = z.infer<typeof StudentGradingSchema>