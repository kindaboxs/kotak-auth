import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { SignOutButtonProfile } from "@/components/global/sign-out-button-profile";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  return (
    <section className="container mx-auto max-w-svw space-y-8 px-4 py-8">
      <h1 className="text-3xl font-bold">Profile</h1>

      <SignOutButtonProfile />

      <pre className="overflow-clip text-sm">
        {JSON.stringify(session, null, 2)}
      </pre>
    </section>
  );
}
