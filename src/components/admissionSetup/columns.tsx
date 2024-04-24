"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-rows-actions";
import { Admission } from "./data/schema";
import { DataTableStatusRowActions } from "./data-table-status-row-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const capitalizeFirstLetter = (str: string | null | undefined) => {
  if (!str) return "N/A"; // Returns "N/A" if the input is null or undefined.

  return str
    .split(" ") // Splits the string into an array of words.
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalizes the first letter of each word.
    .join(" ");
};

export const columns: ColumnDef<Admission>[] = [
  {
    accessorFn: (row) => row.student_first_name_english,
    id: "applicant_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student" />
    ),
    cell: ({ row }) => {
      const applicantName = capitalizeFirstLetter(
        row.original?.student_first_name_english || "N/A"
      );
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium cursor-pointer underline">
            <Dialog>
              <DialogTrigger asChild>
                <div>{applicantName}</div>
              </DialogTrigger>
              <DialogContent className="max-w-[800px] overflow-scroll no-scrollbar">
                <DialogHeader>
                  <DialogTitle>Admission Application</DialogTitle>
                </DialogHeader>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="parent_infomation">
                    <AccordionTrigger>
                      Parent/Guardian Information
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              Parent Name
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {row.original?.parent_name_english
                                ? row.original?.parent_name_english
                                : "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2  transition-all hover:bg-accent hover:text-accent-foreground">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              Email
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {row.original?.parent_email
                                ? row.original?.parent_email
                                : "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="-mx-2 flex items-start space-x-4 rounded-md  p-2 hover:bg-accent hover:text-accent-foreground transition-all">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              Parent Phone #
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {row.original?.parent_phone_number
                                ? row.original?.parent_phone_number
                                : "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              Emergency Contact #
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {row.original?.emergency_phone_number
                                ? row.original?.emergency_phone_number
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="student_info">
                    <AccordionTrigger>Student Information</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              Student Name
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {row.original?.student_first_name_english
                                ? row.original?.student_first_name_english
                                : "N/A"}{" "}
                              {row.original?.student_middle_name_english
                                ? row.original?.student_middle_name_english
                                : "N/A"}{" "}
                              {row.original?.student_last_name_english
                                ? row.original?.student_last_name_english
                                : "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2  transition-all hover:bg-accent hover:text-accent-foreground">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              Gender
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {row.original?.student_gender
                                ? row.original?.student_gender
                                : "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="-mx-2 flex items-start space-x-4 rounded-md  p-2 hover:bg-accent hover:text-accent-foreground transition-all">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              Student National ID
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {row.original?.student_national_id
                                ? row.original?.student_national_id
                                : "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              Date Of Birth
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {row.original?.student_date_of_birth
                                ? row.original?.student_date_of_birth
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="location_info">
                    <AccordionTrigger>Location Preferrence</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              Applied Branch
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {row.original?.applied_branch.name
                                ? row.original?.applied_branch.name
                                : "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2  transition-all hover:bg-accent hover:text-accent-foreground">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              Applied Campus
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {row.original?.applied_grade.department.campus
                                .name
                                ? row.original?.applied_grade.department.campus
                                    .name
                                : "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="-mx-2 flex items-start space-x-4 rounded-md  p-2 hover:bg-accent hover:text-accent-foreground transition-all">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              Applied Grade
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {row.original?.applied_grade.name
                                ? row.original?.applied_grade.name
                                : "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              Department
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {row.original?.applied_grade.department.name
                                ? row.original?.applied_grade.department.name
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="time_slot">
                    <AccordionTrigger>Admission Slot</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              Selected Admission Slot Date
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {row.original?.scheduled_test === null
                                ? "N/A"
                                : row.original?.scheduled_test.date}
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </DialogContent>
            </Dialog>
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.parent_name_english,
    id: "parent_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parent" />
    ),
    cell: ({ row }) => {
      const parentName = capitalizeFirstLetter(
        row.original?.parent_name_english || "N/A"
      );
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {parentName}
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.student_gender,
    id: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => {
      const gender = row.original?.student_gender || "N/A";
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{gender}</span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.applied_branch.name,
    id: "Branch_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Branch" />
    ),
    cell: ({ row }) => {
      const branchName = row.original?.applied_branch.name || "N/A";
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {branchName}
          </span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.applied_grade.department.campus.name,
    id: "Campus_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Campus" />
    ),
    cell: ({ row }) => {
      const campusName =
        row.original?.applied_grade.department.campus.name || "N/A";
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
    accessorFn: (row) => row.applied_grade.department.name,
    id: "dept_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => {
      const deptName = row.original?.applied_grade.department.name || "N/A";
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{deptName}</span>
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
    cell: ({ row }) => <DataTableStatusRowActions row={row} />,
    filterFn: (row, id, valueArray) => {
      const originalData = row.original;
      const rowValue = originalData?.status
        ? originalData.status.toString().toLowerCase()
        : "";
      if (!Array.isArray(valueArray)) {
        valueArray = [valueArray];
      }
      return valueArray.some((value: any) =>
        rowValue.includes(value.toLowerCase())
      );
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
