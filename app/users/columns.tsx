"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { type UserProps } from "@/hooks/use-user";
import { CellActions } from "../(dashboard)/user-management/cell-actions";

export const columns: ColumnDef<UserProps>[] = [
  /*
   * Row selection
   */
  {
    id: "select",

    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),

    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),

    enableSorting: false,
    enableHiding: false,
  },

  /*
   * Name
   */
  {
    accessorKey: "name",

    header: "Name",

    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },

  /*
   * Email
   */
  {
    accessorKey: "email",

    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),

    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },

  /*
   * Role
   */
  {
    accessorKey: "role",

    header: () => <div className="text-right">Role</div>,

    cell: ({ row }) => (
      <div className="text-right capitalize">{row.getValue("role")}</div>
    ),
  },

  /*
   * Email verification
   */
  {
    accessorKey: "emailVerified",

    header: () => <div className="text-right">Email verified</div>,

    cell: ({ row }) => {
      const emailVerified = row.getValue<boolean>("emailVerified");

      return (
        <div className="text-right capitalize">
          {emailVerified ? "Yes" : "No"}
        </div>
      );
    },
  },

  /*
   * Actions
   */
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      const copyUserId = async () => {
        try {
          await navigator.clipboard.writeText(user.id);
        } catch (error) {
          console.error("Failed to copy user ID:", error);
        }
      };
      return (
        <CellActions
          id={row.original.id}
          name={row.original.name}
          role={row.original.role}
          email={row.original.email}
          emailVerified={row.original.emailVerified}
          hasDeletePermission={row.original.hasDeletePermission}
        />
      );
    },
  },
];
