"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { authClient } from "@/lib/auth-client";
import { Switch } from "./ui/switch";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useRouter } from "next/navigation";

interface ToggleOtpFormProps {
  twoFactorEnabled: boolean;
}

const formSchema = z.object({
  password: z.string().min(6, "Invalid password"),
});

export default function ToggleOtpForm({
  twoFactorEnabled,
}: ToggleOtpFormProps) {
  const router = useRouter();
  //open dialog
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  //Enable/Disable 2FA
  async function onSubmit({ password }: z.infer<typeof formSchema>) {
    try {
      if (twoFactorEnabled) {
        const { error } = await authClient.twoFactor.disable({
          password,
        });

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success("Two factor authentication disabled");
      } else {
        const { error } = await authClient.twoFactor.enable({
          password,
          method: "otp",
        });

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success("Two factor authentication enabled");
      }

      form.reset();
      setIsOpen(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  const handleChange = () => {
    setIsOpen(true);
  };

  return (
    <Card className="w-full max-w-sm border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Enable/Disable Two Factor Auth
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between border p-4">
          <span className="text-black">
            {twoFactorEnabled ? "Disable" : "Enable"} Two Factor Auth
          </span>

          <Switch checked={twoFactorEnabled} onCheckedChange={handleChange} />
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {!twoFactorEnabled
                  ? "Enable two factor authentication"
                  : "Disable two factor authentication"}
              </DialogTitle>

              <DialogDescription>
                Please, confirm your password to{" "}
                {!twoFactorEnabled ? "enable" : "disable"} 2FA in your account.
              </DialogDescription>
            </DialogHeader>

            <form
              id="toggle-otp-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FieldGroup>
                {/* Name */}
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
                        autoComplete="password"
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
                  form="toggle-otp-form"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <Spinner className="size-6" />
                  ) : !twoFactorEnabled ? (
                    "Enable 2FA"
                  ) : (
                    "Disable 2FA"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
