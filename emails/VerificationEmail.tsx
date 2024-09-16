import { Html, Button } from "@react-email/components";

interface Email {
  username:string;
  otp:string;
}

const VerificationEmail = ({username,otp}:Email) => {
  return (
    <Html lang="en" dir="ltr">
      Hello {username}, your Verification code - {otp}
      <Button href="https://example.com" style={{ color: "#61dafb" }}>
        Click here to verify your account
      </Button>
    </Html>
  );
};

export default VerificationEmail;