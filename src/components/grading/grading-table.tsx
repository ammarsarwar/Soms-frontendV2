"use client";

import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  getSelectedStudentsForGradingByCourseId,
  getSelectedStudentsForGradingByCourseIdForKg,
} from "@/server/grading/actions";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import BranchTableSkeleton from "../skeletons/branch-table-skeleton";
import {
  Department,
  Section,
  TAssignedLessonsSchema,
  TLessonSchema,
  TStudentGradingSchema,
  TStudentKgGradingSchema,
} from "@/schemas";
import DepartmentFilterComponent from "../filterComponent/department-filter-component";
import SectionByDeptIdAssignLessonFilterComponent from "../filterComponent/section-by-deptId-AssignLesson-filter";
import AssignedLessonFilterComponent from "../filterComponent/assigned-lesson-filter-component";
import { useGradingStore } from "@/GlobalStore/gradingStore";
import { KGDataTable } from "./kgGrading/data-table";
import { kgcolumns } from "./kgGrading/columns";

const GradingTable = ({}) => {
  const [selectedDepartment, setSelectedDeparment] =
    useState<Department | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<TLessonSchema | null>(
    null
  );
  const [selectedAssignedLesson, setSelectedAssignedLesson] =
    useState<TAssignedLessonsSchema | null>(null);
  const [lessons, setLessons] = useState<TLessonSchema[]>([]);
  const [isLessonLoading, setIsLessonLoading] = useState(false);
  const [assignedLessons, setAssignedLessons] = useState<
    TAssignedLessonsSchema[]
  >([]);
  const [isAssignedLessonLoading, setIsAssignedLessonLoading] = useState(false);
  const [isStudentLoading, setIsStudentLoading] = useState(false);
  const [students, setStudents] = useState<TStudentGradingSchema[]>([]);
  const [kgStudents, setKgStudents] = useState<TStudentKgGradingSchema[]>([]);

  const isMounted = useRef(true);

  //zustand logic
  const {
    setAssignedCourse,
    isGradeRefetched,
    setCourse,
    setIsGradeRefetched,
  } = useGradingStore();

  console.log("refetch", isGradeRefetched);

  const handleGradeFilter = async () => {
    setIsStudentLoading(true);
    const refinedData = {
      course: selectedAssignedLesson?.id,
    };
    if (selectedDepartment?.department_type !== "KG") {
      const res = await getSelectedStudentsForGradingByCourseId(refinedData);
      if (res === undefined) {
        setIsStudentLoading(false);
        toast.error("Error fecting the list of students");
        setStudents([]);
        return;
      }
      setStudents(res);
    } else {
      const res = await getSelectedStudentsForGradingByCourseIdForKg(
        refinedData
      );
      if (res === undefined) {
        setIsStudentLoading(false);
        toast.error("Error fecting the list of students");
        setStudents([]);
        return;
      }
      setKgStudents(res);
    }
    setIsStudentLoading(false);
  };

  useEffect(() => {
    if (!isMounted.current && selectedAssignedLesson !== null) {
      if (selectedDepartment?.department_type === "KG") {
        const setMCourse = () => {
          setCourse(selectedAssignedLesson?.id);
        };
        setMCourse();
      }
    } else if (!isMounted.current && selectedAssignedLesson !== null) {
      const setMyAssignedCourse = () => {
        setAssignedCourse(selectedAssignedLesson?.id);
      };
      setMyAssignedCourse();
    }
    isMounted.current = false;
  }, [selectedAssignedLesson]);

  useEffect(() => {
    console.log("this happen");
    if (!isMounted.current && selectedAssignedLesson !== null) {
      const getUpdatedGrades = () => {
        handleGradeFilter();
        setIsGradeRefetched(false);
      };
      getUpdatedGrades();
    }
    isMounted.current = false;
  }, [isGradeRefetched]);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex w-full border border-dashed border-primary p-2 rounded-md gap-3">
        <div className="hidden space-x-3 lg:flex">
          <DepartmentFilterComponent
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDeparment}
          />
          {selectedDepartment &&
          selectedDepartment?.department_type === "KG" ? (
            <>
              <SectionByDeptIdAssignLessonFilterComponent
                selectedDepartment={selectedDepartment}
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
                setIsAssignedLessonLoading={setIsAssignedLessonLoading}
                isAssignedLessonLoading={isAssignedLessonLoading}
                setAssignedLessons={setAssignedLessons}
              />
              {/* <SectionByDeptIdGenericLessonFilterComponent
                selectedDepartment={selectedDepartment}
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
                setIsLessonLoading={setIsLessonLoading}
                isLessonLoading={isLessonLoading}
                setLessons={setLessons}
              /> */}
              {/* <GenericLessonFilterComponent
                selectedLesson={selectedLesson}
                setIsLessonLoading={setIsLessonLoading}
                isLessonLoading={isLessonLoading}
                setSelectedLesson={setSelectedLesson}
                lessons={lessons}
              />
               */}
              <AssignedLessonFilterComponent
                assignedLessons={assignedLessons}
                isAssignedLessonLoading={isAssignedLessonLoading}
                setIsAssignedLessonLoading={setIsAssignedLessonLoading}
                setSelectedAssignedLesson={setSelectedAssignedLesson}
                selectedAssignedLesson={selectedAssignedLesson}
              />
            </>
          ) : selectedDepartment &&
            selectedDepartment.department_type !== "KG" ? (
            <>
              <SectionByDeptIdAssignLessonFilterComponent
                selectedDepartment={selectedDepartment}
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
                setIsAssignedLessonLoading={setIsAssignedLessonLoading}
                isAssignedLessonLoading={isAssignedLessonLoading}
                setAssignedLessons={setAssignedLessons}
              />
              <AssignedLessonFilterComponent
                assignedLessons={assignedLessons}
                isAssignedLessonLoading={isAssignedLessonLoading}
                setIsAssignedLessonLoading={setIsAssignedLessonLoading}
                setSelectedAssignedLesson={setSelectedAssignedLesson}
                selectedAssignedLesson={selectedAssignedLesson}
              />
            </>
          ) : null}
          <Button
            variant={
              selectedLesson && selectedSection ? "default" : "secondary"
            }
            onClick={handleGradeFilter}
          >
            Apply filters
          </Button>
        </div>
      </div>
      <div className="mt-8 mb-12">
        {isStudentLoading ? (
          <BranchTableSkeleton />
        ) : (
          // : (students.length === 0 && kgStudents.length !== 0) ||
          //   (students.length !== 0 && kgStudents.length === 0) ? (
          //   <div className="w-full flex justify-center items-center mt-36 gap-3">
          //     <AlertTriangle />
          //     <p>Please select section and course to see the list of students</p>
          //   </div>
          // )
          <>
            {selectedDepartment?.department_type === "KG" ? (
              <KGDataTable data={kgStudents} columns={kgcolumns} />
            ) : (
              <DataTable data={students} columns={columns} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GradingTable;
