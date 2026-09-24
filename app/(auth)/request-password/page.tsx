import RequestPasswordForm from "@/components/request-password-form";
import { authIsNotRequired } from "@/lib/auth-utils";

export default async function ForgotPasswordPage() {
  await authIsNotRequired();
  return <RequestPasswordForm />;
}
