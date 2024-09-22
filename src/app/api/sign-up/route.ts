import  generateOtp  from "@/helpers/generateOtp";
import sendVerificationEmail from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";
import bcrypt from 'bcryptjs';


export async function POST(request:Request){
    await dbConnect()
    
    try {
        const {email,username,password} = await request.json()
        const userExist = await User.findOne({email})


        //user exist and user is verified - cannot create account with this credentials

        if(userExist && userExist.isVerified){
            return Response.json({
                success:false,
                message:"Email already in use"
            })
        }

        const verifyCode = await generateOtp()

        const hashedPassword = await bcrypt.hash(password,10)

        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours()+1)

        //user exist and user is not verified - create account with this credentials and update verification code

        if(userExist && !userExist.isVerified){
            await User.findOneAndUpdate({email},{$set:{username,password:hashedPassword,verifyCode,verifyCodeExpiry:expiryDate}})
            const verifyEmail = await sendVerificationEmail(email,username,verifyCode)
            
            if(verifyEmail.success){
                return Response.json({
                    success:true,
                    message:"Verification email send - verify account"
                })
            }
        
        }

        //user does not exist - can create account

        if(!userExist){
            await User.create({
                email,
                username,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate
            })

            const verifyEmail = await sendVerificationEmail(email,username,verifyCode)
            
            if(verifyEmail.success){
                return Response.json({
                    success:true,
                    message:"Verification email send - verify account"
                })
            }
        }


    } catch (error) {
        console.log("Error registering user")  
        console.log(error)
        return Response.json({
            success:false,
            message:"Couldn't register user"
        })  
    }
}