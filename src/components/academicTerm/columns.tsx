"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-rows-actions";
import { ACADEMIC_TERM_STATUS } from "./academic-term-status";
import { TAcademicTermSchema } from "@/schemas";

export const columns: ColumnDef<TAcademicTermSchema>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Term" />
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
    accessorFn: (row) => row?.academic_year,
    id: "academic_year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Academic Year" />
    ),
    cell: ({ row }) => {
      const yearName = `${row.original?.academic_year.start_year}-${row.original.academic_year.end_year}`;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{yearName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "start_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Term Start" />
    ),
    cell: ({ row }) => {
      const startDate = new Date(row.getValue("start_date"));
      const formattedStartDate = startDate.toLocaleDateString("en-GB");
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formattedStartDate}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "end_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Term End" />
    ),
    cell: ({ row }) => {
      const endDate = new Date(row.getValue("end_date"));
      const formattedEndDate = endDate.toLocaleDateString("en-GB");
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formattedEndDate}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = ACADEMIC_TERM_STATUS.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      if (status.value === "Inactive") {
        return (
          <div className="flex w-[100px] items-center">
            <span>
              <Badge variant={"destructive"} className="hover:bg-red-600">
                {row.getValue("status")}
              </Badge>
            </span>
          </div>
        );
      }

      return (
        <div className="flex w-[100px] items-center">
          <span>
            <Badge className=" hover:bg-green-600">
              {row.getValue("status")}
            </Badge>
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
