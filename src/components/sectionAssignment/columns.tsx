"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-rows-actions";
import { StudentProfile } from "./data/schema";

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
import { DataTableStatusRowActions } from "./data-table-status-row-actions";
  const capitalizeFirstLetter = (str: string | null | undefined) => {
    if (!str) return "N/A"; // Returns "N/A" if the input is null or undefined.

    return str
      .split(" ") // Splits the string into an array of words.
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalizes the first letter of each word and converts the rest to lowercase.
      .join(" ");
  };
  export const columns: ColumnDef<StudentProfile>[] = [
    {
      accessorFn: (row) => row.id,
      id: "student_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => {
        const studentNaID =
          row.original?.studentData.student_national_id || "N/A";
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {studentNaID}
            </span>
          </div>
        );
      },
    },
    {
      accessorFn: (row) => row.studentData.student_first_name_english,
      id: "student_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const studentName =
          row.original?.studentData.student_first_name_english || "N/A";
        const studentMName =
          row.original?.studentData.student_middle_name_english || "N/A";
        const lastName =
          row.original?.studentData.student_last_name_english || "N/A";

        const fullName = studentName + " " + studentMName + " " + lastName;
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium ">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="cursor-pointer underline">
                    {capitalizeFirstLetter(fullName)}
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-[800px] overflow-scroll no-scrollbar">
                  <DialogHeader>
                    <DialogTitle>Student Information</DialogTitle>
                  </DialogHeader>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="student_info">
                      <AccordionTrigger>Student Information</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2  transition-all hover:bg-accent hover:text-accent-foreground">
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">
                                Student national ID
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {row.original?.studentData.student_national_id
                                  ? row.original?.studentData
                                      .student_national_id
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">
                                Student Name
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {capitalizeFirstLetter(
                                  row.original?.studentData
                                    .student_first_name_english
                                    ? row.original?.studentData
                                        .student_first_name_english
                                    : "N/A"
                                )}{" "}
                                {capitalizeFirstLetter(
                                  row.original?.studentData
                                    .student_middle_name_english
                                    ? row.original?.studentData
                                        .student_middle_name_english
                                    : "N/A"
                                )}{" "}
                                {capitalizeFirstLetter(
                                  row.original?.studentData
                                    .student_last_name_english
                                    ? row.original?.studentData
                                        .student_last_name_english
                                    : "N/A"
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2  transition-all hover:bg-accent hover:text-accent-foreground">
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">
                                Gender
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {row.original?.studentData.student_gender
                                  ? row.original?.studentData.student_gender
                                  : "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">
                                Date of birth
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {row.original?.studentData.student_date_of_birth
                                  ? row.original?.studentData
                                      .student_date_of_birth
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="Parent_info">
                      {" "}
                      <AccordionTrigger>Parent Information</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">
                                Parent ID
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {row.original?.parentData.parent_national_id
                                  ? row.original?.parentData.parent_national_id
                                  : "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">
                                Parent Name
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {capitalizeFirstLetter(
                                  row.original?.parentData.parent_name_english
                                    ? row.original?.parentData
                                        .parent_name_english
                                    : "N/A"
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">
                                Parent Email
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {row.original?.parentData.parent_email
                                  ? row.original?.parentData.parent_email
                                  : "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">
                                Parent Number
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {row.original?.parentData.parent_phone_number
                                  ? row.original?.parentData.parent_phone_number
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
                                Branch
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {row.original?.campus.branch.name
                                  ? row.original?.campus.branch.name
                                  : "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2  transition-all hover:bg-accent hover:text-accent-foreground">
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">
                                Campus
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {row.original?.campus.name
                                  ? row.original?.campus.name
                                  : "N/A"}
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
      accessorFn: (row) => row.studentData.student_gender,
      id: "gender",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Gender" />
      ),
      cell: ({ row }) => {
        const gender = row.original?.studentData.student_gender || "N/A";

        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">{gender}</span>
          </div>
        );
      },
    },
    {
      accessorFn: (row) => row.applied_grade.name,
      id: "grade_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Grade" />
      ),
      cell: ({ row }) => {
        const gradeName = row.original?.applied_grade.name || "N/A";

        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {gradeName}
            </span>
          </div>
        );
      },
    },
    {
      accessorFn: (row) => row.applied_grade.name,
      id: "campus_name",
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
    //   accessorKey: "status",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Status" />
    //   ),
    //   cell: ({ row }) => {
    //     const status = application_status.find(
    //       (status) => status.value === row.getValue("status")
    //     );

    //     if (status?.value === "Rejected")
    //       return <Badge variant={"destructive"}>{status.value}</Badge>;

    //     if (status?.value === "Test Scheduled") return <Badge>Scheduled</Badge>;

    //     if (status?.value === "Accepted")
    //       return <Badge variant={"outline"}>Accepted</Badge>;

    //     if (!status) {
    //       return null;
    //     }

    //     return (
    //       <div className="flex w-[100px] items-center">
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
    // {
    //   accessorFn: (row) => row.created_at,
    //   id: "created_at",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Submitted at" />
    //   ),
    //   cell: ({ row }) => {
    //     const created = row.original?.created_at || "N/A";
    //     return (
    //       <div className="flex space-x-2">
    //         <span className="max-w-[500px] truncate font-medium">{created}</span>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   id: "actions",
    //   cell: ({ row }) => <DataTableRowActions row={row} />,
    // },
  ];
