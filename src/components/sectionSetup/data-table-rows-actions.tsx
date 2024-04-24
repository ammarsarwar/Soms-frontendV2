"use client";
import { useState, useEffect } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Icons } from "../ui/icons";
import { updateSection } from "@/server/section/actions";
import { Section } from "@/schemas";
import { getStudentsCount } from "@/server/student_profile/actions";
import { toast } from "sonner";
interface DataTableRowActionsProps {
  row: Row<Section>;
}
interface IFormSchema {
  name: string;
  noOfStudents: number | null;
  sectionID: number;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  console.log(row.original);
  // const task = branchSchema.parse(row.original);
  const section = row.original as Section;
  const [studentCount, setStudentCount] = useState<number>(0);
  useEffect(() => {
    // Function to fetch student count and update state
    const fetchStudentCount = async () => {
      const students = await getStudentsCount(section.id);
      if (students) {
        // Assuming `students` is an array, update the count
        setStudentCount(students.length);
        console.log(
          `The current count of students in this section is ${students.length}`
        );
      }
    };

    fetchStudentCount();
  }, [section.id]);
  const form = useForm<IFormSchema>({
    defaultValues: {
      name: section.name,
      noOfStudents: section.max_no_of_student,
      sectionID: section.id,
    },
    mode: "onChange",
  });

  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const onSubmit = async (values: IFormSchema) => {
    console.log("values", values);
    const refinedData = {
      ...values,
      max_no_of_student: values.noOfStudents,
    };
    // console.log("refinedData", refinedData);
    const { sectionID, ...updatedValues } = refinedData;

    console.log("Payload for update:", refinedData);

    const res = await updateSection(sectionID, refinedData);
    if (res === undefined) {
      toast.error("Error updating the section");
    } else {
      toast.success("Your section has been updated");
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
          <DialogContent className="max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Section Details</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Branch Name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {section.grade?.department?.campus?.branch?.name}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Campus Name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {section.grade?.department?.campus?.name}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Department Name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {section.grade?.department?.name}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Grade Name</p>
                  <p className="text-sm text-muted-foreground">
                    {section.grade?.name}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Section Name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {section.name}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Current Number Of Students
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {section.max_no_of_student}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Class Capacity
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {studentCount}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <DropdownMenuSeparator />
        <Dialog>
          <DialogTrigger asChild>
            <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start">
              Edit
            </p>
          </DialogTrigger>
          <DialogContent className="max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Edit Section</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-8">
                <div className="grid gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Branch Name
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <Input
                        value={section.grade?.department?.campus?.branch?.name}
                        disabled
                        id="branchName"
                      />
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Campus Name
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <Input
                        value={section.grade?.department?.campus?.name}
                        disabled
                        id="campusName"
                      />
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Department Name
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <Input
                        value={section.grade?.department?.name}
                        disabled
                        id="deptName"
                      />
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Grade Name
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <Input
                        value={section.grade?.name}
                        disabled
                        id="deptName"
                      />
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="name">Section Name</Label>
                  <Input id="name" {...register("name")} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="noOfStudents">Class Capacity</Label>

                  <Input
                    {...register("noOfStudents")}
                    id="noOfStudents"
                    type="number"
                  />
                </div>
              </div>
              <div className="mt-10">
                <Button disabled={isLoading || isSubmitting} type="submit">
                  {isLoading ||
                    (isSubmitting && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ))}
                  Update
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
