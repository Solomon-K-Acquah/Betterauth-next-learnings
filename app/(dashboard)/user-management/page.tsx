import { updateProfile } from "@/app/actions/user";
import { auth } from "@/lib/auth";
import { authIsRequired, authSession } from "@/lib/auth-utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import UserManagementForm from "./user-client";

export default async function UpdateProfilePage() {
  await authIsRequired();

  const { users } = await auth.api.listUsers({
    query: {},
    headers: await headers(),
  });

  //get session
  const session = await authSession();

  //get has delete permissions
  const hasDeletePermission = await auth.api.userHasPermission({
    body: {
      userId: session?.user.id,
      permissions: {
        user: ["delete"],
      },
    },
  });

  const formattedUsers = users
    .map((user) => {
      return {
        id: user.id,
        name: user.name,
        role: user.role ?? "user",
        email: user.email,
        emailVerified: user.emailVerified,
        hasDeletePermission: hasDeletePermission.success,
      };
    })
    .filter((f) => ["user", "admin"].includes(f.role as string));

  // console.log("USER FROM DATABASE:", user);

  if (!users) redirect("/sign-in");

  return (
    <div className="w-full p-6 mx-auto max-w-7xl shadow-lg min-h-dvh rounded-2xl h-full flex gap-6 justify-center items-start">
      <UserManagementForm users={formattedUsers} />
    </div>
  );
}
