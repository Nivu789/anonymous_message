import {z} from "zod";

export const usernameSchema = z.string().min(4).max(10)

export const signupSchema = z.object({
    username:usernameSchema,
    email:z.string().email({message:"Invalid email"}),
    password:z.string().min(6,{message:"password must be atleast 6 characters"})
})