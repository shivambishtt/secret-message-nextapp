import { z } from "zod"


export const verifySignInSchema = z.object({
    identifier: z.string(), //email or username
    password: z.string(),

})