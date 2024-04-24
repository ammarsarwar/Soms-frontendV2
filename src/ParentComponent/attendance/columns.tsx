"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-rows-actions";
import { Attendance } from "./attendance-types";

export const columns: ColumnDef<Attendance>[] = [
  {
    accessorFn: (row) => row.course.title,
    id: "course_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Course Name" />
    ),
    cell: ({ row }) => {
      const courseName = row.original?.course.title;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {courseName}
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.grade,
    id: "grade_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grade Name" />
    ),
    cell: ({ row }) => {
      const gradeName = row.original?.grade;
      const secName = row.original?.section.name;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {gradeName} - {secName}
          </span>
        </div>
      );
    },
  },

  {
    accessorFn: (row) => row.status,
    id: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original?.status;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{status}</span>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
