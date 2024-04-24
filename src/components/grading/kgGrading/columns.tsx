"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-rows-actions";
import { TStudentGradingSchema, TStudentKgGradingSchema } from "@/schemas";

const data = [
  {
    name: "sss",
  },
  {
    name: "www",
  },
];

export const kgcolumns: ColumnDef<TStudentKgGradingSchema>[] = [
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
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Id" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-normal">
            {row.getValue("id")}
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
  // {
  //   accessorKey: "parent_name_english",
  //   id: "parent_name_english",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Parent Name" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <span className="max-w-[500px] truncate font-normal">
  //           {row.getValue("parent_name_english")}
  //         </span>
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "parent_name_english",
  //   id: "parent_name_english",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Parent Name" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <span className="max-w-[500px] truncate font-normal">
  //           {row.getValue("parent_name_english")}
  //         </span>
  //       </div>
  //     );
  //   },
  // },
  // {
  //   id: "Quarter-1 25",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Quarter-1 25" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <span className="max-w-[500px] truncate font-normal">22 / 25</span>
  //       </div>
  //     );
  //   },
  // },
  // {
  //   id: "Quarter-2 25",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Quarter-2 25" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <span className="max-w-[500px] truncate font-normal">18 / 25</span>
  //       </div>
  //     );
  //   },
  // },
  // {
  //   id: "Quarter-3 25",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Quarter-3 25" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <span className="max-w-[500px] truncate font-normal">9 / 25</span>
  //       </div>
  //     );
  //   },
  // },
  // {
  //   id: "Quarter-4 25",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Quarter-4 25" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <span className="max-w-[500px] truncate font-normal">11 / 25</span>
  //       </div>
  //     );
  //   },
  // },
  // {
  //   id: "total_marks",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Total marks" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <span className="max-w-[500px] truncate font-normal">60 / 100</span>
  //       </div>
  //     );
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Marks" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
