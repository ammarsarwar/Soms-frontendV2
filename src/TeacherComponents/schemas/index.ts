/**
 * This file will contain schemas for all of the features inside admin dashboard
 * We will use normal typescript schemas for every from that is inside the dialog
 * Becuse shadcn as of now doesn't let you trigger the form when there is zod resolver
 * in the form, So on client we'll use regular interface to send data and on server we'll
 * use zod to validate, However we will use zod mostly in this file to make schemas and infer
 * their types to use them on frontend and backend validation.
 */
import * as z from "zod";

//Module: normal Dismissal
export const Dismissal = z.object({
  id: z.number(),
  attendance: z.string(),
  student_first_name_english: z.string(),
  student_middle_name_english: z.string(),
  student_last_name_english: z.string(),
  student_first_name_arabic: z.string(),
  student_middle_name_arabic: z.string(),
  student_last_name_arabic: z.string(),

  parent_name_arabic: z.string(),
  parent_name_english: z.string(),
  parent_email: z.string(),
  dismissal_request: z
    .object({
      id: z.number(),
      status: z.string(),
      dismissal_progress: z.string(),
    })
    .nullable(),
});

// Type exports
export type TDismissalNormalSchema = z.infer<typeof Dismissal>;
