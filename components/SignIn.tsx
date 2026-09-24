"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "./ui/spinner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //Sign in function
  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: async () => {
            const { error } = await authClient.twoFactor.sendOtp({});

            if (error) {
              toast.error(error.message);
            }

            router.push("/two-factor");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      );
    } catch {
      throw new Error("Something went wrong");
    }
  }

  //Sign in with google
  const signInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  //Sign in with Github
  const signInWithGithub = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
    });
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Sign In
        </CardTitle>

        <CardDescription className="text-center">
          Enter your email to sign in.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="signin-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FieldGroup>
            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>

                  <Input
                    {...field}
                    type="email"
                    id="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>

                  <Input
                    {...field}
                    type="password"
                    id="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-6">
        {/* Sign In */}
        <div className="w-full">
          <Button
            type="submit"
            form="signin-form"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Spinner className="size-5" />
            ) : (
              "Sign In"
            )}
          </Button>
        </div>

        {/* Forgot Password */}
        <Link
          href="/request-password"
          className="text-sm font-medium text-primary hover:underline"
        >
          Forgot password?
        </Link>

        {/* Divider */}
        <div className="flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-border" />

          <span className="text-xs font-medium text-muted-foreground">OR</span>

          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Social Login */}
        <div className="flex w-full flex-col gap-3">
          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            className="w-full gap-3"
            onClick={signInWithGoogle}
          >
            {/* Google Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-5"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M21.35 12.23c0-.79-.07-1.55-.22-2.28H12v4.31h5.24a4.48 4.48 0 0 1-1.95 2.94v2.45h3.16c1.85-1.7 2.9-4.2 2.9-7.42Z"
              />

              <path
                fill="#34A853"
                d="M12 21.5c2.64 0 4.86-.87 6.48-2.35l-3.16-2.45c-.87.58-1.98.92-3.32.92-2.55 0-4.71-1.72-5.49-4.03H3.25v2.53A9.78 9.78 0 0 0 12 21.5Z"
              />

              <path
                fill="#FBBC05"
                d="M6.51 13.59A5.88 5.88 0 0 1 6.2 12c0-.55.11-1.09.31-1.59V7.88H3.25A9.5 9.5 0 0 0 2.25 12c0 1.53.37 2.97 1 4.12l3.26-2.53Z"
              />

              <path
                fill="#EA4335"
                d="M12 6.38c1.44 0 2.73.5 3.75 1.48l2.81-2.81C16.85 3.46 14.63 2.5 12 2.5a9.78 9.78 0 0 0-8.75 5.38l3.26 2.53c.78-2.31 2.94-4.03 5.49-4.03Z"
              />
            </svg>

            <span>Continue with Google</span>
          </Button>

          {/* GitHub Sign In */}
          <Button
            type="button"
            variant="outline"
            className="w-full gap-3"
            onClick={signInWithGithub}
          >
            {/* GitHub Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-5"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.166 6.839 9.49.5.092.682-.217.682-.483
            0-.237-.009-.866-.014-1.699-2.782.604-3.369-1.341-3.369-1.341-.455-1.157-1.11-1.466-1.11-1.466
            -.908-.621.069-.608.069-.608 1.004.07 1.531 1.032 1.531 1.032.892 1.529 2.341 1.087
            2.91.831.092-.646.35-1.087.636-1.338-2.22-.253-4.555-1.11-4.555-4.944
            0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647
            0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337
            c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647
            .64.699 1.028 1.592 1.028 2.683 0 3.843-2.339 4.687-4.566 4.935
            .359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743
            0 .269.18.58.688.482A10.001 10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z"
              />
            </svg>

            <span>Continue with GitHub</span>
          </Button>
        </div>

        {/* Sign Up */}
        <p className="text-center text-sm text-muted-foreground">
          Do not have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-primary hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
