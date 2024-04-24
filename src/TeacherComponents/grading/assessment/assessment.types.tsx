import { z } from "zod";

const TeacherSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
});

const SectionSchema = z.object({
  id: z.number(),
  name: z.string(),
  max_no_of_student: z.number(),
  created: z.string(),
  grade: z.number(),
  home_room_teacher: z
    .object({
      id: z.number(),
      first_name: z.string(),
      last_name: z.string(),
      email: z.string().email(),
    })
    .nullable(),
});

const CourseSchema = z.object({
  id: z.number(),
  title: z.string(),
  max_grade: z.string(),
  created: z.string(),
  grade: z.number(),
});

export const AssessemntInfoSchema = z.object({
  id: z.number(),
  course: CourseSchema,
  section: SectionSchema,
  course_teacher: TeacherSchema,
  course_substitute: TeacherSchema,
  name: z.string(),
  total_marks: z.string(),
  weightage: z.string(),
  description: z.string(),
  created: z.string(),
});

export type TAssessemntInfoSchema = z.infer<typeof AssessemntInfoSchema>;
