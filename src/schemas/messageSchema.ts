import { z } from "zod"


export const messageSchemValidation = z.object({
    content: z.string()
        .min(10, "Content must be atleast 10 characters")
        .max(300, "Content must not exceed 300 characters")

})