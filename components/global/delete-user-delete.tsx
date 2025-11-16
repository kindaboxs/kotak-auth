"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

interface DeleteUserButtonProps {
  userId: string;
}

export const DeleteUserButton = ({ userId }: DeleteUserButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const onDeleteUser = async () => {
    startTransition(async () => {
      await authClient.admin.revokeUserSessions({
        userId,
        fetchOptions: {
          onError: (ctx) => {
            toast.error("Revoke user sessions failed.", {
              description: ctx.error.message,
            });
          },
        },
      });

      await authClient.admin.removeUser({
        userId,
        fetchOptions: {
          onSuccess: () => {
            toast.success("User and sessions deleted successfully.");
            router.refresh();
          },
          onError: (ctx) => {
            toast.error("Delete user failed.", {
              description: ctx.error.message,
            });
          },
        },
      });
    });
  };

  return (
    <Button
      size="icon-sm"
      variant="destructive"
      disabled={isPending}
      onClick={onDeleteUser}
    >
      <span className="sr-only">Delete User</span>
      <Trash2Icon />
    </Button>
  );
};

export const PlaceholderDeleteUserButton = () => {
  return (
    <Button size="icon-sm" variant="destructive" disabled>
      <span className="sr-only">Delete User</span>
      <Trash2Icon />
    </Button>
  );
};
