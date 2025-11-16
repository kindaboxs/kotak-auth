"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth/client";
import type { UserRole } from "@/lib/generated/prisma/enums";

interface UserRoleselectProps {
  userId: string;
  role: UserRole;
}

export const UserRoleselect = ({ userId, role }: UserRoleselectProps) => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const onRoleChange = (role: UserRole) => {
    startTransition(async () => {
      const { error } = await authClient.admin.hasPermission({
        permission: {
          user: ["set-role"],
        },
      });

      if (error) {
        toast.error("You don't have permission to update role.", {
          description: error.message,
        });
        return;
      }

      await authClient.admin.setRole({
        role,
        userId,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Role updated successfully.");
            router.refresh();
          },
          onError: (ctx) => {
            toast.error("Failed to update role.", {
              description: ctx.error.message,
            });
          },
        },
      });
    });
  };

  return (
    <Select value={role} onValueChange={onRoleChange} disabled={isPending}>
      <SelectTrigger className="w-fit">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Role</SelectLabel>
          {["USER", "ADMIN"].map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
