"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "./ui/spinner";
import { authClient } from "@/lib/auth-client";
import dynamic from "next/dynamic";

const ImageUpload = dynamic(() => import("@/components/upload-image"), {
  ssr: false,
});

// import ImageUpload from "./upload-image";

interface ProfileFormProps {
  email: string;
  name: string;
  image: string;
  twoFactorEnabled: boolean;
}

const formSchema = z.object({
  email: z.email("Enter a valid email"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  image: z.string("Image is required"),
});

export default function UpdateProfile({
  email,
  name,
  image,
  twoFactorEnabled,
}: ProfileFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
      name,
      image,
    },
  });

  //Sign in function
  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await authClient.updateUser(
        {
          name: data.name,
          image: data.image,
        },
        {
          onSuccess: async () => {
            toast.success("Profile updated successfully");
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
    <Card className="w-full max-w-sm border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Update your details
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          id="update-profile"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FieldGroup>
            {/* Name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>

                  <Input
                    {...field}
                    type="text"
                    id="name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your name"
                    autoComplete="name"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

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
                    disabled
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Image */}
            <Controller
              name="image"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="image">Image</FieldLabel>

                  <ImageUpload
                    endpoint="imageUploader"
                    defaultUrl={field.value}
                    onChange={(url) => {
                      field.onChange(url);
                    }}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <Button
            type="submit"
            className="cursor-pointer max-w-40 self-end"
            form="update-profile"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Spinner className="size-6" />
            ) : (
              "Update profile"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
