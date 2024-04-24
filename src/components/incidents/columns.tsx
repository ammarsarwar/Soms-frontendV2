"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { IncidentData } from "./data/schema";
import { DataTableRowActions } from "./data-table-rows-actions";
import { Row } from "react-day-picker";
import { format } from "date-fns";
export const columns: ColumnDef<IncidentData>[] = [
  {
    accessorFn: (row) => row.student?.student_first_name_english,
    id: "student_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Name" />
    ),
    cell: ({ row }) => {
      const studentName =
        row.original.student?.student_first_name_english || "N/A";
      const studentMidName =
        row.original.student?.student_middle_name_english || "N/A";
      const studentLastName = row.original.student?.student_last_name_english;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {studentName} {studentMidName} {studentLastName}
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.date_time_of_incident,
    id: "incident_time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time of Incident" />
    ),
    cell: ({ row }) => {
      const incidentTime = row.original.date_time_of_incident
        ? format(new Date(row.original.date_time_of_incident), "PPpp")
        : "N/A";
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {incidentTime}
          </span>
        </div>
      );
    },
  },

  {
    accessorFn: (row) => row.location,
    id: "incident_location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => {
      const incidentLocation = row.original.location || "N/A";
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {incidentLocation}
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.description,
    id: "incident_description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.original.description || "N/A";
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {description}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "actions_taken",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions Taken" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue("actions_taken")}
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
