"use server";

import { authSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function updateProfile() {
  //get user session
  const session = await authSession();

  //check if user exist
  if (!session) {
    throw new Error("Unauthorize");
  }

  //otherwise get user details
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      name: true,
      image: true,
      twoFactorEnabled: true,
    },
  });

  return user;
}
