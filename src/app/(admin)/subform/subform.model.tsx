import { z } from "zod";

export const subformSchema = z.object({
    name: z.string().trim().min(2).regex(/^[^\d]*$/),
    email: z.string().trim().email(),
    address: z.object({
        type: z.string().min(1),
        name: z.string().min(1),
        moo: z.string().min(1),
        district: z.string().min(1),
        sub_district: z.string().min(1),
    }).array().min(1)
})

export type SubFormValue = z.infer<typeof subformSchema>