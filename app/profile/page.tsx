import { headers } from "next/headers";
import Link from "next/link";

import { SignOutButtonProfile } from "@/components/global/sign-out-button-profile";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  const FULL_BLOG_ACCESS = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      userId: session.user.id,
      permission: {
        blogs: ["update", "delete"],
      },
    },
  });

  return (
    <section className="container mx-auto max-w-svw space-y-8 px-4 py-8">
      <h1 className="text-3xl font-bold">Profile</h1>

      <div className="flex items-center gap-2">
        {session?.user.role === "ADMIN" && (
          <Button size="sm" asChild>
            <Link href="/admin/dashboard">Admin Dashboard</Link>
          </Button>
        )}

        <SignOutButtonProfile />
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Permissions</h1>

        <div className="space-x-2">
          <Button size="sm">Manage Own Blogs</Button>
          <Button size="sm" disabled={!FULL_BLOG_ACCESS.success}>
            Manage All Blogs
          </Button>
        </div>
      </div>

      <pre className="overflow-clip text-sm">
        {JSON.stringify(session, null, 2)}
      </pre>
    </section>
  );
}
