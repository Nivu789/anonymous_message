import sendVerificationEmail from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";


export async function POST(request:Request){
    await dbConnect()
    
    try {
        const {email,username,password} = await request.json()
        const userExist = await User.findOne({email})
        if(userExist && userExist.isVerified){
            return Response.json({
                success:false,
                message:"Email already in use"
            })
        }

        if(userExist && !userExist.isVerified){
            await User.findOneAndUpdate({email:email},{$set:{username:username,password:password}})
            return Response.json({
                success:true,
                message:"Created account successfully"
            })
        }

        await User.create({
            email,
            username,
            password
        })

        console.log("User created")

    } catch (error) {
        console.log("Error registering user")  
        return Response.json({
            success:false,
            message:"Couldn't register user"
        })  
    }
}