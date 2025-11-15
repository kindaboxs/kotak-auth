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

export const SignUpView = () => {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Create a Kotak Auth Account
          </CardTitle>
          <CardDescription>
            Welcome! Create an account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm type="sign-up" />
        </CardContent>

        <CardFooter className="w-full">
          <p className="w-full text-center text-sm">
            Already have an account?{" "}
            <Button variant="link" className="px-2">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
};
