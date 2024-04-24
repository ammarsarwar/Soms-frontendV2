"use client";

import { Row } from "@tanstack/react-table";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Attendance } from "./attendance-types";
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const attendanceRow = row.original as Attendance;
  return (
    <div className="flex gap-2">
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
            <DialogContent className="max-w-[560px] max-h-[300px]">
              <DialogHeader>
                <DialogTitle>Teacher details</DialogTitle>
                <DialogDescription>
                  Here you can view details regarding this course&apos;s teacher
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Teacher Name
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {attendanceRow.teacher.first_name}{" "}
                      {attendanceRow.teacher.last_name}
                    </p>
                  </div>
                </div>
                <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Teacher email
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {attendanceRow.teacher.email}
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
