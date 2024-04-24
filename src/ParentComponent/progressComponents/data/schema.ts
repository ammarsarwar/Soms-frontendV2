import { z } from "zod";

const CourseDetailSchema = z.object({
  id: z.number(),
  title: z.string(),
  max_grade: z.string(),
  created: z.string(),
  grade: z.number(),
});

const SectionSchema = z.object({
  id: z.number(),
  name: z.string(),
  max_no_of_student: z.number(),
  created: z.string(),
  grade: z.number(),
  home_room_teacher: z.nullable(z.any()), // Use z.any() if the exact type is unknown or varied.
});

const AcademicYearSchema = z.object({
  id: z.number(),
  start_year: z.number(),
  end_year: z.number(),
  status: z.string(),
  created: z.string(),
  school: z.number(),
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

const TeacherSchema = z.object({
  id: z.number(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  status: z.string(),
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

const ReportDataSchema = z.object({
  id: z.number(),
  progress_type: z.string(),
  points: z.number(),
});

const ReportItemSchema = z.object({
  id: z.number(),
  course_detail: CourseDetailSchema,
  section: SectionSchema,
  grade: z.string(),
  semester: SemesterSchema,
  teacher: TeacherSchema,
  student: StudentSchema,
  report_data: z.array(ReportDataSchema),
  comments: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  created_at: z.string(),
  course: z.number(),
});

export type ReportsSchema = z.infer<typeof ReportItemSchema>;

// Example of using the schema to parse data:
// const result = ReportsSchema.parse(yourDataArray);
