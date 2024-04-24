"use client";

import { Button, buttonVariants } from "@/components/ui/button";

import LessonFilterComponent from "@/TeacherComponents/filterComponent/lesson-filter-component";
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
import { getDismissalStudentBySection } from "@/serverTeacher/dismissal/actions";

import { AlertTriangle, BookCheck, ListTodo } from "lucide-react";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TAssignedLessonsSchema } from "@/schemas";
import { TDismissalNormalSchema } from "../schemas";
import { FaBell } from "react-icons/fa";
import { updateDismissalRequestsProgress } from "@/serverTeacher/dismissal/actions";
import { useSession } from "next-auth/react";

const DismissalView = ({}) => {
  const { data: session, status } = useSession();
  const [selectedLesson, setSelectedLesson] =
    useState<TAssignedLessonsSchema | null>(null);
  const [lessons, setLessons] = useState<TAssignedLessonsSchema[]>([]);
  const [isLessonLoading, setIsLessonLoading] = useState(false);
  const [isStudentLoading, setIsStudentLoading] = useState(false);
  const [students, setStudents] = useState<TDismissalNormalSchema[]>([]);
  const [selectedStudent, setSelectedStudent] =
    useState<TDismissalNormalSchema | null>(null);

  const handleStudentClick = (student: TDismissalNormalSchema) => {
    setSelectedStudent(student);
  };

  const handleDismissalFilter = async () => {
    // Ensure there is a selected lesson and it has a section with an ID
    if (
      !selectedLesson ||
      !selectedLesson.section ||
      !selectedLesson.section.id
    ) {
      toast.error("Please select a lesson and section first.");
      return; // Exit early if there's no selected lesson or section ID
    }

    setIsStudentLoading(true); // Start loading
    try {
      const res = await getDismissalStudentBySection(selectedLesson.section.id);
      if (!res) {
        toast.error("Error fetching the list of students. Please try again.");
        setStudents([]);
      } else {
        setStudents(res);
        console.log("this is students", students);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setStudents([]);
    } finally {
      setIsStudentLoading(false);
    }
  };

  const handleDismissalProgress = async () => {
    if (session && session.user && session.user.id) {
      const userId = session.user.userProfiles;
      if (!selectedStudent || !selectedStudent.dismissal_request) return;

      const dismissalId = selectedStudent.dismissal_request.id;
      const refinedData = {
        dismissal_progress: "Child on the Way",
        assigned_teacher: Number(userId),
      };
      try {
        await updateDismissalRequestsProgress(dismissalId, refinedData);
        toast.success("Dismissal progress updated successfully.");

        setSelectedStudent(null);
      } catch (error) {
        console.error("Error updating dismissal progress:", error);
        toast.error("Failed to update dismissal progress.");
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex w-full border border-dashed border-primary p-2 rounded-md gap-3">
        <div className="hidden space-x-3 lg:flex">
          <LessonFilterComponent
            selectedLesson={selectedLesson}
            setLessons={setLessons}
            setSelectedLesson={setSelectedLesson}
            lessons={lessons}
            isLessonLoading={isLessonLoading}
            setIsLessonLoading={setIsLessonLoading}
          />
          <Button variant={"secondary"} onClick={handleDismissalFilter}>
            Apply filters
          </Button>
        </div>
      </div>
      <div className="mt-8 mb-12">
        {isStudentLoading ? (
          <BranchTableSkeleton />
        ) : students.length === 0 ? (
          <div className="w-full flex justify-center items-center mt-36 gap-3">
            <AlertTriangle />
            <p>Please select course to see the list of students</p>
          </div>
        ) : (
          <>
            <div className="w-full">
              <div className="flex flex-wrap justify-center">
                {students.map((stu, index) => (
                  <div key={index} className="p-4 relative">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <div
                          className="flex flex-col items-center p-4 bg-white shadow-lg rounded-lg cursor-pointer "
                          onClick={() => handleStudentClick(stu)}
                        >
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center relative  ${
                              stu.dismissal_request?.dismissal_progress ===
                              "Awaiting Dismissal"
                                ? "bg-red-600"
                                : stu.dismissal_request?.dismissal_progress ===
                                  "Child on the Way"
                                ? "bg-amber-200"
                                : stu.dismissal_request?.dismissal_progress ===
                                  "Child Received"
                                ? "bg-green-500"
                                : "bg-gray-200"
                            }`}
                          >
                            <span className="text-sm font-semibold">
                              {stu.student_first_name_english.charAt(0)}
                            </span>
                            {stu.dismissal_request?.dismissal_progress ===
                              "Awaiting Dismissal" && (
                              <FaBell className="text-black text-lg absolute -right-2 -top-2 animate-ring" />
                            )}
                          </div>
                          <p className="mt-2 text-sm font-medium">
                            {stu.student_first_name_english}{" "}
                            {stu.student_middle_name_english}{" "}
                            {stu.student_last_name_english}
                          </p>
                          <p className="mt-1 text-sm">
                            {stu.dismissal_request?.dismissal_progress}
                          </p>
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {stu.student_first_name_english}{" "}
                            {stu.student_last_name_english}s dismissal details
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        {selectedStudent?.dismissal_request
                          ?.dismissal_progress === "Awaiting Dismissal" ? (
                          <>
                            <div>
                              This will dismiss the student from the class
                              <AlertDialogFooter>
                                <AlertDialogCancel>Close</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDismissalProgress}
                                >
                                  Yes
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </div>
                          </>
                        ) : selectedStudent?.dismissal_request
                            ?.dismissal_progress === "Child on the Way" ? (
                          <>
                            <div>
                              Current status is child on the way
                              <AlertDialogFooter>
                                <AlertDialogCancel>Close</AlertDialogCancel>
                              </AlertDialogFooter>
                            </div>
                          </>
                        ) : selectedStudent?.dismissal_request
                            ?.dismissal_progress === "Child Received" ? (
                          <>
                            <div>
                              Current status is child recieved
                              <AlertDialogFooter>
                                <AlertDialogCancel>Close</AlertDialogCancel>
                              </AlertDialogFooter>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              Currently there is no dismissal request recieved
                              <AlertDialogFooter>
                                <AlertDialogCancel>Close</AlertDialogCancel>
                              </AlertDialogFooter>
                            </div>
                          </>
                        )}
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DismissalView;
