"use client";

import { useTransition } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/client";

export const SignInOauthButton = () => {
  const [isPendingGoogle, startTransitionGoogle] = useTransition();
  const [isPendingGithub, startTransitionGithub] = useTransition();

  const onSignInGoogle = () =>
    startTransitionGoogle(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in with Google successfully.");
          },
          onError: (ctx) => {
            toast.error("Sign in with Google failed.", {
              description: ctx.error.message,
            });
          },
        },
      });
    });

  const onSignInGithub = () =>
    startTransitionGithub(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in with Github successfully.");
          },
          onError: (ctx) => {
            toast.error("Sign in with Github failed.", {
              description: ctx.error.message,
            });
          },
        },
      });
    });

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button
        variant="outline"
        disabled={isPendingGoogle}
        onClick={onSignInGoogle}
      >
        {isPendingGoogle ? (
          <>
            <Spinner />
            <span>Google</span>
          </>
        ) : (
          <span>Google</span>
        )}
      </Button>
      <Button
        variant="outline"
        disabled={isPendingGithub}
        onClick={onSignInGithub}
      >
        {isPendingGithub ? (
          <>
            <Spinner />
            <span>Github</span>
          </>
        ) : (
          <span>Github</span>
        )}
      </Button>
    </div>
  );
};
