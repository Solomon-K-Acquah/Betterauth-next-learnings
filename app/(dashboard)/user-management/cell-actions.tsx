"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { UserProps, useUsers } from "@/hooks/use-user";
import { authClient } from "@/lib/auth-client";
import { Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const CellActions = ({
  id,
  name,
  role,
  email,
  emailVerified,
  hasDeletePermission,
}: UserProps) => {
  const router = useRouter();
  const { isOpen, setIsOpen, user, setUser } = useUsers();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //delete user
  const onRemoveUser = async () => {
    try {
      const { error } = await authClient.admin.removeUser({ userId: id });

      if (error) {
        toast.error(error.message);
      }
    } catch {
      throw new Error("Something went wrong");
    } finally {
      router.refresh();
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-6">
        <div
          className="cursor-pointer"
          title="Edit"
          onClick={() => {
            setIsOpen(true);
            setUser({
              id,
              name,
              role,
              email,
              emailVerified,
              hasDeletePermission,
            });
          }}
        >
          <Edit />
        </div>

        {hasDeletePermission && (
          <div
            className="cursor-pointer"
            onClick={() => {
              setIsDeleteModalOpen(true);
            }}
          >
            <Trash className="text-rose-500" />
          </div>
        )}

        <Dialog
          open={isDeleteModalOpen}
          onOpenChange={(isOpen) => {
            setIsDeleteModalOpen(isOpen);
          }}
        >
          <DialogContent className="flex flex-col items-start justify-center">
            {/* Header */}
            <DialogHeader className="border-b px-6 py-5 w-full">
              <DialogTitle className="text-xl font-semibold">
                Delete user
              </DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Are you sure you want to delete {name} ? <br />
              This action cannot be undone.
            </DialogDescription>

            <Button
              type="submit"
              className="h-10 min-w-32 rounded-lg px-5 cursor-pointer self-end"
              variant="destructive"
              onClick={onRemoveUser}
            >
              {isLoading ? <Spinner className="size-5" /> : "Delete"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
