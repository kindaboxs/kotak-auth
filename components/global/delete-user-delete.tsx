"use client";

import { useTransition } from "react";

import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface DeleteUserButtonProps {
  userId: string;
}

export const DeleteUserButton = ({ userId }: DeleteUserButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const onDeleteUser = async () => {
    startTransition(async () => {});
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
