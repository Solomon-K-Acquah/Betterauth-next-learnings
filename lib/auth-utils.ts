import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

//get authenticated user
export const authSession = async () => {
  try {
    //get session
    const session = auth.api.getSession({ headers: await headers() });

    if (!session) {
      throw new Error("Unauthorized: No valid session found");
    }

    return session;
  } catch {
    throw new Error("Authentication failed");
  }
};

//require user to authenticate
export const authIsRequired = async () => {
  const session = await authSession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
};

//When user doesn't require authentication
export const authIsNotRequired = async () => {
  const session = await authSession();

  if (session) {
    redirect("/");
  }
};
