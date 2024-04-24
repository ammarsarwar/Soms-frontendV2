"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-rows-actions";
import { TStudentProfileListForReportsSchema } from "@/schemas";

export const columns: ColumnDef<TStudentProfileListForReportsSchema>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Id" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "studentData",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Name" />
    ),
    cell: ({ row }) => {
      const studentFName = row.original.studentData.student_first_name_english
        ? row.original.studentData.student_first_name_english
        : "";
      const studentMName = row.original.studentData.student_middle_name_english
        ? row.original.studentData.student_middle_name_english
        : "";
      const studentLName = row.original.studentData.student_last_name_english
        ? row.original.studentData.student_last_name_english
        : "";
      return (
        <div>{studentFName + " " + studentMName + " " + studentLName}</div>
      );
    },
  },
  {
    accessorKey: "parentData",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parent Name" />
    ),
    cell: ({ row }) => {
      const parentName = row.original.parentData.parent_name_english
        ? row.original.parentData.parent_name_english
        : "";

      return <div>{parentName}</div>;
    },
  },
  {
    accessorKey: "applied_grade",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grade" />
    ),
    cell: ({ row }) => {
      const gradeName = row.original.applied_grade.name;

      return <div>{gradeName}</div>;
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Edit" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
