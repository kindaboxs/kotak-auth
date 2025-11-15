"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

export const GetStartedButton = () => {
  const { data: session, isPending } = authClient.useSession();

  const link = session ? "/profile" : "/sign-in";

  if (!session) {
    return (
      <Button disabled={isPending} asChild>
        <Link href={link}>Get Started</Link>
      </Button>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button disabled={isPending} asChild>
        <Link href={link}>Get Started</Link>
      </Button>

      {session && <p>Welcome back! {session.user.name} 👋</p>}
    </div>
  );
};
