"use client";

import { Button } from "@/components/ui/button";
import SectionFilterComponent from "@/components/filterComponent/section-filter-component";
import LessonFilterComponent from "@/components/filterComponent/lesson-filter-component";
import { getStudentByProgress } from "@/server/student_profile/actions";
import { useTransition, useEffect, useRef, useState } from "react";
import { AlertTriangle, Check, ListTodo, Pencil, X } from "lucide-react";
import {
  getSelectedStudentsForAttendanceByCourseIdAndDate,
  postStudentAttendence,
} from "@/server/attendence/actions";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProgressStore } from "@/GlobalStore/progressStore";
import { format } from "date-fns";
import { Icons } from "@/components/ui/icons";
import { toast } from "sonner";
import { TAcademicTermSchema } from "@/schemas";
import { getActiveAcademicTerm } from "@/server/school-calender-server/academicterm/actions";
import {
  Section,
  TAssignedLessonsSchema,
  ProgressArraySchema,
} from "@/schemas";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { dummyProgress } from "./dummyData";
import { postProgress } from "@/server/progress/actions";

type Week = {
  label: string;
  value: string;
  start: Date;
  end: Date;
};

const ProgressTable = ({}) => {
  const [academicTerms, setAcademicTerms] = useState<TAcademicTermSchema[]>([]);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<Week | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedLesson, setSelectedLesson] =
    useState<TAssignedLessonsSchema | null>(null);
  const [lessons, setLessons] = useState<TAssignedLessonsSchema[]>([]);
  const [isLessonLoading, setIsLessonLoading] = useState(false);
  const [isStudentLoading, setIsStudentLoading] = useState(false);
  const [students, setStudents] = useState<ProgressArraySchema[]>([]);
  const [pastWeeks, setPastWeeks] = useState<Week[]>([]);
  const [isPending, startTransition] = useTransition();
  const isMounted = useRef(true);

  const {
    course,
    setCourse,
    isProgressEditingEnabled,
    setProgressEditingEnabled,
    setProgressIsSaving,
    isProgressSingleEditingEnabled,
    isProgressSaving,
    myprogressStatus,
    isProgressRefectched,
    setIsProgressRefetched,
  } = useProgressStore();

  const currentDate = new Date();
  const startDate = selectedWeek
    ? format(selectedWeek.start, "yyyy-MM-dd")
    : "";
  const endDate = selectedWeek ? format(selectedWeek.end, "yyyy-MM-dd") : "";

  // generate weeks based off of academic term
  const generateWeeks = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const weeks = [];
    let current = new Date(start);
    if (current.getDay() !== 0) {
      while (current.getDay() !== 4) {
        current.setDate(current.getDate() + 1);
      }
      weeks.push({
        start: new Date(start),
        end: new Date(current),
        label: `Week 1 ${format(start, "yyyy-MM-dd")} - ${format(
          current,
          "yyyy-MM-dd"
        )}`,
        value: "week_1",
      });
      current.setDate(current.getDate() + 3);
    }

    // Generate full weeks from Sunday to Thursday
    let weekNumber = weeks.length + 1;
    while (current <= end) {
      const weekStart = new Date(current);
      current.setDate(current.getDate() + 4); // Thursday
      const weekEnd = current > end ? new Date(end) : new Date(current);

      weeks.push({
        start: weekStart,
        end: weekEnd,
        label: `Week ${weekNumber} ${format(weekStart, "dd-MM-yyy")} - ${format(
          weekEnd,
          "dd-MM-yyy"
        )}`,
        value: `week_${weekNumber}`,
      });

      weekNumber++;
      current.setDate(current.getDate() + 3); // Next Sunday
      if (current > end) break;
    }
    return weeks;
  };

  useEffect(() => {
    if (!isMounted.current && selectedLesson !== null) {
      const fetchedTerm = async () => {
        try {
          const fetchActiveTerm = await getActiveAcademicTerm();
          setAcademicTerms(fetchActiveTerm);
          if (fetchActiveTerm.length > 0) {
            const { start_date, end_date } = fetchActiveTerm[0];
            const weeksList = generateWeeks(start_date, end_date);
            setWeeks(weeksList);
          }
        } catch (error: any) {
          console.log(error);
        }
      };
      fetchedTerm();
    }
    isMounted.current = false;
  }, [selectedLesson]);

  useEffect(() => {
    if (!isMounted.current && selectedLesson !== null) {
      const getUpdatedAttendance = () => {
        handleAttendenceFilter();
        setIsProgressRefetched(false);
      };
      getUpdatedAttendance();
    }
    isMounted.current = false;
  }, [isProgressRefectched]);

  useEffect(() => {
    if (!isMounted.current && selectedLesson !== null) {
      const setMyCourse = () => {
        setCourse(selectedLesson.id);
      };
      setMyCourse();
    }
    isMounted.current = false;
  }, [selectedLesson]);

  // useEffect(() => {
  //   if (!isMounted.current && selectedLesson !== null && weeks.length !== 0) {
  //     const setMyWeeks = () => {
  //       // Filter weeks to include only those that have already passed
  //       const pastWeeksList = weeks.filter((week) => {
  //         // Convert week.end to a Date object for comparison
  //         const weekEndDate = new Date(week.end);
  //         // Check if the week's end date is before or equal to the current date
  //         return weekEndDate <= currentDate;
  //       });
  //       console.log("pastWeeksList", pastWeeksList);
  //       setPastWeeks(pastWeeksList);
  //     };
  //     setMyWeeks();
  //   }
  //   isMounted.current = false;
  // }, [selectedLesson]);

  const handleAttendenceFilter = async () => {
    setIsStudentLoading(true);
    try {
      const fetchedStudents = await getStudentByProgress(
        selectedLesson?.id,
        startDate,
        endDate
      );
      // console.log("Fetched Students:", fetchedStudents); // Log fetched data
      // console.log("this is students", students);

      setStudents(fetchedStudents);
      setIsStudentLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
      setIsStudentLoading(false);
      return;
    } finally {
      setIsStudentLoading(false);
    }
  };

  const enableEditing = () => {
    setProgressEditingEnabled(!isProgressEditingEnabled);
  };

  const handleProgressSave = async () => {
    if (myprogressStatus?.length === 0) {
      setProgressEditingEnabled(false);
      return;
    }
    const refinedData = {
      start_date: startDate,
      end_date: endDate,
      course,
      report_data: myprogressStatus,
    };
    startTransition(() => {
      postProgress(refinedData).then((data) => {
        setProgressIsSaving(true);
        if (data.success) {
          setProgressIsSaving(false);
          setProgressEditingEnabled(false);
          toast.success(data.success);
          setIsProgressRefetched(true);
        } else {
          toast.error(data.error);
          setProgressIsSaving(false);
          setProgressEditingEnabled(false);
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
          <div>
            <Select
              onValueChange={(val) => {
                const week = weeks.find((week) => week.value === val);
                setSelectedWeek(week || null);
              }}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a week" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Weeks</SelectLabel>
                  {weeks.map((week) => (
                    <SelectItem key={week.value} value={week.value}>
                      {week.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button variant={"secondary"} onClick={handleAttendenceFilter}>
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
                      <p className="text-sm text-muted-foreground">
                        Cause of concern
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Not marked
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                {isProgressEditingEnabled ? (
                  <div className="flex gap-2">
                    <Button
                      variant={"outline"}
                      className="flex items-center gap-2"
                      onClick={handleProgressSave}
                    >
                      {isProgressSaving || isPending ? (
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
                ) : isProgressSingleEditingEnabled ? null : (
                  <Button
                    variant={"outline"}
                    className="flex items-center gap-2"
                    onClick={enableEditing}
                  >
                    <ListTodo height={18} width={18} />
                    Mark Progress
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

export default ProgressTable;
