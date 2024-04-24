"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-rows-actions";
import { StudentProfile } from "./data/schema";
import { application_status } from "./data/data";

const capitalizeFirstLetter = (str: string | null | undefined) => {
  if (!str) return "N/A"; // Returns "N/A" if the input is null or undefined.

  return str
    .split(" ") // Splits the string into an array of words.
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalizes the first letter of each word.
    .join(" ");
};
export const columns: ColumnDef<StudentProfile>[] = [
  {
    accessorFn: (row) => row.id,
    id: "student_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student ID" />
    ),
    cell: ({ row }) => {
      const studentNAID =
        row.original?.studentData.student_national_id || "N/A";
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {studentNAID}
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.studentData.student_first_name_english,
    id: "studentFname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="FName" />
    ),
    cell: ({ row }) => {
      const studentName = capitalizeFirstLetter(
        row.original?.studentData.student_first_name_english || "N/A"
      );

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {studentName}
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.studentData.student_middle_name_english,
    id: "student_Mname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="MName" />
    ),
    cell: ({ row }) => {
      const studentMName = capitalizeFirstLetter(
        row.original?.studentData.student_middle_name_english || "N/A"
      );

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {studentMName}
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.studentData.student_last_name_english,
    id: "student_Lname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="LName" />
    ),
    cell: ({ row }) => {
      const studentLName = capitalizeFirstLetter(
        row.original?.studentData.student_last_name_english || "N/A"
      );

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {studentLName}
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.campus?.name,
    id: "campus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Campus" />
    ),
    cell: ({ row }) => {
      const campus = row.original?.campus?.name || "N/A";

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{campus}</span>
        </div>
      );
    },
  },

  {
    accessorFn: (row) => row.section?.grade?.name,
    id: "grade_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grade" />
    ),
    cell: ({ row }) => {
      const gradeName = row.original?.section?.grade.name || "N/A";

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {gradeName}
          </span>
        </div>
      );
    },
    filterFn: (row, id, valueArray) => {
      const originalData = row.original;
      const rowValue = originalData?.section?.grade?.name
        ? originalData.section.grade.name.toString().toLowerCase()
        : "";
      if (!Array.isArray(valueArray)) {
        valueArray = [valueArray];
      }
      return valueArray.some((value: any) =>
        rowValue.includes(value.toLowerCase())
      );
    },
  },
  {
    accessorFn: (row) => row.section?.name,
    id: "section_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Class" />
    ),
    cell: ({ row }) => {
      const sectionName = row.original?.section?.name || "N/A";

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {sectionName}
          </span>
        </div>
      );
    },
    filterFn: (row, id, valueArray) => {
      const originalData = row.original;
      const rowValue = originalData?.section?.name
        ? originalData.section.name.toString().toLowerCase()
        : "";
      if (!Array.isArray(valueArray)) {
        valueArray = [valueArray];
      }
      return valueArray.some((value: any) =>
        rowValue.includes(value.toLowerCase())
      );
    },
  },

  {
    accessorFn: (row) => row.parentData.parent_national_id,
    id: "parent_ID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parent ID" />
    ),
    cell: ({ row }) => {
      const parentID = row.original?.parentData.parent_national_id || "N/A";

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{parentID}</span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.parentData.parent_phone_number,
    id: "parent_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact" />
    ),
    cell: ({ row }) => {
      const number = row.original?.parentData.parent_phone_number || "N/A";

      return (
        <div className="flex space-x-2">
          <span className="max-w-[100px] truncate font-medium">{number}</span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.parentData.parent_email,
    id: "parent_email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email = row.original?.parentData.parent_email || "N/A";

      return (
        <div className="flex space-x-2">
          <span className="max-w-[100px] truncate font-medium">{email}</span>
        </div>
      );
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
