import { z } from "zod";

const SchoolSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const BranchSchema = z.object({
  id: z.number(),
  school: SchoolSchema,
  name: z.string(),
  location: z.string(),
  branch_license: z.string(),
  curriculum: z.string(),
  email_address: z.string().nullable(),
  number_of_campuses: z.number(),
  status: z.string(),
  created: z.string(),
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
  level_number: z.number().nullable(),
  grading_criteria: z.string().nullable(),
  number_of_sections: z.number(),
  created: z.string(),
  department: DepartmentSchema,
});

const SectionSchema = z.object({
  id: z.number(),
  name: z.string(),
  grade: GradeSchema,
  teacher: z
    .object({
      // Define the structure for the teacher object if available
    })
    .nullable(),
  created: z.string(),
});

const ParentDataSchema = z.object({
  parent_name_arabic: z.string(),
  parent_name_english: z.string(),
  parent_email: z.string(),
  parent_national_id: z.string().nullable(),
  parent_phone_number: z.string(),
  emergency_phone_number: z.string(),
  relation_to_child: z.string(),
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

const AdmissionSchema = z.object({
  id: z.number(),
  section: SectionSchema.nullable(),
  campus: CampusSchema,
  applied_grade: GradeSchema,
  parentData: ParentDataSchema,
  studentData: StudentDataSchema,
  status: z.string(),
  created_at: z.string(),
  student: z.number(),
});

export type StudentProfile = z.infer<typeof AdmissionSchema>;
