"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

export const SignOutButtonProfile = () => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const onSignOut = async () => {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully.");
            router.push("/sign-in");
          },

          onError: (ctx) => {
            toast.error("Sign out failed.", {
              description: ctx.error.message,
            });
          },
        },
      });
    });
  };
  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={onSignOut}
      disabled={isPending}
    >
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  );
};
