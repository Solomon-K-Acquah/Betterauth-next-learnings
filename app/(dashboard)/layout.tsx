"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React from "react";

function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  //sign out function
  async function signOut() {
    await authClient.signOut();

    router.push("/");
    router.refresh();
  }
  return (
    <div className="w-full min-h-dvh min-w-dvw bg-white overflow-hidden">
      <nav className="w-full flex h-16 justify-end items-center pr-6 shadow-lg mx-auto max-w-7xl mb-6 overflow-hidden bg-neutral-50 rounded-md">
        <Button className="cursor-pointer" onClick={signOut}>
          Sign Out
        </Button>
      </nav>
      {children}
    </div>
  );
}

export default Layout;
