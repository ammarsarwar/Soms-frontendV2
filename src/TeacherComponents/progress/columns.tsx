"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-rows-actions";
import { StudentProfile } from "@/components/student/data/schema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const columns: ColumnDef<StudentProfile>[] = [
  {
    accessorFn: (row) => row.studentData.student_first_name_english,
    id: "student_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student name" />
    ),
    cell: ({ row }) => {
      const studentName =
        row.original?.studentData.student_first_name_english || "N/A";
      const lastName =
        row.original?.studentData.student_last_name_english || "N/A";
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {studentName} {lastName}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Progress types" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
