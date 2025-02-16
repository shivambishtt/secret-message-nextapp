import { z } from "zod"


export const accpetMessageSchemaValidation = z.object({
    isAcceptingMessages: z.boolean()
})