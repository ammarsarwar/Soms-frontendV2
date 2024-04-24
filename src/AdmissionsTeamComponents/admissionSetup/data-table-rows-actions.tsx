"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Admission } from "./data/schema";
import { updateAdmissionStatus } from "@/serverAD/admissions/actions";
import { Controller, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const {
    handleSubmit,
    control,
    formState: { errors, isLoading, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const application = row.original as Admission;

  const onSubmit: SubmitHandler<any> = async (values) => {
    console.log("Form data:", values);
    try {
      const result = await updateAdmissionStatus(application.id, values.status);
      if (result) {
        toast.success("Application status has been updated");
      } else {
        toast.error("Error updating application status");
      }
    } catch {
      toast.error("Error updating application status");
    } finally {
    }
  };

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
              <DialogTitle>Application Request Review</DialogTitle>
              <DialogDescription>
                View application information below.
              </DialogDescription>
            </DialogHeader>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="parent_infomation">
                <AccordionTrigger>Parent/Guardian information</AccordionTrigger>
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
                          Parent phone #
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
                          Emergency contact #
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
                <AccordionTrigger>Student information</AccordionTrigger>
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
                          Student national #
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
                          Date of birth
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
                <AccordionTrigger>Location preferrence</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Applied branch
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
                          Applied campus
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
                          Applied grade
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
                <AccordionTrigger>Admission slot</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Selected admission slot date
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
        {application.status === "Enrolled" ||
        application.status == "Completed" ||
        application.status === "Rejected" ? null : (
          <Dialog>
            <DialogTrigger asChild>
              <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start">
                Change status
              </p>
            </DialogTrigger>
            <DialogContent className="max-w-[800px] overflow-scroll no-scrollbar h-[300px]">
              <DialogHeader>
                <DialogTitle>Application status</DialogTitle>
                <DialogDescription>
                  You can manually change the application status from here
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-8">
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading || isSubmitting}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                            <SelectLabel>Status</SelectLabel>
                            {application.status === "Test Scheduled" && (
                              <>
                                <SelectItem value="Accepted">
                                  Accepted
                                </SelectItem>
                                <SelectItem value="Rejected">
                                  Rejected
                                </SelectItem>
                              </>
                            )}
                            {application.status === "Accepted" && (
                              <>
                                <SelectItem value="Enrolled">
                                  Enrolled
                                </SelectItem>
                                <SelectItem value="Rejected">
                                  Rejected
                                </SelectItem>
                              </>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="destructive" type="button">
                        Cancel
                      </Button>
                    </DialogClose>

                    <Button type="submit">
                      {isLoading || isSubmitting ? "Updating" : "Update"}
                    </Button>
                  </DialogFooter>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </DropdownMenuContent>
      {/* <DropdownMenuContent align="end" className="w-[160px]">
       
      </DropdownMenuContent> */}
    </DropdownMenu>
  );
}
