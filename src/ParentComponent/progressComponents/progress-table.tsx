"use client";
import React, { useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { StudentProfile } from "@/components/student/data/schema";
import { getProgress } from "@/serverParent/progress/actions";
import { ReportsSchema } from "./data/schema";
import StudentSelector from "@/ParentComponent/studentSelect/StudentSelector";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import { AlertTriangle } from "lucide-react";
import { Lesson } from "../lessonSelect/lesson-Types";
import StudentLessonSelector from "../studentSelect/studentLessonSelect";
const ProgressTable = () => {
  const [progressList, setProgressList] = useState<ReportsSchema[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
    null
  );
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);

  const handleStudentSelect = (student: StudentProfile | null) => {
    setSelectedStudent(student);
    setFiltersApplied(false);
  };

  const fetchProgressData = async () => {
    if (selectedStudent) {
      setIsLoading(true);
      try {
        const data = await getProgress(selectedStudent.id, selectedLesson?.id);
        setProgressList(data);
      } catch (error) {
        console.error("Error fetching progress data:", error);
        setProgressList([]);
      } finally {
        setIsLoading(false);
        setFiltersApplied(true);
      }
    }
  };
  const handleLessonSelect = (lesson: Lesson | null) => {
    setSelectedLesson(lesson);
    console.log("this is lesson in parent", selectedLesson);
  };
  return (
    <>
      <div className="flex w-full border border-dashed border-primary p-2 rounded-md gap-3">
        <div className="hidden space-x-3 lg:flex">
          <StudentLessonSelector
            onStudentSelect={handleStudentSelect}
            onLessonSelect={handleLessonSelect} // Pass the function to the StudentSelector component
          />

          <Button
            type="button"
            variant="secondary"
            disabled={!selectedStudent || !selectedLesson}
            onClick={fetchProgressData}
          >
            Apply filters
          </Button>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-primary rounded-full"></div>
          <div>
            <p className="text-sm text-muted-foreground">Excelent</p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>
            <div>
              <p className="text-sm text-muted-foreground">
                Room for improvement
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-500 rounded-full"></div>
            <div>
              <p className="text-sm text-muted-foreground">Cause of concern</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
            <div>
              <p className="text-sm text-muted-foreground">Not marked</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        {isLoading ? (
          <BranchTableSkeleton />
        ) : !selectedStudent ? (
          <div className="w-full flex justify-center items-center mt-36 gap-3">
            <AlertTriangle size={24} />
            Please select a student to view its progress.
          </div>
        ) : filtersApplied && progressList.length === 0 ? (
          <div className="w-full flex justify-center items-center mt-36 gap-3">
            <AlertTriangle size={24} />
            No progress marked against the selected student.
          </div>
        ) : filtersApplied ? (
          <DataTable data={progressList} columns={columns} />
        ) : null}
      </div>
    </>
  );
};

export default ProgressTable;
