import { z } from "zod";

const academicYearSchema = z.object({
  id: z.number(),
  start_year: z.number(),
  end_year: z.number(),
  status: z.string(),
  created: z.string(),
  school: z.number(),
});

const campusSchema = z.object({
  id: z.number(),
  name: z.string(),
  branch: z.object({
    id: z.number(),
    name: z.string(),
    school: z.object({
      id: z.number(),
      name: z.string(),
    }),
  }),
});

const departmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  campus: campusSchema,
});

const gradeSchema = z.object({
  id: z.number(),
  name: z.string(),
  academic_year: academicYearSchema.nullable(),
  department: departmentSchema,
});

const sectionNewSchema = 
  z.object({
    id: z.number(),
    grade: gradeSchema,
    home_room_teacher: z.nullable(z.unknown()),
    name: z.string(),
    max_no_of_student: z.number(),
    created: z.string(),
  })

  export type TSectionNewSchema = z.infer<typeof sectionNewSchema>


  //schema for students

  //comented some schemas as we have already defined it above

// Define sub-schemas for nested objects
// const academicYearSchema = z.object({
//   id: z.number(),
//   start_year: z.number(),
//   end_year: z.number(),
//   status: z.string(),
//   created: z.string(),
//   school: z.number(),
// });

// const campusSchema = z.object({
//   id: z.number(),
//   name: z.string(),
//   branch: z.object({
//     id: z.number(),
//     name: z.string(),
//     school: z.object({
//       id: z.number(),
//       name: z.string(),
//     }),
//   }),
// });

// const departmentSchema = z.object({
//   id: z.number(),
//   name: z.string(),
//   campus: campusSchema,
// });

// const gradeSchema = z.object({
//   id: z.number(),
//   academic_year: academicYearSchema,
//   department: departmentSchema,
//   name: z.string(),
//   level_number: z.nullable(z.number()),
//   grading_criteria: z.string(),
//   number_of_sections: z.nullable(z.number()),
//   created: z.string(),
// });

const sectionSchema = z.object({
  id: z.number(),
  grade: gradeSchema,
  home_room_teacher: z.nullable(z.unknown()), // You may need to define the actual type for home_room_teacher
  name: z.string(),
  max_no_of_student: z.number(),
  created: z.string(),
});

const branchSchema = z.object({
  id: z.number(),
  name: z.string(),
  school: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

const parentDataSchema = z.object({
  parent_name_arabic: z.string(),
  parent_name_english: z.string(),
});

const studentDataSchema = z.object({
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

// Define the main schema for the API response
export const studentAttendenceSchema = z.object({
  id: z.number(),
  section: sectionSchema,
  campus: campusSchema,
  applied_grade: gradeSchema,
  parentData: parentDataSchema,
  studentData: studentDataSchema,
  status: z.string(),
  created_at: z.string(),
  student: z.number(),
});

export type TStudentAttendenceSchema = z.infer<typeof studentAttendenceSchema>


// schema for post attendence

export const postAttendenceSchema = z.object({
  course: z.number(),
  student: z.number(),
  status: z.string(),
})

export type TPostAttendenceSchema = z.infer<typeof postAttendenceSchema>


//optimized attendece type

const attendanceSchema = z.object({
  status: z.string(z.enum(["Present","Absent","Late","Excused"])),
});

const optimizedStudentAttendenceSchema = z.object({
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
  attendance: attendanceSchema.nullable()
});

export type TOptimizedStudentAttendenceSchema = z.infer<typeof optimizedStudentAttendenceSchema>