import { z } from "zod";

 const TeacherSchema = z.object({
   id: z.number(),
   email: z.string(),
   first_name: z.string(),
   last_name: z.string(),
   status: z.string(),
 });

const AdmissionCalendarSchema = z.object({
  id: z.number(),
  start_date: z.string(),
  end_date: z.string(),
  status: z.string(),
  academic_year: z.number(),
});

const EventSchema = z.object({
  id: z.number(),
  available: z.boolean(),
  date: z.string(),
  department: z.string(),
  end_time: z.string(),
  start_time: z.string(),
  max_students: z.number(),
  teacher: TeacherSchema,
  admission_calendar: AdmissionCalendarSchema,
});

export type TEventSchema = z.infer<typeof EventSchema>;

// const TransformedEvent = z.object({

//   start: z.string(),
//   available: z.string(),
//   end: z.string(),
//   selectedDate: z.string(),
//   allDay: z.string(),
//   id: z.string(),
//   department: z.string(),
//   numberOfStudents: z.string(),
//   teacherName: z.string(),
//   calendarName: z.string(),
// });

// export type TTransformedEvent = z.infer<typeof TransformedEvent>;
