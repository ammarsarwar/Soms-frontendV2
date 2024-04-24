"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { IncidentData } from "./data/schema";
import { Button } from "@/components/ui/button";
import { updateIncidents } from "@/serverParent/incidents/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DataTableRowActionsProps {
  row: Row<IncidentData>;
}

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
export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const incidentRow = row.original as IncidentData;

  const handleAcknowledgeClick = async () => {
    try {
      const result = await updateIncidents(incidentRow.id);
      if (result) {
        toast.success("Incident acknowledged successfully");
        // Optionally, trigger a re-fetch or update of your incidents list here
        // For example, if using React Query, you might invalidate the incidents query
      } else {
        // Assuming the updateIncidents function returns undefined or a falsy value on failure
        toast.error("Failed to acknowledge the incident");
      }
    } catch (error) {
      console.error("Error acknowledging the incident:", error);
      // Handle the error, possibly by showing a user-friendly error message
      toast.error(
        "An error occurred while acknowledging the incident. Please try again."
      );
    }
  };

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
                <p className="text-sm font-medium leading-none">
                  Grade and section
                </p>
                <p className="text-sm text-muted-foreground">
                  {incidentRow.section.grade}
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
                <p className="text-sm font-medium leading-none truncate">
                  Description
                </p>
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
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  Acknowledged by parent
                </p>
                <p className="text-sm text-muted-foreground">
                  {incidentRow.acknowledged_by_parent === true ? (
                    <>
                      <p>Acknowledged</p>
                    </>
                  ) : (
                    <>Not acknowledged</>
                  )}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {!incidentRow.acknowledged_by_parent ? (
          <>
            {" "}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start">
                  Acknowledge
                </p>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You are acknowleding this incident. This action cannot be
                    undone
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleAcknowledgeClick}>
                    Acknowledge
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
