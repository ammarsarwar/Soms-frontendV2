"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-rows-actions";
import { statuses } from "./data/data";
import { Grade } from "@/schemas";
import { DataTableGradeHeader } from "./data-table-grade-header";
export const columns: ColumnDef<Grade>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableGradeHeader column={column} title="Grade" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.department?.name,
    id: "department",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => {
      const campusName = row.original.department?.name || "N/A";
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {campusName}
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.department?.campus?.name,
    id: "campus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Campus" />
    ),
    cell: ({ row }) => {
      const campusName = row.original.department?.campus?.name || "N/A";
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {campusName}
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.department?.campus?.branch?.name,
    id: "branch_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Branch" />
    ),
    cell: ({ row }) => {
      const branchName = row.original.department?.campus?.branch?.name || "N/A";
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {branchName}
          </span>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "level",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Level" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <span className="max-w-[500px] truncate font-medium">
  //           {row.getValue("level")}
  //         </span>
  //       </div>
  //     );
  //   },
  // },

  // {
  //   accessorKey: "status",
  // header: ({ column }) => (
  //   <DataTableColumnHeader column={column} title="Status" />
  // ),
  //   cell: ({ row }) => {
  //     const status = statuses.find(
  //       (status) => status.value === row.getValue("status")
  //     );
  //     console.log(status);

  //     if (!status) {
  //       return null;
  //     }

  //     return (
  //       <div className="flex w-[100px] items-center">
  //         {/* {status.icon && (
  //           <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )} */}
  //         <span>
  //           <Badge>{row.getValue("status")}</Badge>
  //         </span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Edit" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
