"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckIcon,
  KeyRoundIcon,
  MailIcon,
  UserIcon,
  XCircleIcon,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import {
  signInSchema,
  signUpSchema,
  type SignInSchema,
  type SignUpSchema,
} from "@/features/auth/schemas";
import { authClient } from "@/lib/auth/client";

interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

export const AuthForm = ({ type = "sign-in" }: AuthFormProps) => {
  const [isPendingSignUp, startTransitionSignUp] = useTransition();
  const [isPendingSignIn, startTransitionSignIn] = useTransition();

  const router = useRouter();

  const formSignUp = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "all",
  });

  const formSignIn = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "all",
  });

  const onSubmitSignUp = async (data: SignUpSchema) => {
    startTransitionSignUp(async () => {
      await authClient.signUp.email({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Account has been created successfully.");
            formSignUp.reset();
            router.push("/profile");
          },

          onError: (ctx) => {
            toast.error("Account creation failed.", {
              description: ctx.error.message,
            });
          },
        },
      });
    });
  };

  const onSubmitSignIn = async (data: SignInSchema) => {
    startTransitionSignIn(async () => {
      await authClient.signIn.username({
        username: data.username,
        password: data.password,
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in successfully.");
            formSignIn.reset();
            router.push("/profile");
          },

          onError: (ctx) => {
            toast.error("Sign in failed.", {
              description: ctx.error.message,
            });
          },
        },
      });
    });
  };

  if (type === "sign-up") {
    return (
      <form
        id="sign-up-account"
        onSubmit={formSignUp.handleSubmit(onSubmitSignUp)}
      >
        <FieldGroup className="gap-6">
          <Controller
            name="name"
            control={formSignUp.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={isPendingSignUp}
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />
                  <InputGroupAddon>
                    <UserIcon />
                  </InputGroupAddon>
                  {fieldState.invalid ? (
                    <InputGroupAddon
                      align="inline-end"
                      className="text-destructive"
                    >
                      <XCircleIcon />
                    </InputGroupAddon>
                  ) : (
                    field.value.length > 0 && (
                      <InputGroupAddon align="inline-end">
                        <CheckIcon />
                      </InputGroupAddon>
                    )
                  )}
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="username"
            control={formSignUp.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={isPendingSignUp}
                    type="text"
                    placeholder="Enter your username"
                    autoComplete="username"
                  />
                  <InputGroupAddon>
                    <UserIcon />
                  </InputGroupAddon>
                  {fieldState.invalid ? (
                    <InputGroupAddon
                      align="inline-end"
                      className="text-destructive"
                    >
                      <XCircleIcon />
                    </InputGroupAddon>
                  ) : (
                    field.value.length > 0 && (
                      <InputGroupAddon align="inline-end">
                        <CheckIcon />
                      </InputGroupAddon>
                    )
                  )}
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={formSignUp.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={isPendingSignUp}
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                  <InputGroupAddon>
                    <MailIcon />
                  </InputGroupAddon>
                  {fieldState.invalid ? (
                    <InputGroupAddon
                      align="inline-end"
                      className="text-destructive"
                    >
                      <XCircleIcon />
                    </InputGroupAddon>
                  ) : (
                    field.value.length > 0 && (
                      <InputGroupAddon align="inline-end">
                        <CheckIcon />
                      </InputGroupAddon>
                    )
                  )}
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={formSignUp.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={isPendingSignUp}
                    type="password"
                    placeholder="********"
                    autoComplete="new-password"
                  />
                  <InputGroupAddon>
                    <KeyRoundIcon />
                  </InputGroupAddon>
                  {fieldState.invalid ? (
                    <InputGroupAddon
                      align="inline-end"
                      className="text-destructive"
                    >
                      <XCircleIcon />
                    </InputGroupAddon>
                  ) : (
                    field.value.length > 0 && (
                      <InputGroupAddon align="inline-end">
                        <CheckIcon />
                      </InputGroupAddon>
                    )
                  )}
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="confirmPassword"
            control={formSignUp.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={isPendingSignUp}
                    type="password"
                    placeholder="********"
                    autoComplete="new-password"
                  />
                  <InputGroupAddon>
                    <KeyRoundIcon />
                  </InputGroupAddon>
                  {fieldState.invalid ? (
                    <InputGroupAddon
                      align="inline-end"
                      className="text-destructive"
                    >
                      <XCircleIcon />
                    </InputGroupAddon>
                  ) : (
                    field.value.length > 0 && (
                      <InputGroupAddon align="inline-end">
                        <CheckIcon />
                      </InputGroupAddon>
                    )
                  )}
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <Button
          type="submit"
          form="sign-up-account"
          disabled={!formSignUp.formState.isValid || isPendingSignUp}
          className="mt-6 w-full"
        >
          {isPendingSignUp ? (
            <>
              <Spinner /> Signing up
            </>
          ) : (
            "Sign up"
          )}
        </Button>
      </form>
    );
  }

  return (
    <form
      id="sign-in-account"
      onSubmit={formSignIn.handleSubmit(onSubmitSignIn)}
    >
      <FieldGroup className="gap-6">
        <Controller
          name="username"
          control={formSignIn.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-2">
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  disabled={isPendingSignIn}
                  type="text"
                  placeholder="Enter your username"
                  autoComplete="username"
                />
                <InputGroupAddon>
                  <UserIcon />
                </InputGroupAddon>
                {fieldState.invalid ? (
                  <InputGroupAddon
                    align="inline-end"
                    className="text-destructive"
                  >
                    <XCircleIcon />
                  </InputGroupAddon>
                ) : (
                  field.value.length > 0 && (
                    <InputGroupAddon align="inline-end">
                      <CheckIcon />
                    </InputGroupAddon>
                  )
                )}
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={formSignIn.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-2">
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  disabled={isPendingSignIn}
                  type="password"
                  placeholder="********"
                  autoComplete="current-password"
                />
                <InputGroupAddon>
                  <KeyRoundIcon />
                </InputGroupAddon>
                {fieldState.invalid ? (
                  <InputGroupAddon
                    align="inline-end"
                    className="text-destructive"
                  >
                    <XCircleIcon />
                  </InputGroupAddon>
                ) : (
                  field.value.length > 0 && (
                    <InputGroupAddon align="inline-end">
                      <CheckIcon />
                    </InputGroupAddon>
                  )
                )}
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        form="sign-in-account"
        disabled={!formSignIn.formState.isValid || isPendingSignIn}
        className="mt-6 w-full"
      >
        {isPendingSignIn ? (
          <>
            <Spinner /> Signing in
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
};
