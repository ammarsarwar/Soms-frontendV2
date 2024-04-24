import * as z from "zod";

// Student Data Schema
const StudentDataSchema = z.object({
  id: z.number(),
  student_national_id: z.string(),
  student_first_name_english: z.string(),
  student_middle_name_english: z.string(),
  student_last_name_english: z.string(),
  student_first_name_arabic: z.string(),
  student_middle_name_arabic: z.string(),
  student_last_name_arabic: z.string(),
  student_gender: z.string(),
  student_date_of_birth: z.string(),
});

// Section Schema
const SectionSchema = z.object({
  id: z.number(),
  name: z.string(),
  max_no_of_student: z.number(),
  created: z.string(),
  grade: z.number(),
  home_room_teacher: z.nullable(z.unknown()), // Adjust according to actual type if known
});

// Course Schema
const CourseSchema = z.object({
  id: z.number(),
  title: z.string(),
  max_grade: z.string(),
  created: z.string(),
  grade: z.number(),
});

// Academic Year Schema
const AcademicYearSchema = z.object({
  id: z.number(),
  start_year: z.number(),
  end_year: z.number(),
  status: z.string(),
  created: z.string(),
  school: z.number(),
});

// Semester Schema
const SemesterSchema = z.object({
  id: z.number(),
  academic_year: AcademicYearSchema,
  name: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  status: z.string(),
  created: z.string(),
});

// Teacher Schema
const TeacherSchema = z.object({
  id: z.number(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});

// Attendance Schema
const AttendanceSchema = z.object({
  id: z.number(),
  student_data: StudentDataSchema,
  section: SectionSchema,
  grade: z.string(),
  course: CourseSchema,
  semester: SemesterSchema,
  teacher: TeacherSchema,
  status: z.string(),
  date: z.string(),
  created_at: z.string(),
  time_stamp: z.string(),
  student: z.number(), // Assuming this refers to the student ID
});

// Export Types
export type StudentData = z.infer<typeof StudentDataSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Course = z.infer<typeof CourseSchema>;
export type AcademicYear = z.infer<typeof AcademicYearSchema>;
export type Semester = z.infer<typeof SemesterSchema>;
export type Teacher = z.infer<typeof TeacherSchema>;
export type Attendance = z.infer<typeof AttendanceSchema>;
