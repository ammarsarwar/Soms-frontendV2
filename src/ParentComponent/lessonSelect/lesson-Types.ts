import { z } from "zod";

const AcademicYearSchema = z.object({
  id: z.number(),
  start_year: z.number(),
  end_year: z.number(),
  status: z.string(),
  created: z.string(),
  school: z.number(),
});

const BranchSchema = z.object({
  id: z.number(),
  name: z.string(),
  school: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

const CampusSchema = z.object({
  id: z.number(),
  name: z.string(),
  branch: BranchSchema,
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

const CourseSchema = z.object({
  id: z.number(),
  grade: GradeSchema,
  title: z.string(),
  max_grade: z.string(),
  created: z.string(),
});

const SectionSchema = z.object({
  id: z.number(),
  name: z.string(),
  max_no_of_student: z.number(),
  created: z.string(),
  grade: z.number(),
  home_room_teacher: z.null().optional(),
});

const TeacherSchema = z.object({
  id: z.number(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  status: z.string(),
});

const SemesterSchema = z.object({
  id: z.number(),
  academic_year: AcademicYearSchema,
  name: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  status: z.string(),
  created: z.string(),
});

const LessonSchema = z.object({
  id: z.number(),
  course: CourseSchema,
  section: SectionSchema,
  teacher: TeacherSchema,
  substitute: z.null().optional(),
  semester: SemesterSchema,
});

// Assuming you have an array of lessons
export type Lesson = z.infer<typeof LessonSchema>;
