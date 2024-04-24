"use client";

import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { postAdmissionCalender } from "@/server/school-calender-server/admissionCalender/actions";
import { getAcademicYears } from "@/server/school-calender-server/academicyear/actions";
import { Textarea } from "@/components/ui/textarea";
import SectionFilterComponent from "../filterComponent/section-filter-component";
import LessonFilterComponent from "../filterComponent/lesson-filter-component";
import { TSectionNewSchema } from "../attendence/attendence.types";

import { postDismissalRequests } from "@/serverAcademics/dismissal/actions";
import StudentFilterComponent from "../filterComponent/student-filter-component";
import { getStudentBySection } from "@/serverAcademics/student_profile/actions";
import { TStudentSchemaBySectionId } from "../filterComponent/filter.types";
import { TAssignedLessonsSchema } from "@/schemas";

interface IDismissalSchema {
  reason: string;
}

const DismissalFrom = () => {
  const [selectedSection, setSelectedSection] =
    useState<TSectionNewSchema | null>(null);
  const [selectedLesson, setSelectedLesson] =
    useState<TAssignedLessonsSchema | null>(null);
  const [lessons, setLessons] = useState<TAssignedLessonsSchema[]>([]);
  const [isLessonLoading, setIsLessonLoading] = useState(false);
  const [students, setStudents] = useState<TStudentSchemaBySectionId[]>([]);
  const [isStudentLoading, setIsStudentLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<TStudentSchemaBySectionId | null>(null);
  const isMounted = useRef(true);

  const form = useForm<IDismissalSchema>({
    mode: "onChange",
  });

  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  useEffect(() => {
    if (!isMounted.current && selectedLesson !== null) {
      const ListOfStudents = async () => {
        try {
          const res = await getStudentBySection(selectedSection?.id);
          console.log(res.results);
          setStudents(res.results);
          setIsStudentLoading(false);
        } catch (error) {
          console.error("error", error);
          alert("error fetching students");
          setIsStudentLoading(false);
        }
      };
      ListOfStudents();
    }
    isMounted.current = false;
  }, [selectedLesson]);

  const onSubmit = async (values: IDismissalSchema) => {
    const refinedData = {
      student: selectedStudent?.id,
      reason: values.reason,
    };
    const res = await postDismissalRequests(refinedData);
    if (res === undefined) {
      toast.error("error creating a new dismissal request");
    } else {
      toast.success("New dismissal request has been created");
    }
    reset();
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
          <StudentFilterComponent
            isStudentLoading={isStudentLoading}
            students={students}
            setSelectedStudent={setSelectedStudent}
          />
        </div>
      </div>
      <div className="mt-8">
        {selectedStudent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="w-[500px]">
            <div className="grid grid-cols-1 gap-8 mt-8 mb-8 ">
              <div className="grid gap-3">
                <Label htmlFor="type">Dismissal Type</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    placeholder="Select dismissal type"
                    defaultValue="Early dismissal"
                    disabled
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="reason">Dismissal Reason</Label>
                <div className="flex flex-col gap-2">
                  <Controller
                    name="reason"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        placeholder="Type your dismissal reason here..."
                        {...field}
                      />
                    )}
                  />
                  {errors.reason && (
                    <small className="text-red-500 font-bold">
                      {errors.reason.message}
                    </small>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full flex justify-end">
              <Button disabled={isLoading || isSubmitting} type="submit">
                {isLoading ||
                  (isSubmitting && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ))}
                Create
              </Button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default DismissalFrom;
