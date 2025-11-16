import { headers } from "next/headers";

import {
  DeleteUserButton,
  PlaceholderDeleteUserButton,
} from "@/components/global/delete-user-delete";
import { ReturnButton } from "@/components/global/return-button";
import { UserRoleselect } from "@/components/global/user-role-select";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import type { UserRole } from "@/lib/generated/prisma/enums";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  if (session.user.role !== "ADMIN") {
    return (
      <section className="container mx-auto max-w-svw space-y-8 px-4 py-8">
        <div className="space-y-8">
          <ReturnButton href="/profile" label="Profile" />

          <h1 className="text-3xl font-bold">Dashboard</h1>

          <Badge variant="destructive">FORBIDDEN</Badge>
        </div>
      </section>
    );
  }

  const { users } = await auth.api.listUsers({
    headers: await headers(),
    query: {
      sortBy: "name",
    },
  });

  const sortedUsers = users.sort((a, b) => {
    if (a.role === "ADMIN" && b.role !== "ADMIN") return -1;
    if (a.role !== "ADMIN" && b.role === "ADMIN") return 1;
    return 0;
  });

  return (
    <section className="container mx-auto max-w-svw space-y-8 px-4 py-8">
      <div className="space-y-8">
        <ReturnButton href="/profile" label="Profile" />

        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <Badge
          variant="default"
          className="border-transparent bg-green-500 text-white focus-visible:ring-green-500/20 dark:bg-green-500/60 dark:focus-visible:ring-green-500/40 [a&]:hover:bg-green-500/90"
        >
          ACCESS GRANTED
        </Badge>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full table-auto whitespace-nowrap">
          <thead>
            <tr className="border-b text-left text-sm">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2 text-center">Role</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user.id} className="border-b text-left text-sm">
                <td className="p-2">{user.id.slice(0, 8)}</td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="flex justify-center p-2">
                  <UserRoleselect
                    userId={user.id}
                    role={user.role as UserRole}
                  />
                </td>
                <td className="p-2 text-center">
                  {user.role === "ADMIN" || user.id === session.user.id ? (
                    <PlaceholderDeleteUserButton />
                  ) : (
                    <DeleteUserButton userId={user.id} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
