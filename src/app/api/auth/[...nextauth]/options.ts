import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import { NextAuthOptions } from "next-auth";
import User from "@/models/userModel";
import bcrypt from 'bcryptjs';

export const authOptions:NextAuthOptions = {
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
        signIn:'/sign-in'
    },
    session:{
        strategy:"jwt"
    },
    callbacks:{
        jwt:({token,user})=>{
            if(user){
                token._id = user._id?.toString()
                token.isAcceptingMessages = user.isAcceptingMessages
                token.isVerified = user.isVerified
                token.username = user.username
            }
            return token
        },
        session:({token,session})=>{
            if(token){
                session.user._id = token._id
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.isVerified = token.isVerified
                session.user.username = token.username
            }
            return session
        }
    },
    secret:process.env.NEXTAUTH_SECRET
}
