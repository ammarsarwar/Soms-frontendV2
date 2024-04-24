"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Admission } from "./data/schema";
import { updateAdmissionStatus } from "@/server/admissions/actions";
import { Controller, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
import { toast } from "sonner";

import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const application = row.original as Admission;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <Dialog>
          <DialogTrigger asChild>
            <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start">
              View
            </p>
          </DialogTrigger>
          <DialogContent className="max-w-[800px] overflow-scroll no-scrollbar">
            <DialogHeader>
              <DialogTitle>Admission Application</DialogTitle>
            </DialogHeader>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="parent_infomation">
                <AccordionTrigger>Parent/Guardian Information</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Parent Name
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {application.parent_name_english
                            ? application.parent_name_english
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
                          {application.parent_email
                            ? application.parent_email
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
                          {application.parent_phone_number
                            ? application.parent_phone_number
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
                          {application.emergency_phone_number
                            ? application.emergency_phone_number
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
                          {application.student_first_name_english
                            ? application.student_first_name_english
                            : "N/A"}{" "}
                          {application.student_middle_name_english
                            ? application.student_middle_name_english
                            : "N/A"}{" "}
                          {application.student_last_name_english
                            ? application.student_last_name_english
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
                          {application.student_gender
                            ? application.student_gender
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="-mx-2 flex items-start space-x-4 rounded-md  p-2 hover:bg-accent hover:text-accent-foreground transition-all">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Student National #
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {application.student_national_id
                            ? application.student_national_id
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
                          {application.student_date_of_birth
                            ? application.student_date_of_birth
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
                          {application.applied_branch.name
                            ? application.applied_branch.name
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
                          {application.applied_grade.department.campus.name
                            ? application.applied_grade.department.campus.name
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
                          {application.applied_grade.name
                            ? application.applied_grade.name
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
                          {application.applied_grade.department.name
                            ? application.applied_grade.department.name
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
                          {application.scheduled_test === null
                            ? "N/A"
                            : application.scheduled_test.date}
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
