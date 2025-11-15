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

      {session && (
        <p className="flex items-center gap-2">
          <span
            data-role={session.user.role}
            className="size-3 animate-pulse rounded-full data-[role=ADMIN]:bg-red-500 data-[role=USER]:bg-green-500"
          />
          Welcome back! {session.user.name} 👋
        </p>
      )}
    </div>
  );
};
