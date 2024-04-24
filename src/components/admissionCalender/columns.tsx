"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { ADMISSION_CALENDER_STATUS } from "./admission-calender-status";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-rows-actions";
import { TAdmissionCalenderSchema } from "@/schemas";

export const columns: ColumnDef<TAdmissionCalenderSchema>[] = [
  {
    accessorKey: "start_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
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
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ row }) => {
      const startDate = new Date(row.getValue("end_date"));
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
    accessorKey: "academic_year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Academic Year" />
    ),
    cell: ({ row }) => {
      const schoolYear = `${row.original.academic_year.start_year} - ${row.original.academic_year.end_year}`;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {schoolYear}
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
      const status = ADMISSION_CALENDER_STATUS.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      if (status.value === "Closed") {
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
