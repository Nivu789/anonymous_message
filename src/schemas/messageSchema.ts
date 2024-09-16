import {z} from "zod"

export const messageSchema = z.object({
    content:z.string()
    .min(6,{message:"message must be atleast 6 characters long"})
    .max(300,{message:"message cannot exeed 300 characters"})
})