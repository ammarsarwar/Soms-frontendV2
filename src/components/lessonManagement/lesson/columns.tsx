"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-rows-actions";
import { TLessonSchema } from "@/schemas";

export const columns: ColumnDef<TLessonSchema>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-normal">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.grade.name,
    id: "grade",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grade" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-normal">
            {row.getValue("grade")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "max_grade",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Max Grade" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-normal">
            {row.getValue("max_grade")}
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.grade.department.name,
    id: "department",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => {
      const deptname = row.original?.grade.department.name;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-normal">{deptname}</span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.grade.department.campus.name,
    id: "campus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Campus" />
    ),
    cell: ({ row }) => {
      const campusName = row.original?.grade.department.campus.name;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-normal">
            {campusName}
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.grade.department.campus.branch.name,
    id: "branch",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Branch" />
    ),
    cell: ({ row }) => {
      const branchName = row.original?.grade.department.campus?.branch?.name;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-normal">
            {branchName}
          </span>
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
