"use client";
import React, { useState, useEffect } from "react";
import { ProgressArraySchema } from "./data/schema";
import { getProgressByStudent } from "@/serverTeacher/progress/actions";

import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import { AlertTriangle } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// import { updateProgress } from "@/server/progress/actions";
import { Icons } from "@/components/ui/icons";
// import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { StudentProfile } from "@/components/student/data/schema";

import { getAssignedLessons } from "@/serverTeacher/lessons/actions";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
const colorClasses: Record<number, string> = {
  3: "bg-green-500",
  2: "bg-amber-300",
  1: "bg-red-500",
};
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { getStudentBySection } from "@/serverTeacher/student_profile/actions";
import { LessonStudentSelector } from "./LessonStudentSelector";
function getColorClass(points: number) {
  switch (points) {
    case 3:
      return "text-green-500";
    case 2:
      return "text-amber-300";
    case 1:
      return "text-red-500";
    default:
      return "";
  }
}
export type ProgressState = {
  Homework: { id: number | null; points: number };
  Punctuality: { id: number | null; points: number };
  Behavior: { id: number | null; points: number };
  Attendance: { id: number | null; points: number };
};
type ProgressCategory = "Homework" | "Punctuality" | "Behavior" | "Attendance";
interface ISelectLessonSchema {
  lesson: string;
}
const StudentProgress = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );

  const [progress, setProgress] = useState<ProgressState>({
    Homework: { id: null, points: 0 },
    Punctuality: { id: null, points: 0 },
    Behavior: { id: null, points: 0 },
    Attendance: { id: null, points: 0 },
  });
  const [selectedReport, setSelectedReport] =
    useState<ProgressArraySchema | null>(null);
  console.log(selectedReport);
  const handleDivClick = (report: ProgressArraySchema) => {
    setSelectedReport(report);
    const newProgress = { ...progress };

    report.report_data.forEach((item) => {
      newProgress[item.progress_type as keyof ProgressState] = {
        id: item.id,
        points: item.points,
      };
    });

    setProgress(newProgress);
  };

  const [groupedProgressData, setGroupedProgressData] = useState<
    ProgressArraySchema[]
  >([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (selectedStudentId !== null) {
      setLoading(true);
      try {
        const data = await getProgressByStudent(selectedStudentId);
        setGroupedProgressData(data || []);
        console.log("Progress against student id is", groupedProgressData);
      } catch (error) {
        console.error("Error fetching progress data:", error);
        setGroupedProgressData([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting, isLoading, errors },
  } = useForm({
    defaultValues: {
      Homework: { points: 0 },
      Punctuality: { points: 0 },
      Behavior: { points: 0 },
      Attendance: { points: 0 },
    },
  });

  const onSubmit = async () => {
    console.log("Progress Data:", progress);

    // Extract progressId from the selected report
    const progressId = selectedReport?.id;

    // Check if progressId is available
    if (!progressId) {
      console.error("No progressId found for the selected report.");
      return;
    }
    const getProgressDataId = (type: any) => {
      const item = selectedReport.report_data.find(
        (item) => item.progress_type === type
      );
      return item ? item.id : null; // Return the id if found, otherwise null
    };
    const payload = {
      id: progressId,
      student: Number(selectedStudentId) ? Number(selectedStudentId) : null,
      attendance: {
        id: getProgressDataId("Attendance"),
        points: progress.Attendance.points,
      },
      homework: {
        id: getProgressDataId("Homework"),
        points: progress.Homework.points,
      },
      punctuality: {
        id: getProgressDataId("Punctuality"),
        points: progress.Punctuality.points,
      },
      behavior: {
        id: getProgressDataId("Behavior"),
        points: progress.Behavior.points,
      },
    };

    console.log("Sending Payload:", payload);

    try {
      // const response = await updateProgress(progressId, payload);
      // console.log("Progress update response:", response);
      alert("Progress has been updated");
    } catch (error) {
      console.error("Error updating progress:", error);
    }

    // Function to map a progress type to the required format
    function mapProgressType(progressType: string) {
      const reportDataItem = selectedReport?.report_data.find(
        (item) => item.progress_type === progressType
      );

      return reportDataItem
        ? { id: reportDataItem.id, points: reportDataItem.points }
        : { id: null, points: 0 }; // Handle case when progress type is not found
    }
  };

  const handleRadioChange = (category: ProgressCategory, value: number) => {
    setProgress((prevProgress) => ({
      ...prevProgress,
      [category]: { points: value },
    }));
  };

  const renderRadioGroup = (category: ProgressCategory) => {
    const currentValue = progress[category].points.toString();
    return (
      <RadioGroup
        value={currentValue}
        onValueChange={(value) => handleRadioChange(category, parseInt(value))}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="3" className="text-green-500" />
          <Label className="text-green-500">On track</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="2" className="text-amber-300" />
          <Label className="text-amber-300">Room for improvement</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1" className="text-red-500" />
          <Label className="text-red-500">Cause for Concern</Label>
        </div>
      </RadioGroup>
    );
  };
  type ProgressPoints = {
    Attendance: string;
    Punctuality: string;
    Homework: string;
    Behavior: string;
  };

  type WeekData = {
    [weekLabel: string]: ProgressPoints;
  };

  type CourseDataMap = {
    [courseTitle: string]: WeekData;
  };

  const courseDataMap: CourseDataMap = {};
  // function getColorForPoints(points: number) {
  //   switch (points) {
  //     case 3:
  //       return rgb(0, 1, 0); // Green for "On track"
  //     case 2:
  //       return rgb(1, 1, 0); // Yellow for "Room for improvement"
  //     case 1:
  //       return rgb(1, 0, 0); // Red for "Cause for Concern"
  //     default:
  //       return rgb(1, 1, 1); // White for no points or undefined
  //   }
  // }
  const handleSelectionChange = ({ studentId }: any) => {
    setSelectedStudentId(studentId);
    console.log("selected student id ", studentId);
  };
  return (
    <div>
      <div id="report"></div>
      <div>
        <div className="flex w-full border border-dashed border-primary p-2 rounded-md gap-3">
          <div className="hidden space-x-3 lg:flex">
            <LessonStudentSelector onSelectionChange={handleSelectionChange} />
            <Button variant={"secondary"} type="button" onClick={fetchData}>
              Apply filters
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-3 mt-3">
        <div className="flex flex-row items-center mb-2">
          <div className="w-4 h-4 bg-green-500 mr-2 rounded-full"></div>
          <span>On track</span>
        </div>
        <div className="flex flex-row items-center mb-2 ">
          <div
            className="w-4 h-4 bg-amber-300 mr-2 rounded-full
l"
          ></div>
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
      <div className="mt-4">
        {selectedStudentId === null ? (
          <div className="w-full flex justify-center items-center mt-36 gap-3">
            <AlertTriangle />
            <p>Please select a student to see progress</p>
          </div>
        ) : loading ? (
          <BranchTableSkeleton />
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {groupedProgressData.map((progress, index) => {
              const { course_detail, start_date, end_date, report_data } =
                progress;

              return (
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <div
                        key={index}
                        className="bg-white border border-black shadow rounded-lg p-6 mb-4 w-[330px] cursor-pointer"
                        onClick={() => handleDivClick(progress)}
                      >
                        <div className="pb-4 border-b">
                          <h1 className="text-lg font-semibold text-gray-900">
                            Lesson: {course_detail.title}
                          </h1>
                          <h1 className="text-lg font-semibold text-gray-900">
                            Week: {start_date} to {end_date}
                          </h1>
                        </div>
                        <div className="grid grid-cols-4 gap-4 pt-4">
                          {report_data.map((item, itemIndex) => (
                            <div key={itemIndex} className="text-center">
                              <div
                                className={`text-[10px] font-medium ${getColorClass(
                                  item.points
                                )}`}
                              >
                                {item.progress_type}
                              </div>
                              <div
                                className={`mt-1 text-3xl font-semibold text-gray-900 h-12 ${
                                  colorClasses[item.points]
                                }`}
                              ></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[725px] overflow-scroll no-scrollbar">
                      {selectedReport && (
                        <>
                          <h1 className="text-lg font-semibold">
                            Lesson: {selectedReport.course_detail.title}
                          </h1>
                          <p>
                            Week: {selectedReport.start_date} to{" "}
                            {selectedReport.end_date}
                          </p>
                        </>
                      )}
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <Table>
                          <TableBody>
                            {[
                              "Homework",
                              "Punctuality",
                              "Behavior",
                              "Attendance",
                            ].map((category) => (
                              <TableRow key={category}>
                                <TableCell className="font-bold">
                                  {category}
                                </TableCell>
                                <TableCell className="font-bold">
                                  {renderRadioGroup(
                                    category as ProgressCategory
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        <DialogFooter>
                          <Button
                            disabled={isLoading || isSubmitting}
                            type="submit"
                          >
                            {isLoading || isSubmitting ? (
                              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              "Submit"
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                      <div className="flex flex-row gap-5">
                        <Label>Comments</Label>
                        {selectedReport?.comments}
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProgress;
