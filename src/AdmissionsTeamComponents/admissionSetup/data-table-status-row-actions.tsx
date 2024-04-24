"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Admission } from "./data/schema";
import { updateAdmissionStatus } from "@/serverAD/admissions/actions";
import { Controller, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";

interface DataTableStatusRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableStatusRowActions<TData>({
  row,
}: DataTableStatusRowActionsProps<TData>) {
  const {
    handleSubmit,

    setValue,
    formState: { errors, isLoading, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const application = row.original as Admission;
  const status = application.status || "N/A";

  const mapStatusToDisplayStatus = (status: string) => {
    switch (status) {
      case "Test Scheduled":
        return "Scheduled";
      case "Accepted":
        return "Passed";
      case "Rejected":
        return "Failed";
      default:
        return status; // For other statuses, return them as they are
    }
  };
  const displayStatus = mapStatusToDisplayStatus(application.status || "N/A"); // Use mapped status for display

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
  const handleStatusChange = (newStatus: string) => {
    setValue("status", newStatus);
    handleSubmit(onSubmit)();
  };
  let badgeClass = "";

  switch (application.status) {
    case "Accepted":
      badgeClass = "bg-green-500 text-white hover:bg-green-400";
      break;
    case "Completed":
      badgeClass = "hover:bg-#2dd4bf";
      break;
    case "Enrolled":
      badgeClass = "bg-sky-500 text-white hover:bg-sky-400";
      break;
    case "Rejected":
      badgeClass = "bg-red-500 text-white hover:bg-red-400";
      break;
    case "No Show":
      badgeClass = " bg-gray-200 text-white hover:bg-gray-100";
      break;
    case "Test Scheduled":
      badgeClass = "bg-amber-500 text-white hover:bg-amber-400";
      break;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="bg-transparent p-0 m-0 border-none shadow-none focus:outline-none focus:ring-0 active:outline-none active:ring-0 hover:bg-transparent"
          style={{ boxShadow: "none" }}
        >
          <Badge
            className={`${badgeClass} cursor-pointer data-[state=open]:bg-muted`}
          >
            {displayStatus}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {application.status === "Enrolled" ||
        application.status == "Completed" ||
        application.status === "Rejected" ? (
          <>
            <p className="text-xs">
              You cannot change status after {application.status}
            </p>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {application.status === "Test Scheduled" && (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start cursor-pointer">
                      Passed
                    </p>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        change the status of the applicant.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleStatusChange("Accepted")}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start cursor-pointer">
                      Failed
                    </p>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        change the status of the applicant.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleStatusChange("Rejected")}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
            {application.status === "Accepted" && (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start cursor-pointer">
                      Enrolled
                    </p>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        change the status of the applicant.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleStatusChange("Enrolled")}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start cursor-pointer">
                      Failed
                    </p>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        change the status of the applicant.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleStatusChange("Rejected")}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </form>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
