import ResetPasswordEmail from "@/emails/request-password-email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type sendResetPasswordEmailProps = {
  to: string;
  subject: string;
  url: string;
};

export const sendResetPasswordEmail = async ({
  to,
  subject,
  url,
}: sendResetPasswordEmailProps) => {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject,
    react: <ResetPasswordEmail url={url} to={to} />,
  });
};
