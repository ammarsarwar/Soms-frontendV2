"use client";

import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, BookOpenCheck, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewAssessmentForm from "./new-assessment-form";
import {
  Department,
  Grade,
  Section,
  TAssessemntInfoSchema,
  TAssignedLessonsSchema,
  TKgAssessemntInfoSchema,
  TLessonSchema,
} from "@/schemas";
import GradeFilterComponent from "@/components/filterComponent/grade-filter-component";
import {
  getAssessmentsByGenericLessonId,
  getAssessmentsByGradesId,
} from "@/server/grading/assessment/action";
import { toast } from "sonner";
import { useAttendenceStore } from "@/GlobalStore/attendenceStore";
import DepartmentFilterComponent from "@/components/filterComponent/department-filter-component";
import GradeByDeptIdFilterComponent from "@/components/filterComponent/grade-by-deptId-filter";
import SectionByDeptIdFilterComponent from "@/components/filterComponent/section-by-deptId-AssignLesson-filter";
import GenericLessonFilterComponent from "@/components/filterComponent/generic-lesson-filter-component";
import NewKgAssessmentForm from "./new-kg-assessment-form";
import SectionByDeptIdGenericLessonFilterComponent from "@/components/filterComponent/section-by-deptId-GenericLesson-Component";
import AssessmentDetailsDialog from "./edit-assessment-form";

const AssessmentComponent = () => {
  const [selectedDepartment, setSelectedDeparment] =
    useState<Department | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [isLessonLoading, setIsLessonLoading] = useState(false);
  const [lessons, setLessons] = useState<TLessonSchema[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<TLessonSchema | null>(
    null
  );
  const [isAssessmentLoading, setIsAssessmentLoading] = useState(false);
  const [assessments, setAssessments] = useState<TAssessemntInfoSchema[]>([]);
  const [kgAssessments, setKgAssessments] = useState<TKgAssessemntInfoSchema[]>(
    []
  );
  const [open, setOpen] = useState(false);
  const [isFilterAppiled, setIsFilterApplied] = useState(false);
  const isMounted = useRef(true);

  const [currentAssessment, setCurrentAssessment] =
    useState<TAssessemntInfoSchema | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const handleAssessmentClick = (assessment: TAssessemntInfoSchema) => {
    setCurrentAssessment(assessment); // Set the clicked assessment as current
    setEditOpen(true); // Open the dialog
  };
  //zustand logic
  const { isAssessmentRefectched, setIsAssessmentRefetched } =
    useAttendenceStore();

  useEffect(() => {
    if (selectedDepartment?.department_type === "KG") {
      if (!isMounted.current && selectedLesson !== null) {
        const getUpdatedGrades = () => {
          handleAssessmentFilter();
          setIsAssessmentRefetched(false);
        };
        getUpdatedGrades();
      }
      isMounted.current = false;
    } else {
      if (!isMounted.current && selectedGrade !== null) {
        const getUpdatedGrades = () => {
          handleAssessmentFilter();
          setIsAssessmentRefetched(false);
        };
        getUpdatedGrades();
      }
      isMounted.current = false;
    }
  }, [isAssessmentRefectched]);

  const handleAssessmentFilter = async () => {
    setIsFilterApplied(true);
    setAssessments([]);
    setIsAssessmentLoading(true);

    if (selectedDepartment?.department_type === "KG") {
      try {
        const res = await getAssessmentsByGenericLessonId(selectedLesson?.id);
        // console.log(res);
        setKgAssessments(res);
        setIsFilterApplied(true);
        setIsAssessmentLoading(false);
      } catch (error) {
        toast.error("Error getting assessments");
        setIsFilterApplied(true);
        setAssessments([]);
        setIsAssessmentLoading(false);
      } finally {
        setIsFilterApplied(true);
        setAssessments([]);
        setIsAssessmentLoading(false);
      }
    } else {
      try {
        const res = await getAssessmentsByGradesId(selectedGrade?.id);
        console.log(res);
        setAssessments(res);
        setIsFilterApplied(true);
        setIsAssessmentLoading(false);
      } catch (error) {
        toast.error("Error getting assessments");
        setIsFilterApplied(true);
        setIsAssessmentLoading(false);
      } finally {
        setIsFilterApplied(true);
        setIsAssessmentLoading(false);
      }
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
            <>
              <SectionByDeptIdGenericLessonFilterComponent
                selectedDepartment={selectedDepartment}
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
                setIsLessonLoading={setIsLessonLoading}
                isLessonLoading={isLessonLoading}
                setLessons={setLessons}
              />
              <GenericLessonFilterComponent
                selectedLesson={selectedLesson}
                setIsLessonLoading={setIsLessonLoading}
                isLessonLoading={isLessonLoading}
                setSelectedLesson={setSelectedLesson}
                lessons={lessons}
              />
            </>
          ) : selectedDepartment &&
            selectedDepartment.department_type !== "KG" ? (
            <GradeByDeptIdFilterComponent
              selectedDepartment={selectedDepartment}
              selectedGrade={selectedGrade}
              setSelectedGrade={setSelectedGrade}
            />
          ) : null}
          <Button variant={"secondary"} onClick={handleAssessmentFilter}>
            Apply filters
          </Button>
        </div>
      </div>
      <div>
        {isAssessmentLoading && isFilterAppiled && (
          <div className="flex items-center space-x-4 mt-8">
            <Skeleton className="h-[150px] w-[200px]" />
            <Skeleton className="h-[150px] w-[200px]" />
            <Skeleton className="h-[150px] w-[200px]" />
          </div>
        )}
        {!isAssessmentLoading &&
          isFilterAppiled &&
          (selectedDepartment?.department_type !== "KG" &&
          assessments.length > 0 ? (
            <div className="flex gap-3 mt-4">
              {assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  onClick={() => handleAssessmentClick(assessment)}
                >
                  <Card className="w-[200px]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {assessment.name}
                      </CardTitle>
                      <BookOpenCheck
                        width={20}
                        height={20}
                        className="text-primary"
                      />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-primary">
                        {Math.floor(Number(assessment.total_marks))} Marks
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {Math.floor(Number(assessment.weightage))} % weightage
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}{" "}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Card className="w-[200px]">
                    <div className="w-full flex flex-col gap-2 justify-center items-center h-full cursor-pointer hover:bg-slate-50 hover:text-primary">
                      <Plus />
                      <p className="text-sm text-muted-foreground">Add new</p>
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create new assessment</DialogTitle>
                    <DialogDescription>
                      You can create new assessment here, Close the dialog when
                      you are done.
                    </DialogDescription>
                  </DialogHeader>
                  <NewAssessmentForm
                    grade={selectedGrade?.id}
                    setOpen={setOpen}
                  />
                  <DialogFooter></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : selectedDepartment?.department_type !== "KG" ? (
            <div className="w-full flex flex-col mt-12 gap-8">
              <div className="flex gap-2">
                <AlertTriangle />
                <p>No assessment found, Please create one</p>
              </div>
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="w-[200px] h-[100px]">
                      <div className="w-full flex flex-col gap-2 justify-center items-center h-full cursor-pointer hover:bg-slate-50 hover:text-primary">
                        <Plus />
                        <p className="text-sm text-muted-foreground">Add new</p>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create new assessment</DialogTitle>
                      <DialogDescription>
                        You can create new assessment here, Close the dialog
                        when you are done.
                      </DialogDescription>
                    </DialogHeader>
                    <NewAssessmentForm
                      grade={selectedGrade?.id}
                      setOpen={setOpen}
                    />
                    <DialogFooter></DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ) : kgAssessments.length > 0 ? (
            <div className="flex gap-2 mt-4">
              {kgAssessments.map((assessment) => (
                <div key={assessment.id}>
                  <Card className="w-[200px] h-[150px]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {assessment.name}
                      </CardTitle>
                      <BookOpenCheck
                        width={20}
                        height={20}
                        className="text-primary"
                      />
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground truncate ...">
                        {assessment.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}{" "}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Card className="w-[200px]">
                    <div className="w-full flex flex-col gap-2 justify-center items-center h-full cursor-pointer hover:bg-slate-50 hover:text-primary">
                      <Plus />
                      <p className="text-sm text-muted-foreground">Add new</p>
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create new assessment</DialogTitle>
                    <DialogDescription>
                      You can create new assessment here, Close the dialog when
                      you are done.
                    </DialogDescription>
                  </DialogHeader>
                  <NewKgAssessmentForm
                    lesson={selectedLesson?.id}
                    setOpen={setOpen}
                  />
                  <DialogFooter></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="w-full flex flex-col mt-12 gap-8">
              <div className="w-full flex flex-col mt-12 gap-8">
                <div className="flex gap-2">
                  <AlertTriangle />
                  <p>No assessment found, Please create one</p>
                </div>
                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="w-[200px] h-[100px]">
                        <div className="w-full flex flex-col gap-2 justify-center items-center h-full cursor-pointer hover:bg-slate-50 hover:text-primary">
                          <Plus />
                          <p className="text-sm text-muted-foreground">
                            Add new
                          </p>
                        </div>
                      </Card>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create new assessment</DialogTitle>
                        <DialogDescription>
                          You can create new assessment here, Close the dialog
                          when you are done.
                        </DialogDescription>
                      </DialogHeader>
                      <NewKgAssessmentForm
                        setOpen={setOpen}
                        lesson={selectedLesson?.id}
                      />
                      <DialogFooter></DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))}

        {!isAssessmentLoading && !isFilterAppiled && (
          <div className="flex w-full justify-center h-screen items-center gap-2">
            <AlertTriangle />
            <p>Please select filters to see assessments</p>
          </div>
        )}
      </div>
      <AssessmentDetailsDialog
        grade={selectedGrade?.id}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        assessment={currentAssessment}
      />
    </div>
  );
};

export default AssessmentComponent;
