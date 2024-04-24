"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-rows-actions";
import { TAssignedLessonsSchema } from "@/schemas";

export const columns: ColumnDef<TAssignedLessonsSchema>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorFn: (row) => row.course.title,
    id: "lesson_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-normal">
            {row.getValue("lesson_name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.teacher.first_name,
    id: "teacher_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned Teacher" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-normal">
            {row.getValue("teacher_name")}
          </span>
        </div>
      );
    },
  },
  // {
  //   accessorFn: (row) => row.substitute?.user.first_name,
  //   id: "subtitute_name",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Assigned Subtitute" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <span className="max-w-[500px] truncate font-normal">
  //           {row ? row.getValue("subtitute_name") : "N/A"}
  //         </span>
  //       </div>
  //     );
  //   },
  // },

  {
    accessorFn: (row) => row.section.name,
    id: "section_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned section" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-normal">
            {row.getValue("section_name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.course.grade.name,
    id: "grade_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grade" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-normal">
            {row.getValue("grade_name")}
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
