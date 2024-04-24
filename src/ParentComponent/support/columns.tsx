"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-rows-actions";
import { Ticket } from "./data/schema";
import { format, parseISO } from "date-fns";
export const columns: ColumnDef<Ticket>[] = [
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
    accessorFn: (row) => row.id,
    id: "ticketId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ticket id" />
    ),
    cell: ({ row }) => {
      const ticketId = row.original.id || "N/A";
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{ticketId}</span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.opened_by.parent_name_english,
    id: "opened_by",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Opened By" />
    ),
    cell: ({ row }) => {
      const openedBy = row.original.opened_by.parent_name_english || "N/A";
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{openedBy}</span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.student.student_first_name_english,
    id: "studentName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student name" />
    ),
    cell: ({ row }) => {
      const studentFname =
        row.original?.student.student_first_name_english || "N/A";
      const studentLname =
        row.original?.student.student_last_name_english || "N/A";
      const studentMname =
        row.original?.student.student_middle_name_english || "N/A";
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {studentFname} {studentMname} {studentLname}
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.category,
    id: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = row.original.category || "N/A";
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{category}</span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.status,
    id: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status || "N/A";
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{status}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "created",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created On" />
    ),
    cell: ({ row }) => {
      const createdDate = parseISO(row.getValue("created"));
      const formattedDate = format(createdDate, "yyyy-MM-dd HH:mm:ss");

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formattedDate}
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
