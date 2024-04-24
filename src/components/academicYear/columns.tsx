"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ACADEMIC_YEAR_STATUS } from "./academic-year-status";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-rows-actions";
import { Button } from "../ui/button";
import { TSchoolYearSchema } from "@/schemas";

export const columns: ColumnDef<TSchoolYearSchema>[] = [
  {
    accessorKey: "start_year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Year" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate font-medium">
        {row.getValue("start_year")}
      </span>
    ),
  },
  {
    accessorKey: "end_year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Year" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("end_year")}
          </span>
        </div>
      );
    },
  },

  // {
  //   accessorKey: "created",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Created at" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <span className="max-w-[500px] truncate font-medium">
  //           {row.getValue("created")}
  //         </span>
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = ACADEMIC_YEAR_STATUS.find(
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
