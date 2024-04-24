"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import { StudentProfile } from "@/components/student/data/schema";

import { getStudentBySection } from "@/serverTeacher/student_profile/actions";


import { postProgress } from "@/serverTeacher/progress/actions";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Check, ListTodo, Pencil, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DataTable } from "@/components/progress/data-table";
import { columns } from "@/components/progress/columns";
import { getAssignedLessons } from "@/serverTeacher/lessons/actions";
import { TAssignedLessonsSchema } from "@/schemas";
interface IFormSchema {
  studentId: number;
  progressType: string;
  points: number;
  startDate: string;
  endDate: string;
  studentName: string;
  branchName: string;
  campusName: string;
  deptName: string;
  gradeName: string;
  secName: string;
  lessonName: string;
  comments: string;
}

type Week = {
  label: string;
  value: string;
  start: Date;
  end: Date;
};

const generateWeeks = (startDate: string, endDate: string): Week[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const weeks = [];
  let current = new Date(start);

  // Handle the first week if it doesn't start on a Sunday
  if (current.getDay() !== 0) {
    // Find the next Thursday
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

    // Move to next Sunday
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
      label: `Week ${weekNumber} ${format(weekStart, "yyyy-MM-dd")} - ${format(
        weekEnd,
        "yyyy-MM-dd"
      )}`,
      value: `week_${weekNumber}`,
    });

    weekNumber++;
    current.setDate(current.getDate() + 3); // Next Sunday
    if (current > end) break;
  }

  return weeks;
};

const CreateProgress = () => {
  const weeks = generateWeeks("2024-01-22", "2024-04-22");
  const [selectedWeek, setSelectedWeek] = useState<Week | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const fetchedLessons = await getAssignedLessons();
        setLessons(fetchedLessons || []);
      } catch (error) {
        console.error("Error fetching lessons:", error);
        setLessons([]);
      } finally {
        setIsStudentLoading(false); // End loading state
      }

      setIsStudentConfirmed(true);
    };

    fetchLessons();
  }, []);

  const [showTable, setShowTable] = useState(false);

  const applyFilter = () => {
    fetchStudents();
    setShowTable(true);
  };
  const fetchStudents = async () => {
    setIsStudentLoading(true);

    try {
      const fetchedStudents = await getStudentBySection(
        selectedLesson?.section.id
      );
      if (fetchedStudents && fetchedStudents.results) {
        setStudent(fetchedStudents.results);
      } else {
        setStudent([]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudent([]);
    } finally {
      setIsStudentLoading(false);
    }
  };
  const [isStudentConfirmed, setIsStudentConfirmed] = useState(false);

  const [lessons, setLessons] = useState<TAssignedLessonsSchema[]>([]);
  const [selectedLesson, setSelectedLesson] =
    useState<TAssignedLessonsSchema | null>(null);

  const [student, setStudent] = useState<StudentProfile[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  const [isStudentLoading, setIsStudentLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLessonSelect = (lessonName: string) => {
    const selectedLesson = lessons.find(
      (lesson) => lesson.course.title === lessonName
    );
    setSelectedLesson(selectedLesson || null);
    console.log("selected lesson", selectedLesson);
  };
  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting, isLoading, errors },
  } = useForm<IFormSchema>({
    defaultValues: {
      studentId: 0,
      progressType: "",
      points: 0,
      startDate: "",
      endDate: "",
      studentName: "",
      branchName: "",
      campusName: "",
      deptName: "",
      gradeName: "",
      secName: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: IFormSchema) => {
    const startDate = selectedWeek
      ? format(selectedWeek.start, "yyyy-MM-dd")
      : "";

    console.log("start date looks like this ", startDate);

    const endDate = selectedWeek ? format(selectedWeek.end, "yyyy-MM-dd") : "";

    console.log("start date looks like this ", endDate);

    const refinedData = {
      course: selectedLesson ? selectedLesson.id : null,
      report_data: myStudentProgress,
      start_date: startDate,
      end_date: endDate,
    };
    console.log(refinedData);
    try {
      const res = await postProgress(refinedData);
      console.log(res);
      alert("Progress report created");
    } catch (error) {
      console.error("Error creating progress report:", error);
      alert("Error creating progress report");
    }
  };

  const categories = [
    { name: "Homework", values: [3, 2, 1] },
    { name: "Behavior", values: [3, 2, 1] },
    { name: "Punctuality", values: [3, 2, 1] },
    { name: "Attendance", values: [3, 2, 1] },
  ];

  interface progressArray {
    student: number;

    [key: string]: any;
  }

  const [myStudentProgress, setMyStudentProgress] = useState<progressArray[]>(
    []
  );

  useEffect(() => {
    console.log(myStudentProgress);
    // Any other logic you want to execute when myStudentProgress updates
  }, [myStudentProgress]);

  const [studentComments, setStudentComments] = useState("");

  const handleCheckboxChange = (
    points: number,
    studentId: number,
    category: string
  ) => {
    // Normalize the category name
    const normalizedCategory = category.toLowerCase();

    // Update myStudentProgress state
    setMyStudentProgress((prevProgress) => {
      // Find the index of the existing progress for the student
      const existingProgressIndex = prevProgress.findIndex(
        (progress) => progress.student === studentId
      );

      // If the student's progress already exists in the array
      if (existingProgressIndex !== -1) {
        // Clone the current state to avoid direct mutation
        const updatedProgress = [...prevProgress];
        // Update the points for the specific category
        updatedProgress[existingProgressIndex][normalizedCategory] = {
          points: points,
        };
        console.log(myStudentProgress);
        return updatedProgress;
      } else {
        // If the student's progress doesn't exist, add a new entry
        console.log(myStudentProgress);
        return [
          ...prevProgress,
          {
            student: studentId,

            [normalizedCategory]: { points: points },
          },
        ];
      }
    });
  };
  const handleCommentChange = (studentId: number, comment: string) => {
    setMyStudentProgress((prevProgress) => {
      let found = false;
      const updatedProgress = prevProgress.map((item) => {
        if (item.student === studentId) {
          found = true;
          return { ...item, comments: comment };
        }
        return item;
      });

      if (!found) {
        // If no progress was found for the student, create a new record.
        updatedProgress.push({ student: studentId, comments: comment });
      }

      return updatedProgress;
    });
  };

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8">
      <h2 className="text-2xl font-bold tracking-tight">Mark progress</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-8">
          <div className="flex w-full border border-dashed border-primary p-2 rounded-md gap-3">
            <div className="flex items-center gap-2">
              <Controller
                control={control}
                name="lessonName"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Select
                    value={value}
                    onValueChange={(val) => {
                      onChange(val);
                      handleLessonSelect(val);
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue
                        placeholder={
                          lessons.length > 0
                            ? "Select a lesson"
                            : "No lessons available"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                        <SelectLabel>Lessons</SelectLabel>
                        {lessons.map((lesson) => (
                          <SelectItem
                            key={lesson.course.id}
                            value={lesson.course.title}
                          >
                            {lesson.course.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-row gap-3">
              <div>
                <Button
                  type="button"
                  variant={"secondary"}
                  onClick={applyFilter}
                >
                  Apply Filter
                </Button>
              </div>
            </div>
          </div>
          {!selectedLesson && (
            <div className="w-full flex justify-center items-center mt-36 gap-3">
              <AlertTriangle />
              <p>Please confirm the lesson first</p>
            </div>
          )}
          {showTable && (
            <div className="">
              {isStudentLoading ? (
                <BranchTableSkeleton />
              ) : student.length === 0 ? (
                <div className="w-full flex justify-center items-center mt-36 gap-3">
                  <AlertTriangle />
                  <p>
                    Please select section and course to see the list of students
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between">
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
                    <div>
                      <Button type="submit" variant={"secondary"}>
                        Submit
                      </Button>
                    </div>
                  </div>
                  {/* <DataTable data={student} columns={columns} /> */}
                  <div className="flex flex-row gap-3 mt-3">
                    <div className="flex flex-row items-center mb-2">
                      <div className="w-4 h-4 bg-green-500 mr-2 rounded-full"></div>
                      <span>On track</span>
                    </div>
                    <div className="flex flex-row items-center mb-2 ">
                      <div className="w-4 h-4 bg-amber-300 mr-2 rounded-full"></div>
                      <span>Room for improvement</span>
                    </div>
                    <div className="flex flex-row items-center mb-2 ">
                      <div
                        className="w-4 h-4 bg-red-500 mr-2 rounded-full
"
                      ></div>
                      <span>Cause for Concern</span>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold text-black">
                          Student name
                        </TableHead>
                        <TableHead className="font-bold text-black">
                          Progress types
                        </TableHead>
                        <TableHead className="font-bold text-black">
                          Comments
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {student.map((stu) => (
                        <TableRow key={stu.id}>
                          <TableCell className="font-medium">
                            ID: {stu.id}{" "}
                            {stu.studentData.student_first_name_english}{" "}
                            {stu.studentData.student_last_name_english}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {categories.map((categoryData) => (
                                <div
                                  key={categoryData.name}
                                  className="flex flex-col"
                                >
                                  <p className="font-bold">
                                    {categoryData.name}
                                  </p>
                                  {categoryData.values.map((value) => (
                                    <div
                                      key={value}
                                      className={`flex flex-row items-center space-x-2 space-y-0 rounded-md border p-2 font-bold ${
                                        value === 3
                                          ? "bg-green-200"
                                          : value === 2
                                          ? "bg-amber-200"
                                          : "bg-red-200"
                                      }`}
                                    >
                                      <Checkbox
                                        id={`${categoryData.name}${value}`}
                                        value={value}
                                        checked={myStudentProgress.some(
                                          (progress) =>
                                            progress.student === stu.id &&
                                            progress[
                                              categoryData.name.toLowerCase()
                                            ]?.points === value
                                        )}
                                        onCheckedChange={() =>
                                          handleCheckboxChange(
                                            value,
                                            stu.id,

                                            categoryData.name.toLowerCase()
                                          )
                                        }
                                        className={`text-${
                                          value === 3
                                            ? "green"
                                            : value === 2
                                            ? "amber"
                                            : "red"
                                        }-500`}
                                      />
                                      <p
                                        className={`text-${
                                          value === 3
                                            ? "green"
                                            : value === 2
                                            ? "amber"
                                            : "red"
                                        }-500`}
                                      >
                                        {value === 3
                                          ? "On track"
                                          : value === 1
                                          ? "Cause for concern"
                                          : "Room for improvement"}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <MessageCircle className="cursor-pointer" />
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[525px]">
                                <DialogHeader>
                                  <DialogTitle>Add comments</DialogTitle>

                                  <div>
                                    <Textarea
                                      value={studentComments}
                                      onChange={(e) =>
                                        setStudentComments(e.target.value)
                                      }
                                      placeholder="Type your comment here."
                                      className="resize-none"
                                    />
                                  </div>
                                </DialogHeader>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button
                                      type="button"
                                      onClick={() =>
                                        handleCommentChange(
                                          stu.id,
                                          studentComments
                                        )
                                      }
                                    >
                                      Save changes
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateProgress;
