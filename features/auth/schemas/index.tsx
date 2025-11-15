import * as z from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(1, { error: "Name is required" }).max(255, {
      error: "Name must be at most 255 characters long",
    }),
    username: z.string().min(1, { error: "Username is required" }).max(255, {
      error: "Username must be at most 255 characters long",
    }),
    email: z.email({ error: "Invalid email format" }),
    password: z.string().min(8, {
      error: "Password must be at least 8 characters long",
    }),
    confirmPassword: z.string().min(1, {
      error: "Confirm password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = signUpSchema.pick({
  username: true,
  password: true,
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
