"use client";


import LessonFilterComponent from "@/TeacherComponents/filterComponent/lesson-filter-component";
import SectionFilterComponent from "@/AcademicsComponents/filterComponent/section-filter-component";

import { useEffect, useRef, useState } from "react";
import { useAttendenceStore } from "@/GlobalStore/attendenceStore";
import { Skeleton } from "@/components/ui/skeleton";
import { getAssessmentsByCourseId } from "@/serverTeacher/grading/assessment/action";
import { toast } from "sonner";
import { TAssessemntInfoSchema } from "./assessment.types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Input } from "@/components/ui/input";
import NewAssessmentForm from "./new-assessment-form";
import { Section, TAssignedLessonsSchema } from "@/schemas";

const AssessmentComponent = () => {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedLesson, setSelectedLesson] =
    useState<TAssignedLessonsSchema | null>(null);
  const [lessons, setLessons] = useState<TAssignedLessonsSchema[]>([]);
  const [isLessonLoading, setIsLessonLoading] = useState(false);
  const [isAssessmentLoading, setIsAssessmentLoading] = useState(false);
  const [assessments, setAssessments] = useState<TAssessemntInfoSchema[]>([]);
  const [isFilterAppiled, setIsFilterApplied] = useState(false);

  const isMounted = useRef(true);

  //zustand logic
  const { course, setCourse } = useAttendenceStore();

  useEffect(() => {
    if (!isMounted.current && selectedLesson !== null) {
      const setMyCourse = () => {
        setCourse(selectedLesson.id);
      };
      setMyCourse();
    }
    isMounted.current = false;
  }, [selectedLesson]);

  const handleAssessmentFilter = async () => {
    setIsFilterApplied(false);
    setIsAssessmentLoading(true);
    setAssessments([]);
    try {
      const res = await getAssessmentsByCourseId(course);
      console.log(res);
      setAssessments(res);
      setIsFilterApplied(true);
      setIsAssessmentLoading(false);
    } catch (error) {
      toast.error("Error getting assessments");
      setIsAssessmentLoading(false);
    } finally {
      setIsAssessmentLoading(false);
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
          <Button variant={"secondary"} onClick={handleAssessmentFilter}>
            Apply filters
          </Button>
        </div>
      </div>
      <div>
        {/* {isAssessmentLoading ? (
          <div className="flex items-center space-x-4 mt-8">
            <Skeleton className="h-[150px] w-[200px]" />
            <Skeleton className="h-[150px] w-[200px]" />
            <Skeleton className="h-[150px] w-[200px]" />
          </div>
        ) : null}
        {assessments.length > 1 && selectedLesson ? (
          <div className="flex flex-col gap-8 mt-8">
            <div>
              <p className="text-lg font-semibold">
                Assessments created for this lesson:
              </p>
            </div>
            <div className="flex gap-4">
              {assessments.map((assessment) => (
                <div key={assessment.id}>
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
              ))}
              <Dialog>
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
                  <NewAssessmentForm course={course} />
                  <DialogFooter></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ) : assessments.length < 1 && selectedLesson ? (
          <div className="w-full flex flex-col mt-12 gap-8">
            <div className="flex gap-2">
              <AlertTriangle />
              <p>No assessment found, please select a lesson</p>
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
                      You can create new assessment here, Close the dialog when
                      you are done.
                    </DialogDescription>
                  </DialogHeader>
                  <NewAssessmentForm course={course} />
                  <DialogFooter></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 w-full justify-center items-center mt-36">
            <AlertTriangle />
            <p>Please select a lesson to see list of assessments</p>
          </div>
        )} */}
        {!isAssessmentLoading && assessments.length > 0 && isFilterAppiled ? (
          <div className="flex flex-col gap-8 mt-8">
            <div>
              <p className="text-lg font-semibold">
                Assessments created for this lesson:
              </p>
            </div>
            <div className="flex gap-4">
              {assessments.map((assessment) => (
                <div key={assessment.id}>
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
              ))}
              <Dialog>
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
                  <NewAssessmentForm course={course} />
                  <DialogFooter></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ) : null}

        {isAssessmentLoading && (
          <div className="flex items-center space-x-4 mt-8">
            <Skeleton className="h-[150px] w-[200px]" />
            <Skeleton className="h-[150px] w-[20s0px]" />
            <Skeleton className="h-[150px] w-[200px]" />
          </div>
        )}
        {!isAssessmentLoading && assessments.length < 1 && isFilterAppiled ? (
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
                      You can create new assessment here, Close the dialog when
                      you are done.
                    </DialogDescription>
                  </DialogHeader>
                  <NewAssessmentForm course={course} />
                  <DialogFooter></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ) : null}
        {!isFilterAppiled && (
          <div className="flex gap-2">
            <AlertTriangle />
            <p>Please select a lesson to see assessments</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentComponent;
