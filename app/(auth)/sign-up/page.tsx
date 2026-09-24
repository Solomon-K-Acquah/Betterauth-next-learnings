import SignUp from "@/components/SignUp";
import { authIsNotRequired } from "@/lib/auth-utils";

export default async function SignUpPage() {
  await authIsNotRequired();
  return <SignUp />;
}
