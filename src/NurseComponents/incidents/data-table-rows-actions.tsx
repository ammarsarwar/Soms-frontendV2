"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { IncidentData } from "./data/schema";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
interface DataTableRowActionsProps {
  row: Row<IncidentData>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const incidentRow = row.original as IncidentData;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0">
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
              <DialogTitle>Incident Details</DialogTitle>
              <DialogDescription>
                View incident details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              {/* Student ID */}
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Student ID</p>
                <p className="text-sm text-muted-foreground">
                  {incidentRow.student.id}
                </p>
              </div>

              {/* Student Name */}
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Student Name</p>
                <p className="text-sm text-muted-foreground">
                  {incidentRow.student.student_first_name_arabic}
                  {""}
                  {incidentRow.student.student_middle_name_english}
                  {""}
                  {incidentRow.student.student_last_name_english}
                  {""}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Section</p>
                <p className="text-sm text-muted-foreground">
                  {incidentRow.section.name}
                </p>
              </div>

              {/* Date & Time of Incident */}
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  Date & Time of Incident
                </p>
                <p className="text-sm text-muted-foreground">
                  {incidentRow.date_time_of_incident
                    ? format(
                        new Date(incidentRow.date_time_of_incident),
                        "PPpp"
                      )
                    : "N/A"}
                </p>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Location</p>
                <p className="text-sm text-muted-foreground">
                  {incidentRow.location}
                </p>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Description</p>
                <p className="text-sm text-muted-foreground">
                  {incidentRow.description}
                </p>
              </div>

              {/* Actions Taken */}
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  Actions Taken
                </p>
                <p className="text-sm text-muted-foreground">
                  {incidentRow.actions_taken}
                </p>
              </div>
            </div>
            <DialogFooter>{/* Footer content (if any) */}</DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
