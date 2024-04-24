"use client";

import { Button, buttonVariants } from "../ui/button";
import { startTransition, useRef, useState, useTransition } from "react";
import BranchTableSkeleton from "../skeletons/branch-table-skeleton";
import {
  Department,
  Section,
  TAssignedLessonsSchema,
  TStudentProfileListForReportsSchema,
  TStudentTransferSchema,
} from "@/schemas";
import SectionFilterComponent from "../filterComponent/section-filter-component";
import UploadCsvComponent from "./upload-csv-component";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { postBulkCreateStudents } from "@/server/user/action";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Icons } from "../ui/icons";
import SectionFilterMidYearComponent from "../filterComponent/section-filter-midYear-component";
import DepartmentFilterComponent from "../filterComponent/department-filter-component";
import SectionByDeptIdAssignLessonFilterComponent from "../filterComponent/section-by-deptId-AssignLesson-filter";
import { getGenericStudentsBySection } from "@/server/reports/actions";

const MidYearComponent = ({}) => {
  const [selectedDepartment, setSelectedDeparment] =
    useState<Department | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [isStudentLoading, setIsStudentLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedLesson, setSelectedLesson] =
    useState<TAssignedLessonsSchema | null>(null);
  const [lessons, setLessons] = useState<TAssignedLessonsSchema[]>([]);
  const [isLessonLoading, setIsLessonLoading] = useState(false);
  const [bulkStudentData, setBulkStudentData] = useState<
    TStudentTransferSchema[]
  >([]);
  const [assignedLessons, setAssignedLessons] = useState<
    TAssignedLessonsSchema[]
  >([]);
  const [isAssignedLessonLoading, setIsAssignedLessonLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const isMounted = useRef(true);
  const [students, setStudents] = useState<
    TStudentProfileListForReportsSchema[]
  >([]);
  const handleUpload = async () => {
    if (selectedSection) {
      startTransition(() => {
        postBulkCreateStudents(bulkStudentData, selectedSection?.id).then(
          (data) => {
            if (data.success) {
              toast.success(data.success);
            } else {
              toast.error(data.error);
            }
          }
        );
      });
    }
  };
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
          {/* <SectionFilterComponent
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            setLessons={setLessons}
            isLessonLoading={isLessonLoading}
            setIsLessonLoading={setIsLessonLoading}
          /> */}
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

          {selectedSection ? (
            <UploadCsvComponent
              bulkStudentData={bulkStudentData}
              setBulkStudentData={setBulkStudentData}
              open={open}
              setOpen={setOpen}
              isFileSelected={isFileSelected}
              setIsFileSelected={setIsFileSelected}
            />
          ) : null}
        </div>
      </div>
      <div className="mt-8 mb-12">
        {isStudentLoading ? (
          <BranchTableSkeleton />
        ) : bulkStudentData.length > 0 ? (
          <div className="flex flex-col gap-8 items-center">
            <div className="w-full flex justify-end">
              <Button onClick={handleUpload} disabled={isPending} type="submit">
                {isPending && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Import Students
              </Button>
            </div>
            <ScrollArea className="w-[50rem] whitespace-nowrap rounded-md border">
              <Table>
                <TableCaption>Please review this list</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>First name</TableHead>
                    <TableHead>Middle name</TableHead>
                    <TableHead>Last name</TableHead>
                    <TableHead>First name arabic</TableHead>
                    <TableHead>Middle name arabic</TableHead>
                    <TableHead>Last name arabic</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Date of birth</TableHead>
                    <TableHead>Parent name</TableHead>
                    <TableHead>Parent name arabic</TableHead>
                    <TableHead>Parent email</TableHead>
                    <TableHead>Relation to child</TableHead>
                    <TableHead>Phone no</TableHead>
                    <TableHead>Emergency phone no</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bulkStudentData.map((appData, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {appData.student_first_name_english}
                      </TableCell>
                      <TableCell>
                        {appData.student_middle_name_english}
                      </TableCell>
                      <TableCell>{appData.student_last_name_english}</TableCell>
                      <TableCell>{appData.student_first_name_arabic}</TableCell>
                      <TableCell>
                        {appData.student_middle_name_arabic}
                      </TableCell>
                      <TableCell>{appData.student_last_name_arabic}</TableCell>
                      <TableCell>{appData.student_gender}</TableCell>
                      <TableCell>{appData.student_date_of_birth}</TableCell>
                      <TableCell>{appData.parent_name_english}</TableCell>
                      <TableCell>{appData.parent_name_arabic}</TableCell>
                      <TableCell>{appData.parent_email}</TableCell>
                      <TableCell>{appData.relation_to_child}</TableCell>
                      <TableCell>{appData.parent_phone_number}</TableCell>
                      <TableCell>{appData.emergency_phone_number}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter></TableFooter>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MidYearComponent;
