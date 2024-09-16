import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export default async function sendVerificationEmail(
  email:string,
  username:string,
  verifyCode:string
):Promise<ApiResponse>{
  try {

    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Anonymous_Message | Verification Code',
      react: VerificationEmail({ username,otp:verifyCode }),
    });

    return {
      success:true,
      message:"Email send successfully"
    }
  } catch (error) {
    console.log("Error sending email")
    return {
      success:false,
      message:"Email not send successfully"
    }
  }
} 