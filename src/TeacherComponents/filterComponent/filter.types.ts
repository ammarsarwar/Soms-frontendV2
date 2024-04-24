// schema for students based on section id 

import { z } from "zod";

const SchoolSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const BranchSchema = z.object({
  id: z.number(),
  name: z.string(),
  school: SchoolSchema,
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

const AcademicYearSchema = z.object({
  id: z.number(),
  start_year: z.number(),
  end_year: z.number(),
  status: z.string(),
  created: z.string(),
  school: SchoolSchema,
});

const GradeSchema = z.object({
  id: z.number(),
  name: z.string(),
  academic_year: AcademicYearSchema,
  department: DepartmentSchema,
});

const SectionSchema = z.object({
  id: z.number(),
  grade: GradeSchema,
  home_room_teacher: z.nullable(z.unknown()),
  name: z.string(),
  max_no_of_student: z.number(),
  created: z.string(),
});

const AppliedGradeSchema = z.object({
  id: z.number(),
  academic_year: AcademicYearSchema,
  department: DepartmentSchema,
  name: z.string(),
  level_number: z.nullable(z.unknown()),
  grading_criteria: z.string(),
  number_of_sections: z.nullable(z.unknown()),
  created: z.string(),
});

const ParentDataSchema = z.object({
  parent_name_arabic: z.string(),
  parent_name_english: z.string(),
});

const StudentDataSchema = z.object({
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

export const StudentSchemaBySectionId = z.object({
  id: z.number(),
  section: SectionSchema,
  campus: CampusSchema,
  applied_grade: AppliedGradeSchema,
  parentData: ParentDataSchema,
  studentData: StudentDataSchema,
  status: z.string(),
  created_at: z.string(),
  student: z.number(),
});

export type TStudentSchemaBySectionId = z.infer<typeof StudentSchemaBySectionId>