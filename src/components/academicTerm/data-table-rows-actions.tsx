"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  postAcademicTermsDeactivate,
  updateAcademicTerm,
} from "@/server/school-calender-server/academicterm/actions";
import { TAcademicTermSchema, TAcadmicTermDisableSchema } from "@/schemas";
import { useState, useTransition } from "react";
import { Icons } from "../ui/icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarDate } from "../calendarComponent/custom-calendar";
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
interface IFormSchema {
  termID: number;
  start_date: string;
  end_date: string;
  name: string;
}
export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isPending, startTransition] = useTransition();
  const termRow = row.original as TAcademicTermSchema;

  const form = useForm<IFormSchema>({
    defaultValues: {
      termID: termRow.id,
      start_date: termRow.start_date,
      end_date: termRow.end_date,
      name: termRow.name,
    },
    mode: "onChange",
  });

  const {
    reset,
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const onSubmit = async (values: IFormSchema) => {
    console.log(values);
    const { termID, ...updatedValues } = values;
    try {
      const res = await updateAcademicTerm(termID, updatedValues);
      if (res === undefined) {
        toast.error("Error updating the Academic term");
      } else {
        toast.success("Academic Term has been updated");
      }
    } catch (error: any) {
      console.error(error);
    }
    // reset();
  };

  //deactivate logic
  const deactivateHandle = async (values: TAcademicTermSchema) => {
    const refinedData = {
      id: values.id,
      status: values.status === "Active" ? "Inactive" : "Active",
    };
    startTransition(() => {
      postAcademicTermsDeactivate(refinedData).then((data) => {
        if (data.success) {
          toast.success(data.success);
        } else {
          toast.error(data.error);
        }
      });
    });
  };
  const [currentYear] = useState(new Date().getFullYear());
  const startDateValue = watch("start_date");
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start cursor-pointer">
              {termRow.status === "Active" ? "Deactivate" : "Activate"}
            </p>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                {termRow.status === "Active"
                  ? "This will deactive this acadmic term and pause any activity in that term."
                  : "This will activate this acadmic term and allow any activity in that term."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deactivateHandle(termRow)}
                className={cn(
                  buttonVariants({
                    variant:
                      termRow.status === "Active" ? "destructive" : "default",
                  })
                )}
              >
                {isPending && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {termRow.status === "Active" ? "Deactivate" : "Activate"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Dialog>
          <DialogTrigger asChild>
            <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start">
              Edit
            </p>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Academic Term</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-3">
                  <Label htmlFor="name">Term</Label>
                  <Input id="name" {...register("name")} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input id="start_date" {...register("start_date")} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input id="end_date" {...register("end_date")} />
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={isLoading || isSubmitting || isPending}
                  type="submit"
                >
                  {isLoading ||
                    (isSubmitting && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ))}
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
