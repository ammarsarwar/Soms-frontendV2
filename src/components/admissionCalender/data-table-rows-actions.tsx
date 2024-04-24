"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button, buttonVariants } from "@/components/ui/button";
import { useForm } from "react-hook-form";
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
import { cn } from "@/lib/utils";
import {
  postAdmissionCalenderClose,
  updateAdmissionCalendar,
} from "@/server/school-calender-server/admissionCalender/actions";
import { toast } from "sonner";
import { TAdmissionCalenderSchema } from "@/schemas";
import { Icons } from "../ui/icons";
import { useTransition } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
interface IFormSchema {
  calendarID: number;
  start_date: string;
  end_date: string;
}
export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isPending, startTransition] = useTransition();
  const admissionRow = row.original as TAdmissionCalenderSchema;

  const form = useForm<IFormSchema>({
    defaultValues: {
      calendarID: admissionRow.id,
      start_date: admissionRow.start_date,
      end_date: admissionRow.end_date,
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
    console.log(values);
    const { calendarID, ...updatedValues } = values;
    try {
      const res = await updateAdmissionCalendar(calendarID, updatedValues);
      if (res === undefined) {
        toast.error("Error updating the Admission Calendar");
      } else {
        toast.success("Admission Calendar has been updated");
      }
    } catch (error: any) {
      console.error(error);
    }
    // reset();
  };

  // //close calender logic
  const closeCalenderHandle = async (values: TAdmissionCalenderSchema) => {
    const refinedData = {
      id: values.id,
      status: values.status === "Open" ? "Closed" : "Open",
    };
    startTransition(() => {
      postAdmissionCalenderClose(refinedData).then((data) => {
        if (data.success) {
          toast.success(data.success);
        } else {
          toast.error(data.error);
        }
      });
    });
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start cursor-pointer">
              {admissionRow.status === "Open"
                ? "Close calender"
                : "Open calender"}
            </p>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                {admissionRow.status === "Open"
                  ? "This will close this admission calender and pause all admission application related to this calender."
                  : "This will open this admission calender and allow all admission application related to this calender."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => closeCalenderHandle(admissionRow)}
                className={cn(
                  buttonVariants({
                    variant:
                      admissionRow.status === "Open"
                        ? "destructive"
                        : "default",
                  })
                )}
              >
                {isPending && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {admissionRow.status === "Open"
                  ? "Close calender"
                  : "Open Calender"}
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
              <DialogTitle>Edit Admission Calendar</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
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
