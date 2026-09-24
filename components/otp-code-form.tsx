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

const formSchema = z.object({
  code: z.string().min(6, "Invalid code"),
});

export default function OtpCodeForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  //Enable/Disable 2FA
  async function onSubmit({ code }: z.infer<typeof formSchema>) {
    try {
      await authClient.twoFactor.verifyOtp(
        { code },
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
          Enter your OTP code
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="two-factor-code"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FieldGroup>
            {/* Name */}
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="text">OTP Code</FieldLabel>

                  <Input
                    {...field}
                    type="text"
                    id="code"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your OTP code"
                    autoComplete="code"
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
              form="two-factor-code"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Spinner className="size-6" />
              ) : (
                "Verify OTP"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
