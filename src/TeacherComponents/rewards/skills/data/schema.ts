import { z } from "zod";

const SkillsSchema = z.object({
  id: z.number(),
  name: z.string(),
  points: z.number(),
  icon: z.string().nullable(),
});

export type Skills = z.infer<typeof SkillsSchema>;
