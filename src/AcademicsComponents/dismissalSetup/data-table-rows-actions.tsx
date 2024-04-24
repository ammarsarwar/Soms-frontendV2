"use client";
import { TDismissalSchema } from "./dismissal-types";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { useForm, Controller } from "react-hook-form";

import { cn } from "@/lib/utils";
import { updateDismissalRequestsStatus } from "@/serverAcademics/dismissal/actions";
import { toast } from "sonner";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  // const task = branchSchema.parse(row.original);
  const dismissalRow = row.original as TDismissalSchema;

  const approveHandle = async (row: TDismissalSchema) => {
    const data = {
      id: row.id,
      status: "Approved",
    };
    const res = await updateDismissalRequestsStatus(data);
    console.log(res);
    if (res !== undefined) {
      toast.success(
        `Status of dismissal request has been changed successfully to approved`
      );
    } else {
      toast.error(`Error approving the dismissal request`);
    }
  };

  const rejectHandle = async (row: TDismissalSchema) => {
    const data = {
      id: row.id,
      status: "Denied",
    };
    const res = await updateDismissalRequestsStatus(data);
    console.log(res);
    if (res !== undefined) {
      toast.success(
        `Status of dismissal request has been successfully denied `
      );
    } else {
      toast.error(`Error denying the dismissal request`);
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
              <DialogTitle>Request details</DialogTitle>
              <DialogDescription>
                View dismissal information here. Click okay when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Parent Name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {dismissalRow.student.parent_name_english}
                  </p>
                </div>
              </div>

              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2  transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    student Name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {dismissalRow.student.student_first_name_english}{" "}
                    {dismissalRow.student.student_middle_name_english}{" "}
                    {dismissalRow.student.student_last_name_english}
                  </p>
                </div>
              </div>

              <div className="-mx-2 flex items-start space-x-4 rounded-md  p-2 hover:bg-accent hover:text-accent-foreground transition-all">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Grade</p>
                  <p className="text-sm text-muted-foreground">
                    {dismissalRow.section.grade.name}
                  </p>
                </div>
              </div>

              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Section</p>
                  <p className="text-sm text-muted-foreground">
                    {dismissalRow.section.name}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-all">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Request Type
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {dismissalRow.dismissal_type}
                  </p>
                </div>
              </div>

              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Time of request
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {dismissalRow.dismissal_time}
                  </p>
                </div>
              </div>

              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-all">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Date of request
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {dismissalRow.dismissal_date}
                  </p>
                </div>
              </div>

              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Reason</p>
                  <p className="text-sm text-muted-foreground">
                    {dismissalRow.reason}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {dismissalRow.status === "Approved" ||
        dismissalRow.status === "Denied" ? null : (
          <>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start cursor-pointer text-primary">
                  Approve
                </p>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will approve this early dismissal request and approves
                    the child to be dismissed from class early
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => approveHandle(dismissalRow)}
                    className={cn(
                      buttonVariants({
                        variant: "default",
                      })
                    )}
                  >
                    Approve
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start cursor-pointer text-red-500">
                  Reject
                </p>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reject this early dismissal request and approves
                    the child can&apos;t be dismissed from class early
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => rejectHandle(dismissalRow)}
                    className={cn(
                      buttonVariants({
                        variant: "destructive",
                      })
                    )}
                  >
                    Reject
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
