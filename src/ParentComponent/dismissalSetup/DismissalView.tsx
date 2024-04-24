"use client";

import { Button, buttonVariants } from "@/components/ui/button";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
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
import { Badge } from "@/components/ui/badge";
import { updateDismissalRequestsProgress } from "@/serverParent/dismissal/actions";
import { TDismissalSchema } from "@/ParentComponent/schemas";
import { AlertTriangle, BookCheck, ListTodo } from "lucide-react";

interface DismissalViewProps {
  dismissalList: TDismissalSchema[];
}

const DismissalView: React.FC<DismissalViewProps> = ({ dismissalList }) => {
  const [students, setStudents] = useState<TDismissalSchema[]>([]);
  const [open, setOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<TDismissalSchema | null>(
    null
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setStudents(dismissalList);
  }, [dismissalList]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const student = students.find(
        (s) => s.dismissal_progress === "Child on the Way"
      );
      if (student) {
        setCurrentStudent(student);
        setOpen(true);
      }
    }, 30000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [students]);
  const handleDismissalProgress = async () => {
    if (!currentStudent || !currentStudent.id) return;

    const refinedData = {
      dismissal_progress: "Child Received",
    };
    try {
      await updateDismissalRequestsProgress(currentStudent.id, refinedData);
      toast.success("Dismissal status updated to 'Child Received'.");

      // Update local state to reflect the change
      setStudents((prev) =>
        prev.map((student) =>
          student.id === currentStudent.id
            ? { ...student, dismissal_progress: "Child Received" }
            : student
        )
      );

      setCurrentStudent(null);
      setOpen(false); // Close the dialog
    } catch (error) {
      console.error("Error updating dismissal progress:", error);
      toast.error("Failed to update dismissal progress.");
    }
  };

  const handleYesClick = () => {
    handleDismissalProgress();
    if (intervalRef.current) clearInterval(intervalRef.current); // Stop the interval after updating
  };

  const handleNoClick = () => {
    setOpen(false);
    // The dialog will reappear after 20 seconds due to the ongoing interval
  };
  useEffect(() => {
    setStudents(dismissalList);
  }, [dismissalList]);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="mt-8 mb-12">
        {dismissalList.length === 0 ? (
          <div className="w-full flex justify-center items-center mt-36 gap-3">
            <AlertTriangle />
            <p>No dismissal request for this date</p>
          </div>
        ) : (
          <div className="w-full">
            <div className="flex flex-wrap justify-start">
              {students.map((student, index) => (
                <div key={index} className="p-4">
                  <div
                    className={`flex flex-col w-[350px] h-[155px] p-3 shadow-lg border rounded-lg overflow-scroll no-scrollbar ${
                      student.dismissal_type === "Early" &&
                      student.status === "Approved"
                        ? "bg-green-300"
                        : student.dismissal_type === "Early" &&
                          student.status !== "Pending"
                        ? "bg-gray-200"
                        : student.dismissal_progress === "Awaiting Dismissal"
                        ? "bg-red-200"
                        : student.dismissal_progress === "Child on the Way"
                        ? "bg-amber-200"
                        : student.dismissal_progress === "Child Received"
                        ? "bg-green-300"
                        : "bg-gray-200"
                    }`}
                  >
                    {/* Conditional rendering for the Cancel badge based on new status 'Denied' */}
                    {student.dismissal_type !== "Early" ||
                    (student.status !== "Approved" &&
                      student.status !== "Denied") ? (
                      <div className="flex justify-end">
                        <Badge
                          variant={"destructive"}
                          className="cursor-pointer"
                        >
                          Cancel
                        </Badge>
                      </div>
                    ) : (
                      <div className="h-6 w-24"></div> // Placeholder to maintain layout
                    )}

                    {/* Student information */}
                    <span className="text-xl font-bold">
                      {student.student.student_first_name_english}{" "}
                      {student.student.student_middle_name_english}{" "}
                      {student.student.student_last_name_english}
                    </span>

                    {/* Dismissal information */}
                    <div className="mt-2">
                      <ul
                        className="list-disc pl-5 space-y-2"
                        style={{ color: "rgb(102 212 255)" }}
                      >
                        <li className="text-base text-sky-500">
                          <span className="text-gray-700 text-sm font-bold">
                            {student.dismissal_type}
                          </span>
                        </li>
                        {student.dismissal_type !== "Early" && (
                          <li className="text-base text-sky-500">
                            <span className="text-gray-700 text-sm font-bold">
                              {student.dismissal_progress}
                            </span>
                          </li>
                        )}
                        {student.dismissal_type === "Early" && (
                          <li className="text-base text-sky-500">
                            <span
                              className={`text-gray-700 text-sm font-bold ${
                                student.status === "Approved"
                                  ? "text-green-500"
                                  : student.status === "Denied"
                                  ? "text-red-500" // Optionally set a red text color for denied status
                                  : ""
                              }`}
                            >
                              {student.status}
                            </span>
                          </li>
                        )}
                      </ul>

                      {/* Conditional rendering for the loading bar based on new status 'Denied' */}
                      {(student.dismissal_type === "Early" &&
                        student.status === "Pending") ||
                      (student.dismissal_type === "End Of Day" &&
                        (student.dismissal_progress === "Awaiting Dismissal" ||
                          student.dismissal_progress ===
                            "Child on the Way")) ? (
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mt-2">
                          <div className="bg-green-300 h-2 rounded-full animate-progress"></div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Child Pickup Confirmation
                      <AlertDialogDescription>
                        Please click yes if you have recieved{" "}
                        {currentStudent?.student.student_first_name_english}?
                        <div className="text-xs text-red-300 mt-2">
                          Note: This alert will be triggered every 30 seconds
                          until you confirm that you have recieved the child
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogTitle>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleNoClick}>
                      Not yet
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleYesClick}>
                      Yes
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DismissalView;
