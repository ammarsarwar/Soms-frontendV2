"use client";
import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./data-table-column-header";
import { ReportsSchema } from "./data/schema";
import { DataTableRowActions } from "./data-table-rows-actions";

export const columns: ColumnDef<ReportsSchema>[] = [
  {
    accessorFn: (row) => row.start_date && row.end_date,
    id: "progress_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const startDate = row.original?.start_date || "N/A";
      const endDate = row.original?.end_date;

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {startDate} - {endDate}
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
      const gradeName = row.original?.grade || "N/A";
      const secName = row.original?.section.name || "N/A";
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
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Progress" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
