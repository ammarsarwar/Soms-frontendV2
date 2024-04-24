"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

import { DataTableColumnHeader } from "../userManagment/data-table-column-header";
import { DataTableRowActions } from "../userManagment/data-table-rows-actions";
import { TUserSchema } from "@/schemas";
import { USER_ACTIVE_STATUSES } from "./user-status";
import { DataTableColumnTitleHeader } from "./data-table-column-title-header";


const capitalizeFirstLetter = (str: string | null | undefined) => {
  if (!str) return "N/A"; // Returns "N/A" if the input is null or undefined.

  return str
    .split(" ") // Splits the string into an array of words.
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalizes the first letter of each word and converts the rest to lowercase.
    .join(" ");
};

export const columns: ColumnDef<TUserSchema>[] = [
  {
    id: "user_name",
    accessorFn: (row) => row.first_name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const fName = capitalizeFirstLetter(row.original?.first_name || "N/A");
      const lName = capitalizeFirstLetter(row.original?.last_name || "N/A");
      return (
        <div className="flex space-x-2">
          <span className="truncate">
            {fName} {lName}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-normal">
            {row.getValue("email")}
          </span>
        </div>
      );
    },
  },

  {
    id: "user_profiles",
    accessorFn: (row) => row.user_profiles,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Roles" />
    ),
    cell: ({ row }) => {
      const profiles = row.original.user_profiles;
      if (profiles.length === 0) {
        return (
          <Badge variant={"destructive"} className="hover:bg-[#2dd4bf]">
            None
          </Badge>
        );
      }

      return (
        <>
          {" "}
          <div className="flex space-x-2">
            {profiles.map((profile) => (
              <Badge key={profile.id} className="hover:bg-[#2dd4bf]">
                {profile.userRole === "TE"
                  ? "Teacher"
                  : profile.userRole === "PR"
                  ? "Principal"
                  : profile.userRole === "NU"
                  ? "Nurse"
                  : profile.userRole === "SA"
                  ? "IT Admin"
                  : profile.userRole === "AC"
                  ? "Academics"
                  : profile.userRole === "AD"
                  ? "Admissions Team"
                  : "Other"}
              </Badge>
            ))}
          </div>
        </>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "campus",
    accessorFn: (row) =>
      row.user_profiles.map((profiles) => profiles.campus?.name),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Campus" />
    ),
    cell: ({ row }) => {
      const campusName = row.original?.user_profiles.map(
        (profiles) => profiles.campus?.name
      );
      const uniqueCampus = new Set(campusName);
      return (
        <div className="flex space-x-2">
          <span className="max-w-[100px] truncate font-normal">
            {uniqueCampus}{" "}
          </span>
        </div>
      );
    },
  },
  // {
  //   id: "national_id",
  //   accessorFn: (row) => row.national_id,
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="National ID" />
  //   ),
  //   cell: ({ row }) => {
  //     const naID = row.original?.national_id || "N/A";

  //     return (
  //       <div className="flex space-x-2">
  //         <span className="max-w-[500px] truncate font-normal">{naID} </span>
  //       </div>
  //     );
  //   },
  // },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnTitleHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = USER_ACTIVE_STATUSES.find(
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
            <Badge variant={"outline"}>{row.getValue("status")}</Badge>
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
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
