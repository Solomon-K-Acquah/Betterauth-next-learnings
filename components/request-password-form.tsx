"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { authClient } from "@/lib/auth-client";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  email: z.email("Invalid email"),
});

export default function RequestPasswordForm() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit({ email }: z.infer<typeof formSchema>) {
    try {
      const { data, error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (data?.status) {
        toast.success("An email has been sent to you");
        setIsEmailSent(true);
        router.refresh();
      }

      if (error) {
        toast.error(error.message);
        setIsEmailSent(false);
      }
    } catch {
      throw new Error("Something went wrong");
    }
  }

  return (
    <>
      {isEmailSent ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Check your email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex w-full p-6">
              A password reset ling has been sent to your email.
            </div>
            <Button
              onClick={() => {
                router.push("/sign-in");
              }}
            >
              Back to sign in
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Reset your password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="request-password"
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FieldGroup>
                {/* Name */}
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="text">Email</FieldLabel>

                      <Input
                        {...field}
                        type="email"
                        id="code"
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
              </FieldGroup>

              <div className="ml-auto">
                <Button
                  type="submit"
                  className="cursor-pointer"
                  form="request-password"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <Spinner className="size-6" />
                  ) : (
                    "Request password"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
