import { z } from "zod";

export const ticketSchema = z.object({
  id: z.number(),
  opened_by: z.object({
    id: z.number(),
    parent_name_arabic: z.string(),
    parent_name_english: z.string(),
  }),
  student: z.object({
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
  }),
  assigned_to: z.object({
    id: z.number(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
  }),
  ticket_responses: z.array(
    z.object({
      id: z.number(),
      generated_by_staff: z
        .object({
          id: z.number(),
          first_name: z.string(),
          last_name: z.string(),
          email: z.string(),
        })
        .nullable(),
      generated_by_parent: z
        .object({
          id: z.number(),
          parent_name_arabic: z.string(),
          parent_name_english: z.string(),
        })
        .nullable(),
      response: z.string(),
      created: z.string(),
    })
  ),
  title: z.string(),
  category: z.string(),
  sub_category: z.string(),
  issue: z.string(),
  status: z.string(),
  created: z.string(),
});

export type Ticket = z.infer<typeof ticketSchema>;
