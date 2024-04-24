"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-rows-actions";
import { ProgressArraySchema } from "@/schemas";

export const columns: ColumnDef<ProgressArraySchema>[] = [
  {
    accessorKey: "student_first_name_english",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("student_first_name_english")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "student_last_name_english",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("student_last_name_english")}
          </span>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Progress" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
