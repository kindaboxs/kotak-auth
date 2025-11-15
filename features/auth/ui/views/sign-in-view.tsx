import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthForm } from "@/features/auth/ui/components/auth-form";

export const SignInView = () => {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Sign In to Kotak Auth
          </CardTitle>
          <CardDescription>Welcome back! Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm type="sign-in" />
        </CardContent>

        <CardFooter className="w-full">
          <p className="w-full text-center text-sm">
            Don&apos;t have an account?{" "}
            <Button variant="link" className="px-2">
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
};
