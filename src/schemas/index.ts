/**
 * This file will contain schemas for all of the features inside admin dashboard
 * We will use normal typescript schemas for every from that is inside the dialog
 * Becuse shadcn as of now doesn't let you trigger the form when there is zod resolver
 * in the form, So on client we'll use regular interface to send data and on server we'll 
 * use zod to validate, However we will use zod mostly in this file to make schemas and infer
 * their types to use them on frontend and backend validation.
 */
import * as z from "zod"

// Module: School year
//GET
export const SchoolYearSchema =
  z.object({
    id: z.number(),
    start_year: z.number(),
    end_year: z.number(),
    status: z.string(z.enum(['Active', 'Inactive'])),
    created: z.string(),
    school: z.number().nullable(),
  })


//POST
// For shadcn dialog
export interface SchoolYearFormSchema {
    start_year: string,
    end_year: string,
}
// For server action validation
export const ZSchoolYearFormSchema = z.object({
    start_year: z.string(),
    end_year: z.string(),
})

//PATCH/PUT
export const SchoolYearDisableSchema = z.object({
    id: z.number(),
    status: z.string()
})

// Type exports
export type TSchoolYearSchema = z.infer<typeof SchoolYearSchema>
export type ZTSchoolYearFormSchema = z.infer<typeof ZSchoolYearFormSchema>
export type TSchoolYearDisableSchema = z.infer<typeof SchoolYearDisableSchema>


// Module: Academic term

//GET
export const AcademicTermSchema = z.object({
    id: z.number(),
    academic_year: SchoolYearSchema,
    name: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    status: z.string(),
    created: z.string(),
})

//POST
// For shadcn dialog
export interface AcademicTermFormSchema {
        academic_year: string,
        name: string,
        start_date: string,
        end_date: string,
} 

// For server action validation
export const ZAcademicTermFormSchema = z.object({
        academic_year: z.string(),
        name: z.string(),
        start_date: z.date(),
        end_date: z.date(),
})

//PATCH/PUT
export const AcadmicTermDisableSchema = z.object({
    id: z.number(),
    status: z.string()
})

// Type exports
export type ZTAcademicTermFormSchema = z.infer<typeof ZAcademicTermFormSchema>
export type TAcademicTermSchema = z.infer<typeof AcademicTermSchema>
export type TAcadmicTermDisableSchema = z.infer<typeof AcadmicTermDisableSchema>


//Module: Admission Calender

//GET
export const AdmissionCalenderSchema = z.object({
    id: z.number(),
    academic_year: SchoolYearSchema,
    start_date: z.string(),
    end_date: z.string(),
    status: z.string(),
  });

export const AdmissionCalenderWithSchoolYearIdSchema = z.object({
    id: z.number(),
    start_date: z.string(),
    end_date: z.string(),
    status: z.string(),
    academic_year: z.number()
  });
  
//Post
// for shadcn dialog
export interface CalenderFormSchema {
    academic_year: string;
    start_date: string;
    end_date: string;
}

// For server action validation
export const ZCalenderFormSchema = z.object({
    academic_year: z.string(),
    start_date: z.date(),
    end_date: z.date()
})

//PATCH/PUT
export const AdmissionCalenderDisableSchema = z.object({
    id: z.number(),
    status: z.string()
})
 
// Type exports
export type TAdmissionCalenderSchema = z.infer<typeof AdmissionCalenderSchema>
export type ZTCalenderFormSchema = z.infer<typeof ZCalenderFormSchema>
export type TAdmissionCalenderDisableSchema = z.infer<typeof AdmissionCalenderDisableSchema>
export type TAdmissionCalenderWithSchoolYearIdSchema = z.infer<typeof AdmissionCalenderWithSchoolYearIdSchema>



//Module: school setup short and long schemas
//randomly used short schemas for capmus grade branch etc that includes only id and names
export const SchoolSchemaIdName = z.object({
    id: z.number(),
    name: z.string()
});

export const BranchSchemaIdName = z.object({
    id: z.number(),
    name: z.string()
});

export const CampusSchemaIdName = z.object({
    id: z.number(),
    name: z.string()
});

//Randomly used longs schemas for campus, grade, section, branch etc with includes all details not just id and name
export const SchoolSchemaExtended = z.object({
    id: z.number(),
    name: z.string(),
  })

export const BranchSchemaExtended = z.object({
    id: z.number(),
    name: z.string(),
    school: SchoolSchemaExtended
  });

export  const CampusSchemaExtended = z.object({
    id: z.number(),
    name: z.string(),
    branch: BranchSchemaExtended,
});
  
export const DepartmentSchemaExtended = z.object({
    id: z.number(),
    name: z.string(),
    campus: CampusSchemaExtended,
});
  
export const GradeSchemaExtended = z.object({
    id: z.number(),
    name: z.string(),
    academic_year: z.nullable(SchoolYearSchema),
    department: DepartmentSchemaExtended,
  });
    // academic_year: z.nullable(SchoolYearSchema),

  //normal school setup schema with all information
  const SchoolSchema = z.object({
    id: z.number(),
    name: z.string(),
    address: z.string(),
    grade_system: z.string(),
    country: z.string(),
    number_of_branches: z.number(),
    school_reg_no: z.string(),
    terms_per_year: z.number(),
    status: z.string(),
    created: z.string(),
  });

export const BranchSchema = z.object({
    id: z.number(),
    school: z.optional(SchoolSchemaExtended),
    name: z.string(),
    number_of_campuses: z.number().nullable(),
    location: z.string(),
    curriculum: z.string(),
    email_address: z.string().nullable(),
    branch_license:  z.string().refine(value => /^\d{3}-\d{4}$/.test(value), { message: 'Invalid branch_license format' }),
    status: z.string(),
    created: z.string(),
})

export const CampusSchema = z.object({
    id: z.number(),
    branch: BranchSchemaExtended,
    name: z.string(),
    contact_number: z.number().int().nullable(),
    email_address: z.string().nullable(),
    location: z.string(),
    campus_for: z.string(),
    created: z.string(),
  });
  
export const DeptSchema = z.object({
    id: z.number(),
    name: z.string(),
    campus: CampusSchemaExtended,
    department_type: z.string().nullable(),
    number_of_grades: z.string().nullable(),
    created: z.string(),
  });

export const GradeSchema = z.object({
    id: z.number(),
    name: z.string(),
    department: DepartmentSchemaExtended,
    level_number: z.string().nullable(),
    grading_criteria: z.string().nullable(),
    number_of_sections: z.string().nullable(),
    created: z.string(),
  });
  
  
 export const SectionSchema = z.object({
    id: z.number(),
    name: z.string(),
    grade: GradeSchemaExtended,
    max_no_of_student: z.number().nullable(),
    created: z.string(),
    home_room_teacher: z.nullable(z.any()),
  });
  
   export const SectionSchemaForAssignedLesson = z.object({
     id: z.number(),
     name: z.string(),
     grade: z.number(),
     max_no_of_student: z.number().nullable(),
     created: z.string(),
     home_room_teacher: z.nullable(z.unknown()),
   });

// Type exports
//short
export type TSchoolSchemaIdName = z.infer<typeof SchoolSchemaIdName>
export type TBranchSchemaIdName = z.infer<typeof BranchSchemaIdName>
export type TCampusSchemaIdName = z.infer<typeof CampusSchemaIdName>
//extended
export type TBranchSchemaExtended = z.infer<typeof BranchSchemaExtended>
export type TCampusSchemaExtended = z.infer<typeof CampusSchemaExtended>
export type TDepartmentSchemaExtended = z.infer<typeof DepartmentSchemaExtended>
export type TGradeSchemaExtended = z.infer<typeof GradeSchemaExtended>
//normal
export type Branch = z.infer<typeof BranchSchema>
export type Campus = z.infer<typeof CampusSchema>
export type Department = z.infer<typeof DeptSchema>
export type Grade = z.infer<typeof GradeSchema>
export type Section = z.infer<typeof SectionSchema>


// Module: User Management
//GET
export const CreatedBySchema = z.object({
    id: z.number(),
    email: z.string(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    status: z.string()
});
  
export const UserProfileSchema = z.object({
    id: z.number(),
    school: SchoolSchemaIdName.nullable(),
    branch: BranchSchemaIdName.nullable(),
    campus: CampusSchemaIdName.nullable(),
    department: z.nullable(z.any()),
    created_by: CreatedBySchema.nullable(),
    userRole: z.string(),
    created_at: z.string()
  });

export const UserSchemaWithoutProfiles = z.object({
  id: z.number(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  status: z.string(),
  national_id: z.string().optional(),
});

export const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  status: z.string(),
  national_id: z.string().optional(),
  user_profiles: z.array(UserProfileSchema),
});

export const TeacherUserSchema = z.object({
  id: z.number(),
  user: UserSchemaWithoutProfiles,
  created_by: CreatedBySchema,
  userRole: z.string(),
  created_at: z.string(),
  school: z.number(),
  branch: z.number(),
  campus: z.number(),
  department: z.nullable(z.string()),
});

export const ProfileDetailsSchema = z.object({
  id: z.number(),
  user: UserSchemaWithoutProfiles,
  school: SchoolSchemaIdName,
  branch: BranchSchemaIdName.nullable(),
  campus: CampusSchemaIdName.nullable(),
  department: z.nullable(z.any()),
  created_by: CreatedBySchema,
  userRole: z.string(),
  created_at: z.string(),
});

// POST
export interface UserFormSchema {
  first_name: string;
  last_name: string;
  email: string;
  national_id: string;
}

export const ZUserFormSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  national_id: z.string().optional(),
});

//PATCH
export const ProfileDataSchema = z.object({
  branch: z.string().min(1, "Branch is required"),
  campus: z.string().min(1, "Campus is required"),
  userRole: z.enum(["TE", "PR", "NU", "AC", "AD"]),
});

export const UserStatusChangeSchema = z.object({
  status: z.string(z.enum(["Active", "Inactive"])),
  user_id: z.number(),
});

// Type exports
export type TCreatedBySchema = z.infer<typeof CreatedBySchema>;
export type TUserProfileSchema = z.infer<typeof UserProfileSchema>;
export type TUserSchema = z.infer<typeof UserSchema>;
export type ZTUserFormSchema = z.infer<typeof ZUserFormSchema>;
export type TProfileDataSchema = z.infer<typeof ProfileDataSchema>;
export type TUserSchemaWithoutProfiles = z.infer<
  typeof UserSchemaWithoutProfiles
>;
export type TUserStatusChangeSchema = z.infer<typeof UserStatusChangeSchema>;
export type TTeacherUserSchema = z.infer<typeof TeacherUserSchema>;
export type TProfileDetailsSchema = z.infer<typeof ProfileDetailsSchema>;

//Module: Lessons
//GET
export const LessonSchema = z.object({
  id: z.number(),
  grade: GradeSchemaExtended,
  title: z.string(),
  max_grade: z.string(),
  created: z.string(),
});

//POST
export interface PostFormLessonSchema {
  branch: string;
  campus: string;
  department: string;
  grade: string;
  title: string;
  // max_grade: string;
}

export const ZPostFormLessonSchema = z.object({
  branch: z.string(),
  campus: z.string(),
  department: z.string(),
  grade: z.string(),
  title: z.string(),
  // max_grade: z.string(),
});

//PATCH
export interface LessonUpdateSchema {
  title: string;
  // max_grade: string,
}

export const ZLessonUpdateSchema = z.object({
  title: z.string(),
  // max_grade: z.string(),
});

//Types
export type TLessonSchema = z.infer<typeof LessonSchema>;
export type ZTPostFormLessonSchema = z.infer<typeof ZPostFormLessonSchema>;
export type ZTLessonUpdateSchema = z.infer<typeof ZLessonUpdateSchema>;

//Module: Assigned lessons
//for assignlesson user schema
const AssignLessonUserSchema = z.object({
  id: z.number(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});

const TeacherSchema = z.object({
  id: z.number(),
  user: AssignLessonUserSchema,
  created_by: AssignLessonUserSchema,
  userRole: z.string(),
  created_at: z.string(),
  school: z.number(),
  branch: z.number(),
  campus: z.number(),
  department: z.nullable(z.unknown()),
});

const SubstituteSchema = z.object({
  id: z.number(),
  user: AssignLessonUserSchema,
  created_by: AssignLessonUserSchema,
  userRole: z.string(),
  created_at: z.string(),
  school: z.number(),
  branch: z.number(),
  campus: z.number(),
  department: z.nullable(z.unknown()),
});

export const AssignedLessonsSchema = z.object({
  id: z.number(),
  course: LessonSchema,
  section: SectionSchemaForAssignedLesson,
  teacher: UserSchemaWithoutProfiles,
  substitute: z.nullable(z.any()),
  semester: AcademicTermSchema,
});

//POST
export interface AssignLessonFormSchema {
  branch: string;
  campus: string;
  department: string;
  grade: string;
  lesson: string;
  teacher: string;
  section: string;
}

export const ZAssignLessonFormSchema = z.object({
  branch: z.string(),
  campus: z.string(),
  department: z.string(),
  grade: z.string(),
  lesson: z.string(),
  teacher: z.string(),
  subtitute: z.string().optional(),
  section: z.string(),
});

//Types
export type TAssignedLessonsSchema = z.infer<typeof AssignedLessonsSchema>;
export type ZTAssignLessonFormSchema = z.infer<typeof ZAssignLessonFormSchema>;

//Module: Attendance
//GET
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

const StudentDataWithIdSchema = z.object({
  id: z.number(),
  student_first_name_english: z.string(),
  student_national_id: z.string().nullable(),
  student_middle_name_english: z.string(),
  student_last_name_english: z.string(),
  student_first_name_arabic: z.string(),
  student_middle_name_arabic: z.string(),
  student_last_name_arabic: z.string(),
  parent_name_arabic: z.string(),
  parent_name_english: z.string(),
  parent_email: z.string(),
  parent_national_id: z.string().nullable(),
  parent_phone_number: z.string(),
  emergency_phone_number: z.string(),
  relation_to_child: z.string()
});

// Define the main schema for the API response
export const StudentAttendenceSchema = z.object({
  id: z.number(),
  section: SectionSchema,
  campus: CampusSchemaExtended,
  applied_grade: GradeSchemaExtended,
  parentData: ParentDataSchema,
  studentData: StudentDataSchema,
  status: z.string(),
  created_at: z.string(),
  student: z.number(),
});

//POST
export const PostAttendenceSchema = z.object({
  course: z.number(),
  student: z.number(),
  status: z.string(),
  date: z.string().optional(),
});

//optimized attendece schema
const AttendanceStatusSchema = z.object({
  status: z.string(z.enum(["Present", "Absent", "Late", "Excused"])),
});

export const OptimizedStudentAttendenceSchema = z.object({
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
  attendance_id: z.number().nullable(),
  attendance: AttendanceStatusSchema.nullable(),
});

//PATCH
export const UpdateAttendenceSchema = z.object({
  attendence_id: z.number().nullable(),
  course: z.number(),
  status: z.string(),
  date: z.string().optional(),
});

//types
export type TStudentAttendenceSchema = z.infer<typeof StudentAttendenceSchema>;
export type TOptimizedStudentAttendenceSchema = z.infer<
  typeof OptimizedStudentAttendenceSchema
>;
export type TPostAttendenceSchema = z.infer<typeof PostAttendenceSchema>;
export type TUpdateAttendenceSchema = z.infer<typeof UpdateAttendenceSchema>;

//Module progress tracking

//GET

const ReportDataSchema = z.object({
  id: z.number(),
  progress_type: z.string(),
  points: z.number(),
});
const ProgressTypeSchema = z.object({
  start_date: z.string(),
  end_date: z.string(),
  comments: z.string().nullable(),
  report_data: z.array(ReportDataSchema),
});

const ProgressSchema = z.object({
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
  progress_report: ProgressTypeSchema.nullable(),
  course: z.number(),
});

//POST

export const PostReportDataSchema = z.object({
  student: z.number(),
  attendance: z.object({ points: z.number() }),
  homework: z.object({ points: z.number() }),
  punctuality: z.object({ points: z.number() }),
  behavior: z.object({ points: z.number() }),
  comments: z.string().optional(),
});

// Single Creation Schema
export const SingleProgressSchema = z.object({
  course: z.number(),
  start_date: z.string(),
  end_date: z.string(),
  report_data: PostReportDataSchema,
});

// Bulk Creation Schema
export const BulkProgressSchema = z.object({
  course: z.number(),
  start_date: z.string(),
  end_date: z.string(),
  report_data: z.array(PostReportDataSchema),
});

// Update Schema
export const UpdateProgressSchema = z.object({
  course: z.number(),
  student: z.number(),
  start_date: z.string(),
  end_date: z.string(),
  comments: z.string().optional(),
  attendance: z.object({ id: z.number(), points: z.number() }),
  homework: z.object({ id: z.number(), points: z.number() }),
  punctuality: z.object({ id: z.number(), points: z.number() }),
  behavior: z.object({ id: z.number(), points: z.number() }),
});

// Type definition for the payload schemas
export type TSingleProgressSchema = z.infer<typeof SingleProgressSchema>;
export type TBulkProgressSchema = z.infer<typeof BulkProgressSchema>;
export type TUpdateProgressSchema = z.infer<typeof UpdateProgressSchema>;
export type ProgressArraySchema = z.infer<typeof ProgressSchema>;
export type TPostReportDataSchema = z.infer<typeof PostReportDataSchema>;

//Module: Grading
//GET normal
export const QuizSchema = z.object({
  id: z.number(),
  name: z.string(),
  total_marks: z.string(),
  grade_record: z.nullable(z.number()),
  obtained_marks: z.nullable(z.number()),
  weighted_marks: z.nullable(z.number()),
  weightage: z.string(),
});

export const StudentGradingSchema = z.object({
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

// GET KG
export const KgAssessmentSchemaWithIdKey = z.object({
  id: z.number(),
  name: z.string(),
  performance_key: z.number().nullable(),
  assessment_record: z.number().nullable(),
});

// Define student schema
export const StudentKgGradingSchema = z.object({
  id: z.number(),
  student_first_name_english: z.string(),
  student_middle_name_english: z.string(),
  student_last_name_english: z.string(),
  student_first_name_arabic: z.string(),
  student_middle_name_arabic: z.string(),
  student_last_name_arabic: z.string(),
  parent_name_arabic: z.string(),
  parent_name_english: z.string(),
  parent_email: z.string().email(),
  course: z.number(),
  assessments: z.array(KgAssessmentSchemaWithIdKey),
});

// POST | PATCH
export interface EditMarksFormSchema {
  obtained_marks: string;
}

export const ZEditMarksFormSchema = z.object({
  obtained_marks: z.string(),
});

// POST | PATCH for KG assessments
export interface EditKgMarksFormSchema {
  performance_key: string;
}

export const ZEditKgMarksFormSchema = z.object({
  performance_key: z.string(),
});

//Types
export type TQuizSchema = z.infer<typeof QuizSchema>;
export type TKgAssessmentSchemaWithIdKey = z.infer<
  typeof KgAssessmentSchemaWithIdKey
>;
export type TStudentGradingSchema = z.infer<typeof StudentGradingSchema>;
export type TStudentKgGradingSchema = z.infer<typeof StudentKgGradingSchema>;
export type ZTEditMarksFormSchema = z.infer<typeof ZEditMarksFormSchema>;
export type ZTEditKgMarksFormSchema = z.infer<typeof ZEditKgMarksFormSchema>;

//Module: Assesments
//GET

export const GradeSchemaForAssessments = z.object({
  id: z.number(),
  name: z.string(),
  department: z.number(),
  level_number: z.string().nullable(),
  grading_criteria: z.string().nullable(),
  number_of_sections: z.string().nullable(),
  created: z.string(),
  academic_year: z.number(),
});

export const AssessemntInfoSchema = z.object({
  id: z.number(),
  grade: GradeSchemaForAssessments,
  name: z.string(),
  total_marks: z.string(),
  weightage: z.string(),
  description: z.string().nullable(),
  created: z.string(),
});

export const LessonSchemaForAssessment = z.object({
  id: z.number(),
  grade: z.number(),
  title: z.string(),
  max_grade: z.string(),
  created: z.string(),
});

export const KgAssessmentSchema = z.object({
  id: z.number(),
  generic_course: LessonSchemaForAssessment,
  name: z.string(),
  description: z.string(),
  created: z.string(),
});

// Post
export interface AssessmentFormSchema {
  name: string;
  total_marks: string;
  weightage: string;
}

export interface KgAssessmentFormSchema {
  name: string;
  description: string;
}

export const ZKgAssessmentFormSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const ZAssessmentFormSchema = z.object({
  name: z.string(),
  total_marks: z.string(),
  weightage: z.string(),
  description: z.string().optional(),
});

//Types
export type TAssessemntInfoSchema = z.infer<typeof AssessemntInfoSchema>;
export type TKgAssessemntInfoSchema = z.infer<typeof KgAssessmentSchema>;
export type ZTAssessmentFormSchema = z.infer<typeof ZAssessmentFormSchema>;
export type ZTKgAssessmentFormSchema = z.infer<typeof ZKgAssessmentFormSchema>;

// Module Admission Application

// Mid Year Student Tranfer Schema
export const StudentTransferSchema = z.object({
  student_first_name_english: z.string(),
  student_middle_name_english: z.string(),
  student_last_name_english: z.string(),
  student_first_name_arabic: z.string(),
  student_middle_name_arabic: z.string(),
  student_last_name_arabic: z.string(),
  student_national_id: z.string(),
  parent_name_arabic: z.string(),
  parent_name_english: z.string(),
  parent_email: z.string().email(),
  parent_phone_number: z.string(),
  emergency_phone_number: z.string(),
  relation_to_child: z.string(),
  student_gender: z.string(),
  student_date_of_birth: z.string(),
});

// GET

export const GradeListForAdmissionsSchema = z.object({
  id: z.number(),
  name: z.string(),
  department: z.number(),
});

export const TimeSlotsForAdmissionsSchema = z.object({
  id: z.number(),
  teacher: TeacherUserSchema,
  admission_calendar: AdmissionCalenderWithSchoolYearIdSchema,
  department: z.string(),
  date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  max_students: z.number(),
  available: z.boolean(),
});

// POST
export const ApplicationDataSchema = z.object({
  parent_name_english: z.string().min(1, "Parent name is required"),
  parent_name_arabic: z.string().min(1, "Please enter parent name in arabic"),
  parent_national_id: z
    .string()
    .min(6, { message: "Parent National ID is required" }),
  student_first_name_english: z
    .string()
    .min(1, "Student first name is required"),
  student_last_name_english: z.string().min(1, "Student last name is required"),
  student_middle_name_english: z.string().min(1, "Student middle is required"),
  student_first_name_arabic: z
    .string()
    .min(1, "Please enter student first name in arabic"),
  student_last_name_arabic: z
    .string()
    .min(1, "Please enter student last name in arabic"),
  student_middle_name_arabic: z
    .string()
    .min(1, "Please enter student middle name in arabic"),
  student_gender: z.enum(["Male", "Female"]),
  parent_phone_number: z
    .string()
    .refine((value) => /^[0-9\s()+-]+$/.test(value), {
      message: "Only numbers, symbols, and spaces are allowed",
    }),
  // parent_phone_number: z.string().refine((value) => /^\d+$/.test(value), {
  //   message: "Only numbers are allowed",
  // }),
  relation_to_child: z
    .string()
    .min(1, "Please enter your relation to the child"),
  emergency_phone_number: z
    .string()
    .refine((value) => /^[0-9\s()+-]+$/.test(value), {
      message: "Only numbers, symbols, and spaces are allowed",
    }),
  student_national_id: z
    .string()
    .min(6, "National id is required")
    .regex(
      /^[\d-]+$/,
      "National ID should be minimum six characters long and can only contain numbers and hyphens."
    ),

  // student_national_id: z.string().min(1, "National id is required"),
  student_date_of_birth: z.string(),

  parent_email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email address"),
  applied_branch: z.string().refine((value) => /^\d+$/.test(value), {
    message: "Invalid branch selection",
  }),
  applied_campus: z.string().refine((value) => /^\d+$/.test(value), {
    message: "Invalid campus selection",
  }),
  applied_grade: z.string().refine((value) => /^\d+$/.test(value), {
    message: "Invalid grade selection",
  }),
  isCoEduSelected: z.boolean().optional(),
  scheduled_test: z.string().refine((value) => /^\d+$/.test(value), {
    message: "Invalid slot selection",
  }),
});





//Types
export type TApplicationDataSchema = z.infer<typeof ApplicationDataSchema>
export type TStudentTransferSchema = z.infer<typeof StudentTransferSchema>
export type TGradeListForAdmissionsSchema = z.infer<typeof GradeListForAdmissionsSchema>
export type TTimeSlotsForAdmissionsSchema = z.infer<typeof TimeSlotsForAdmissionsSchema>


// Module: Profile Settings

// Change password schema : Patch


export interface ChangePasswordSchema {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
} 


export const ChangePasswordSchema = z.object({
  old_password: z.string(),
  new_password: z.string(),
  confirm_new_password: z.string()
})

//Types
export type TChangePasswordSchema = z.infer<typeof ChangePasswordSchema>


//Module: Reports

// student profile list schema
//GET

export const StudentProfileListForReportsSchema = 
  z.object({
    id: z.number(),
    section: SectionSchema,
    campus: CampusSchemaExtended,
    applied_grade: GradeSchemaExtended,
    parentData: ParentDataSchema,
    studentData: StudentDataSchema,
    status: z.string(z.enum(["Active","Inactive"])),
    created_at: z.string(),
    student: z.number()
  })

  //GET: schema for KG Report Card Data for a student


  const KgStduentSemesterRecordSchema = z.object({
    semester_id: z.number(),
    semester_name: z.string(),
    semester_status: z.string(),
    assessment_record_id: z.number().nullable(),
    performace_key: z.number().nullable()
  });

  const KgStduentReportAssessmentSchema = z.object({
    assessment_id: z.number(),
    assessment_name: z.string(),
    semester_record: z.array(KgStduentSemesterRecordSchema)
  });

  const KgStduentReportCourseSchema = z.object({
    generic_course_id: z.number(),
    generic_course_name: z.string(),
    assessments: z.array(KgStduentReportAssessmentSchema)
  });

  const KgStudentEvaluationSchema = z.object({
    id: z.number(),
    final_coments: z.string(),
    final_evalution: z.string()
  })

  export const KgStudentReportCardDataSchema = z.object({
    student_data: StudentDataWithIdSchema,
    student_grade: GradeSchemaExtended,
    courses: z.array(KgStduentReportCourseSchema),
    report: KgStudentEvaluationSchema.nullable()
  });


  //POST
  export const ZKgReportFormSchemaForKg = z.object({
    academic_year: z.string(),
    student: z.number(),
    final_coments: z.string(),
    final_evalution: z.string(),
})

  //PATCH
  export const ZKgReportFormUpdateSchemaForKg = z.object({
    academic_year: z.string().optional(),
    student: z.number().optional(),
    final_coments: z.string().optional(),
    final_evalution: z.string().optional(),
})


// types
export type TStudentProfileListForReportsSchema = z.infer<typeof StudentProfileListForReportsSchema>
export type TKgStudentReportCardDataSchema = z.infer<typeof KgStudentReportCardDataSchema>
export type ZTKgReportFormSchemaForKg = z.infer<typeof ZKgReportFormSchemaForKg>
export type ZTKgReportFormUpdateSchemaForKg = z.infer<typeof ZKgReportFormUpdateSchemaForKg>