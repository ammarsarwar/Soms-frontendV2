import { z } from "zod";


// types for get selected techers usinf campus id 
const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});

export const filteredTeachersWithRoleSchema =
  z.object({
    id: z.number(),
    user: userSchema,
    created_by: userSchema,
    userRole: z.string(),
    created_at: z.string(),
    school: z.number(),
    branch: z.number(),
    campus: z.number(),
    department: z.nullable(z.unknown()),
  })

  export type TFilteredTeachersWithRoleSchema = z.infer<typeof filteredTeachersWithRoleSchema>
  
  
  