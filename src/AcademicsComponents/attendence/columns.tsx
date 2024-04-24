"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-rows-actions";
import { TOptimizedStudentAttendenceSchema } from "./attendence.types";

export const columns: ColumnDef<TOptimizedStudentAttendenceSchema>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (row) => row.id,
    id: "student_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Id" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-normal">
            {row.getValue("student_id")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "student_first_name_english",
    id: "student_first_name_english",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-normal">
            {row.getValue("student_first_name_english")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "student_last_name_english",
    id: "student_last_name_english",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-normal">
            {row.getValue("student_last_name_english")}
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.parent_name_english,
    id: "parent_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parent Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-normal">
            {row.getValue("parent_name")}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Attendence Status" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
