"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateBranch } from "@/server/branch/actions";
import { Icons } from "@/components/ui/icons";
import { TAssignedLessonsSchema } from "@/schemas";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

// interface IFormSchema {
//   branchId: number;
//   name: string;
//   branch_license: string;
//   curriculum: string;
//   location: string;
//   number_of_campuses: number;
// }

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  // const task = branchSchema.parse(row.original);
  const assignedLessonRow = row.original as TAssignedLessonsSchema;

  // console.log(branchRow);

  // const form = useForm<IFormSchema>({
  //   defaultValues: {
  //     branchId: branchRow.id,
  //     name: branchRow.name,
  //     branch_license: branchRow.branch_license,
  //     curriculum: branchRow.curriculum,
  //     location: branchRow.location,
  //     number_of_campuses: branchRow.number_of_campuses,
  //   },
  //   mode: "onChange",
  // });

  // const {
  //   reset,
  //   register,
  //   handleSubmit,
  //   control,
  //   formState: { isSubmitting, isLoading, errors },
  // } = form;

  // const onSubmit = async (values: IFormSchema) => {
  //   console.log(values);
  //   const res = await updateBranch(values);
  //   if (res === undefined) {
  //     alert("error updating the branch");
  //   } else {
  //     alert("Your branch has been updated");
  //   }
  //   // reset();
  // };

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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lesson details</DialogTitle>
              <DialogDescription>
                View lesson information here. Close tab when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Lesson name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {assignedLessonRow.course.title}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Assigned teacher
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {assignedLessonRow.teacher.first_name}{" "}
                    {assignedLessonRow.teacher.last_name}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2  transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Assigned Grade
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {assignedLessonRow.course.grade.name}
                  </p>
                </div>
              </div>

              <div className="-mx-2 flex items-start space-x-4 rounded-md  p-2 hover:bg-accent hover:text-accent-foreground transition-all">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Assigned section
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {assignedLessonRow.section.name}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
