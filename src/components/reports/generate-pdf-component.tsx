"use client";

import {
  Department,
  Section,
  TAssignedLessonsSchema,
  TStudentProfileListForReportsSchema,
} from "@/schemas";
import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "../ui/button";
import { getGenericStudentsBySection } from "@/server/reports/actions";
import { toast } from "sonner";
import DepartmentFilterComponent from "../filterComponent/department-filter-component";
import SectionByDeptIdAssignLessonFilterComponent from "../filterComponent/section-by-deptId-AssignLesson-filter";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import BranchTableSkeleton from "../skeletons/branch-table-skeleton";
import { useReportsStore } from "@/GlobalStore/reportsStore";

const GeneratePdfComponent = ({}) => {
  const [selectedDepartment, setSelectedDeparment] =
    useState<Department | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [assignedLessons, setAssignedLessons] = useState<
    TAssignedLessonsSchema[]
  >([]);
  const [isAssignedLessonLoading, setIsAssignedLessonLoading] = useState(false);
  const [students, setStudents] = useState<
    TStudentProfileListForReportsSchema[]
  >([]);
  const [isReportGenerated, setIsReportGenerated] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const isMounted = useRef(true);

  //zustand logic
  const { addStudentReportsData, addDepartmentTypeSelected } =
    useReportsStore();

  useEffect(() => {
    if (!isMounted.current && selectedDepartment !== null) {
      const setMySelectedDepartment = () => {
        addDepartmentTypeSelected(selectedDepartment.department_type);
      };
      setMySelectedDepartment();
    }
    isMounted.current = false;
  }, [selectedDepartment]);

  const handleFilterApply = async () => {
    if (!selectedSection) {
      toast.error("Couldn't find the section, please try again");
    } else {
      startTransition(() => {
        getGenericStudentsBySection(selectedSection?.id)
          .then((data) => {
            setStudents(data);
          })
          .catch((error) => {
            toast.error(
              "Error fetching the list of students, Please try again later"
            );
          });
      });
    }
  };

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
            <SectionByDeptIdAssignLessonFilterComponent
              selectedDepartment={selectedDepartment}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              setIsAssignedLessonLoading={setIsAssignedLessonLoading}
              isAssignedLessonLoading={isAssignedLessonLoading}
              setAssignedLessons={setAssignedLessons}
            />
          ) : selectedDepartment &&
            selectedDepartment.department_type !== "KG" ? (
            <SectionByDeptIdAssignLessonFilterComponent
              selectedDepartment={selectedDepartment}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              setIsAssignedLessonLoading={setIsAssignedLessonLoading}
              isAssignedLessonLoading={isAssignedLessonLoading}
              setAssignedLessons={setAssignedLessons}
            />
          ) : null}
          {selectedDepartment && selectedSection ? (
            <Button
              variant={selectedSection ? "default" : "secondary"}
              onClick={handleFilterApply}
            >
              Apply filters
            </Button>
          ) : null}
        </div>
      </div>
      <div className="mt-8 mb-12">
        {isPending ? (
          <BranchTableSkeleton />
        ) : (
          <DataTable columns={columns} data={students} />
        )}
      </div>
    </div>
  );
};
export default GeneratePdfComponent;
