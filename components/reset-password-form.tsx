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
import { useRouter, useSearchParams } from "next/navigation";

const formSchema = z
  .object({
    newPassword: z.string().min(6, "Invalid email"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Password do not match",
    path: ["confirmNewPassword"],
  });

export default function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  //Enable/Disable 2FA
  async function onSubmit({ newPassword }: z.infer<typeof formSchema>) {
    try {
      await authClient.resetPassword(
        { newPassword, token: token as string },
        {
          onSuccess: async () => {
            router.push("/");
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

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Reset your password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="reset-password"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FieldGroup>
            {/* Name */}
            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="text">New password</FieldLabel>

                  <Input
                    {...field}
                    type="password"
                    id="newPassword"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your new password"
                    autoComplete="newPassword"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="confirmNewPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="text">Confirm new password</FieldLabel>

                  <Input
                    {...field}
                    type="password"
                    id="confirmNewPassword"
                    aria-invalid={fieldState.invalid}
                    placeholder="Confirm password"
                    autoComplete="confirmNewPassword"
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
              form="reset-password"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Spinner className="size-6" />
              ) : (
                "Reset password"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
