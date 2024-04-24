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
import { cn } from "@/lib/utils";
import {
  postAcademicYearsDeactivate,
  updateSchoolYear,
} from "@/server/school-calender-server/academicyear/actions";
import { toast } from "sonner";
import { TSchoolYearSchema } from "@/schemas";
import { useEffect, useTransition } from "react";
import { Icons } from "../ui/icons";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
interface IFormSchema {
  yearID: number;
  start_year: number;
  end_year: number;
}
export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isPending, startTransition] = useTransition();
  const yearRow = row.original as TSchoolYearSchema;

  const form = useForm<IFormSchema>({
    defaultValues: {
      yearID: yearRow.id,
      start_year: yearRow.start_year,
      end_year: yearRow.end_year,
    },
    mode: "onChange",
  });

  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, isLoading, errors },
    watch,
    setValue,
  } = form;

  const startYear = watch("start_year");
  useEffect(() => {
    if (startYear) {
      const nextYear = Number(startYear) + 1;
      setValue("end_year", nextYear, { shouldValidate: true });
    }
  }, [startYear, setValue]);

  const onSubmit = async (values: IFormSchema) => {
    console.log(values);
    const { yearID, ...updatedValues } = values;
    try {
      const res = await updateSchoolYear(yearID, updatedValues);
      if (res === undefined) {
        toast.error("Error updating the school year");
      } else {
        toast.success("School year has been updated");
      }
    } catch (error: any) {
      console.error(error);
    }
    // reset();
  };

  //deactivate logic
  const deactivateHandle = async (values: TSchoolYearSchema) => {
    const refinedData = {
      id: values.id,
      status: values.status === "Active" ? "Inactive" : "Active",
    };
    startTransition(() => {
      postAcademicYearsDeactivate(refinedData).then((data) => {
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
              {yearRow.status === "Active" ? "Deactivate" : "Activate"}
            </p>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                {yearRow.status === "Active"
                  ? "This will deactivate the school year and pause any activity in that school year."
                  : "This will activate the school year and allow any activity in that school year."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deactivateHandle(yearRow)}
                className={cn(
                  buttonVariants({
                    variant:
                      yearRow.status === "Active" ? "destructive" : "default",
                  })
                )}
              >
                {isPending && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {yearRow.status === "Active" ? "Deactivate" : "Activate"}
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
              <DialogTitle>Edit Academic Year</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-3">
                  <Label htmlFor="start_year">Start Year</Label>
                  <Input
                    id="start_year"
                    type="number"
                    {...register("start_year", {
                      minLength: {
                        value: 4,
                        message: "Start year must be at least 4 digits",
                      },
                      maxLength: {
                        value: 4,
                        message: "Start year must be no more than 4 digits",
                      },
                    })}
                  />
                  {errors.start_year && (
                    <small className="text-red-500 font-bold">
                      {errors.start_year?.message}
                    </small>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="end_year">End Year</Label>
                  <Input
                    id="end_year"
                    type="number"
                    {...register("end_year")}
                    disabled
                  />
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
