"use client";

import { Button } from "../ui/button";
import SectionFilterComponent from "./section-filter-component";
import LessonFilterComponent from "./lesson-filter-component";
import DateFilterComponent from "./date-filter-component";
import { useTransition, useEffect, useRef, useState } from "react";
import { AlertTriangle, Check, ListTodo, Pencil, X } from "lucide-react";
import {
  getSelectedStudentsForAttendanceByCourseIdAndDate,
  postStudentAttendence,
} from "@/server/attendence/actions";
import BranchTableSkeleton from "../skeletons/branch-table-skeleton";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useAttendenceStore } from "@/GlobalStore/attendenceStore";
import { format } from "date-fns";
import { Icons } from "../ui/icons";
import { toast } from "sonner";
import {
  Section,
  TAssignedLessonsSchema,
  TOptimizedStudentAttendenceSchema,
} from "@/schemas";

const AttendenceTable = ({}) => {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedLesson, setSelectedLesson] =
    useState<TAssignedLessonsSchema | null>(null);
  const [lessons, setLessons] = useState<TAssignedLessonsSchema[]>([]);
  const [isLessonLoading, setIsLessonLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const [isStudentLoading, setIsStudentLoading] = useState(false);
  const [students, setStudents] = useState<TOptimizedStudentAttendenceSchema[]>(
    []
  );
  const [isPending, startTransition] = useTransition();
  const isMounted = useRef(true);

  //zustand logic
  const {
    course,
    myDate,
    setCourse,
    setMyDate,
    isEditingEnabled,
    setEditingEnabled,
    myattendanceStatus,
    resetAttendanceStatus,
    setIsSaving,
    isSingleEditingEnabled,
    isSaving,
    isRefectched,
    setIsRefetched,
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

  useEffect(() => {
    if (!isMounted.current && selectedLesson !== null && date) {
      const setMyChoosenDate = () => {
        const formattedDate = format(date, "yyy-MM-dd");
        setMyDate(formattedDate);
      };
      setMyChoosenDate();
    }
    isMounted.current = false;
  }, [date]);

  useEffect(() => {
    if (!isMounted.current && selectedLesson !== null && date) {
      const getUpdatedAttendance = () => {
        handleAttendenceFilter();
        setIsRefetched(false);
      };
      getUpdatedAttendance();
    }
    isMounted.current = false;
  }, [isRefectched]);

  const handleAttendenceFilter = async () => {
    setIsStudentLoading(true);
    const refinedData = {
      course,
      date: myDate,
    };
    try {
      const res = await getSelectedStudentsForAttendanceByCourseIdAndDate(
        refinedData
      );
      // console.log(res);
      setStudents(res);
      resetAttendanceStatus();
      setIsStudentLoading(false);
    } catch (error) {
      alert("error fetching students");
      setStudents([]);
      setIsStudentLoading(false);
      resetAttendanceStatus();
      return;
    } finally {
      setIsStudentLoading(false);
      resetAttendanceStatus();
    }
  };

  const enableEditing = () => {
    setEditingEnabled(!isEditingEnabled);
  };

  const handleAttendenceSave = async () => {
    if (myattendanceStatus.length === 0) {
      setEditingEnabled(false);
      return;
    }
    startTransition(() => {
      postStudentAttendence(myattendanceStatus).then((data) => {
        setIsSaving(true);
        if (data.success) {
          setIsSaving(false);
          setEditingEnabled(false);
          toast.success(data.success);
          setIsRefetched(true);
        } else {
          toast.error(data.error);
          setIsSaving(false);
          setEditingEnabled(false);
        }
      });
    });
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
          <DateFilterComponent date={date} setDate={setDate} />
          <Button
            variant={
              selectedLesson && selectedSection && date
                ? "default"
                : "secondary"
            }
            onClick={handleAttendenceFilter}
          >
            Apply filters
          </Button>
        </div>
      </div>
      <div className="mt-8">
        {isStudentLoading ? (
          <BranchTableSkeleton />
        ) : students.length === 0 ? (
          <div className="w-full flex justify-center items-center mt-36 gap-3">
            <AlertTriangle />
            <p>Please select section and course to see the list of students</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex w-full justify-between">
              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-primary rounded-full"></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Present</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="text-sm text-muted-foreground">Absent</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-amber-500 rounded-full"></div>
                    <div>
                      <p className="text-sm text-muted-foreground">Late</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-sky-500 rounded-full"></div>
                      <div>
                        <p className="text-sm text-muted-foreground">Excused</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-slate-300 rounded-full"></div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Not marked
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                {isEditingEnabled ? (
                  <div className="flex gap-2">
                    <Button
                      variant={"outline"}
                      className="flex items-center gap-2"
                      onClick={handleAttendenceSave}
                    >
                      {isSaving || isPending ? (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          Saving
                        </>
                      ) : (
                        <>
                          {" "}
                          <Check height={15} width={15} />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      variant={"outline"}
                      className="flex items-center gap-2"
                      onClick={enableEditing}
                    >
                      <X height={15} width={15} />
                      Cancel
                    </Button>
                  </div>
                ) : isSingleEditingEnabled ? null : (
                  <Button
                    variant={"outline"}
                    className="flex items-center gap-2"
                    onClick={enableEditing}
                  >
                    <ListTodo height={18} width={18} />
                    Mark Attendence
                  </Button>
                )}
              </div>
            </div>
            <DataTable data={students} columns={columns} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendenceTable;
