import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import { NextAuthOptions } from "next-auth";
import User from "@/models/userModel";
import bcrypt from 'bcryptjs';


const authOptions:NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id:'credentials',
            name:'Credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials:any):Promise<any>{
                await dbConnect()
                try {
                    const user = await User.findOne({
                        $or:[
                            {email:credentials.identifier.email},
                            {username:credentials.identifier.username}
                        ]
                    })

                    if(user){

                        if(!user.isVerified){
                            throw new Error('Account not yet verified')
                        }else{
                            const passCheck = await bcrypt.compare(credentials.password,user.password)
                            if(!passCheck){
                                throw new Error('Wrong credentials')
                            }else{
                                return user
                            }
                        }

                    }else{
                        throw new Error('No user with that email found')
                    }
                } catch (error:any) {
                    throw new Error(error)
                }
                
              }
        })
    ],
    pages:{
        signIn:'/api/sign-in'
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET
}
