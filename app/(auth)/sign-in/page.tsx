import SignIn from "@/components/SignIn";
import { authIsNotRequired } from "@/lib/auth-utils";

export default async function SignInPage() {
  await authIsNotRequired();
  return <SignIn />;
}
