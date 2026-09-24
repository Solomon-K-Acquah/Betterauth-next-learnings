"use client";

import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@base-ui/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { UserProps, useUsers } from "@/hooks/use-user";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table";
import { columns } from "@/app/users/columns";

const ROLE_OPTIONS = ["user", "admin", "superadmin"] as const;
type Role = (typeof ROLE_OPTIONS)[number];

const formSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.email("Email is required"),
  role: z.enum(ROLE_OPTIONS, "Role is required"),
  password: z.string().min(6, "Password is required").optional(),
});

export default function UserManagementForm({ users }: { users: UserProps[] }) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: undefined,
    },
  });

  const { isOpen, setIsOpen, user, setUser } = useUsers();

  //fill form values
  useEffect(() => {
    if (user) {
      form.setValue("name", user.name);
      form.setValue("email", user.email);

      // get role
      const role = ROLE_OPTIONS.find((r) => r === user.role);

      if (role) {
        form.setValue("role", role);
      } else {
        form.setValue("role", "user");
      }
    }
  }, [user, form]);

  //handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      /*
       * CREATE USER
       */
      if (!user?.id) {
        const { data, error } = await authClient.admin.createUser({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
        });

        if (error) {
          console.error("Create user error:", error);

          toast.error(error.message || "Failed to create user");

          return;
        }

        console.log("User successfully created:", data);

        toast.success("New user created successfully");
      }

      /*
       * UPDATE USER
       */
      else {
        const { data, error } = await authClient.admin.updateUser({
          userId: user.id,

          data: {
            name: values.name,
            email: values.email,
            role: values.role,
          },
        });

        if (error) {
          console.error("Update user error:", error);

          toast.error(error.message || "Failed to update user");

          return;
        }

        console.log("User successfully updated:", data);

        toast.success("User updated successfully");
      }

      /*
       * Only reset after SUCCESS
       */
      setIsOpen(false);

      form.reset();

      setUser({
        id: "",
        name: "",
        role: "",
        email: "",
        emailVerified: false,
        hasDeletePermission: false,
      });

      /*
       * Refresh the server component
       * so the newly created user appears
       * in the table.
       */
      router.refresh();
    } catch (error) {
      console.error("User management error:", error);

      toast.error("Something went wrong while saving the user.");
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(isOpen) => {
          setIsOpen(isOpen);

          if (!isOpen) {
            form.reset();

            setUser({
              id: "",
              name: "",
              role: "",
              email: "",
              emailVerified: false,
              hasDeletePermission: false,
            });
          }
        }}
      >
        <DialogContent className="sm:max-w-125 p-0 overflow-hidden rounded-xl">
          {/* Header */}
          <DialogHeader className="border-b px-6 py-5">
            <DialogTitle className="text-xl font-semibold">
              {user?.id ? "Edit user" : "Create user"}
            </DialogTitle>
          </DialogHeader>

          {/* Form */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="user-management-form"
            className="px-6 py-6"
          >
            <FieldGroup className="gap-5">
              {/* Name */}
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name" className="mb-1.5">
                      Name
                    </FieldLabel>

                    <Input
                      {...field}
                      type="text"
                      id="name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter name"
                      autoComplete="name"
                      className="
                  h-11
                  rounded-lg
                  px-4
                  shadow-sm
                  transition-colors
                  focus-visible:ring-2
                "
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
                    <FieldLabel htmlFor="email" className="mb-1.5">
                      Email
                    </FieldLabel>

                    <Input
                      {...field}
                      type="email"
                      id="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter email"
                      autoComplete="email"
                      className="
                  h-11
                  rounded-lg
                  px-4
                  shadow-sm
                  transition-colors
                  focus-visible:ring-2
                "
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Password */}
              {!user?.id ? (
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="password" className="mb-1.5">
                        Password
                      </FieldLabel>

                      <Input
                        {...field}
                        type="password"
                        id="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter password"
                        autoComplete="new-password"
                        className="
                    h-11
                    rounded-lg
                    px-4
                    shadow-sm
                    transition-colors
                    focus-visible:ring-2
                  "
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              ) : null}

              {/* Role */}
              <Controller
                name="role"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="role" className="mb-1.5">
                      Role
                    </FieldLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="role"
                        className="
                    h-11
                    w-full
                    rounded-lg
                    px-4
                    shadow-sm
                    focus:ring-2
                  "
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>

                      <SelectContent className="rounded-lg">
                        {ROLE_OPTIONS.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>

          {/* Footer */}
          <div className="flex justify-end border-t bg-muted/30 px-6 py-4">
            <Button
              type="submit"
              className="h-10 min-w-32 rounded-lg px-5 cursor-pointer"
              form="user-management-form"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Spinner className="size-5" />
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col p-8 text-black w-full">
        <div className="flex w-full justify-between">
          <h1 className="text-lg">User management</h1>

          <Button className="cursor-pointer" onClick={() => setIsOpen(true)}>
            Create new user
          </Button>
        </div>

        <div className="flex flex-col p-8">
          <DataTable data={users} columns={columns} />
        </div>
      </div>
    </>
  );
}
