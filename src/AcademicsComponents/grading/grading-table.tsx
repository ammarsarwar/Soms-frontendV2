"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import SectionFilterComponent from "./section-filter-component";
import LessonFilterComponent from "./lesson-filter-component";
import { useEffect, useRef, useState } from "react";

import { useAttendenceStore } from "@/GlobalStore/attendenceStore";
import { toast } from "sonner";
import { TSectionNewSchema } from "../attendence/attendence.types";
import { getSelectedStudentsForGradingByCourseId } from "@/serverAcademics/grading/actions";
import { TStudentGradingSchema } from "./grading.types";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { dummy } from "./dummy";
import { AlertTriangle, BookCheck, ListTodo } from "lucide-react";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TAssignedLessonsSchema } from "@/schemas";

const GradingTable = ({}) => {
  const [selectedSection, setSelectedSection] =
    useState<TSectionNewSchema | null>(null);
  const [selectedLesson, setSelectedLesson] =
    useState<TAssignedLessonsSchema | null>(null);
  const [lessons, setLessons] = useState<TAssignedLessonsSchema[]>([]);
  const [isLessonLoading, setIsLessonLoading] = useState(false);
  const [isStudentLoading, setIsStudentLoading] = useState(false);
  const [students, setStudents] = useState<TStudentGradingSchema[]>([]);

  const isMounted = useRef(true);

  //zustand logic
  const {
    course,
    setCourse,
    resetAttendanceStatus,
    setIsSaving,
    isSingleEditingEnabled,
    isSaving,
  } = useAttendenceStore();

  useEffect(() => {
    if (!isMounted.current && selectedLesson !== null) {
      const setMyCourse = () => {
        setCourse(selectedLesson.id);
      };
      setMyCourse();
    }
    isMounted.current = false;
  }, [selectedLesson]);

  const handleAttendenceFilter = async () => {
    setIsStudentLoading(true);
    const refinedData = {
      course,
    };
    const res = await getSelectedStudentsForGradingByCourseId(refinedData);
    if (res === undefined) {
      setIsStudentLoading(false);
      toast.error("Error fecting the list of students");
      setStudents([]);
      return;
    }
    setStudents(res);
    setIsStudentLoading(false);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex w-full border border-dashed border-primary p-2 rounded-md gap-3">
        <div className="hidden space-x-3 lg:flex">
          <SectionFilterComponent
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            setLessons={setLessons}
            isLessonLoading={isLessonLoading}
            setIsLessonLoading={setIsLessonLoading}
          />
          <LessonFilterComponent
            selectedLesson={selectedLesson}
            setSelectedLesson={setSelectedLesson}
            lessons={lessons}
            isLessonLoading={isLessonLoading}
            setIsLessonLoading={setIsLessonLoading}
          />
          <Button variant={"secondary"} onClick={handleAttendenceFilter}>
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
            <p>Please select section and course to see the list of students</p>
          </div>
        ) : (
          <>
            {/* <div className="flex w-full justify-end">
              <Link
                href="/admin/grading/mark"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                <BookCheck height={18} width={18} />
                Mark Grading
              </Link>
            </div> */}
            <DataTable data={students} columns={columns} />
          </>
        )}
      </div>
    </div>
  );
};

export default GradingTable;
