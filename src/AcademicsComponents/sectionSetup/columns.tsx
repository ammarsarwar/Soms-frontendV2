"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-rows-actions";
import { Section } from "./data/schema";

export const columns: ColumnDef<Section>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
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
    accessorFn: (row) => row.grade?.name,
    id: "grade",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grade Name" />
    ),
    cell: ({ row }) => {
      const campusName = row.original.grade?.name || "N/A";
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
    accessorFn: (row) => row.grade?.department?.name,
    id: "department",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department Name" />
    ),
    cell: ({ row }) => {
      const campusName = row.original.grade?.department?.name || "N/A";
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
    accessorFn: (row) => row.grade?.department?.campus?.name,
    id: "campus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Campus Name" />
    ),
    cell: ({ row }) => {
      const campusName = row.original.grade?.department?.campus?.name || "N/A";
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
    accessorFn: (row) => row.grade?.department?.campus?.branch?.name,
    id: "branch_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Branch Name" />
    ),
    cell: ({ row }) => {
      const branchName =
        row.original.grade?.department?.campus?.branch?.name || "N/A";
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

  {
    accessorKey: "created",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created On" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("created")}
          </span>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "status",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Status" />
  //   ),
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
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
