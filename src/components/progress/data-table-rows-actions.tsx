"use client";

import { Row } from "@tanstack/react-table";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useProgressStore } from "@/GlobalStore/progressStore";
import { Checkbox } from "@/components/ui/checkbox";
import { AlignRight, Check, Pencil, X } from "lucide-react";
import { Icons } from "@/components/ui/icons";
import {
  ProgressArraySchema,
  TPostReportDataSchema,
  TUpdateProgressSchema,
} from "@/schemas";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { updateMarkedProgress } from "@/server/progress/actions";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
interface ProgressTypeFields {
  attendance: { id: number; points: number };
  homework: { id: number; points: number };
  punctuality: { id: number; points: number };
  behavior: { id: number; points: number };
}
// type ReportType = "attendance" | "homework" | "punctuality" | "behavior";

// const reportType: ReportType = type.toLowerCase() as ReportType;

// interface ProgressUpdate {
//   student: number;
//   attendance: { points: number; id: number };
//   homework: { points: number; id: number };
//   punctuality: { points: number; id: number };
//   behavior: { points: number; id: number };
//   course: number;
//   start_date: string;
//   end_date: string;
//   comments?: string;
// }

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const progressRow = row.original as ProgressArraySchema;
  const [attendancePoints, setAttendancePoints] = useState<number>(0);
  const [homeworkPoints, setHomeworkPoints] = useState<number>(0);
  const [behaviorPoints, setBehaviorPoints] = useState<number>(0);
  const [punctualityPoints, setPunctualityPoints] = useState<number>(0);
  const [isPending, startTransition] = useTransition();
  const [updatedSingleProgress, setUpdatedSingleProgress] =
    useState<TUpdateProgressSchema>();

  const {
    course,
    preProgressEditRowId,
    isProgressEditingEnabled,
    setProgressEditingEnabled,
    setProgressIsSaving,
    isProgressSingleEditingEnabled,
    setProgressSingleEditingEnabled,
    isProgressSaving,
    myprogressStatus,
    updateProgress,
    addProgress,
    isProgressRefectched,
    setPreProgressEditRowId,
    setIsProgressRefetched,
  } = useProgressStore();

  useEffect(() => {
    const transformedData: TUpdateProgressSchema = {
      course: progressRow.course,
      student: progressRow.id,
      start_date: progressRow?.progress_report?.start_date ?? "",
      end_date: progressRow?.progress_report?.end_date ?? "",
      comments: progressRow?.progress_report?.comments ?? "",
      attendance: progressRow?.progress_report?.report_data.find(
        (p) => p.progress_type === "Attendance"
      ) ?? { id: 0, points: 0 }, // Provide a default object if not found
      homework: progressRow?.progress_report?.report_data.find(
        (p) => p.progress_type === "Homework"
      ) ?? { id: 0, points: 0 }, // Provide a default object if not found
      punctuality: progressRow?.progress_report?.report_data.find(
        (p) => p.progress_type === "Punctuality"
      ) ?? { id: 0, points: 0 }, // Provide a default object if not found
      behavior: progressRow?.progress_report?.report_data.find(
        (p) => p.progress_type === "Behavior"
      ) ?? { id: 0, points: 0 }, // Provide a default object if not found
    };

    setUpdatedSingleProgress(transformedData);
  }, []);

  // //after duplicate check
  // const handleCheckboxChange = (
  //   type: string,
  //   student: number,
  //   points: number
  // ) => {
  //   if (course) {
  //     const existingIndex = myprogressStatus?.findIndex(
  //       (item) => item.student === student
  //     );

  //     let progressData: TUpdateProgressSchema;

  //     // Create a copy of the existing progress or an empty object if it doesn't exist
  //     if (existingIndex !== undefined && existingIndex !== -1) {
  //       progressData= { ...(myprogressStatus?.[existingIndex] || {}) };
  //     } else {
  //       progressData = {
  //         course: 0, // Default value or use actual course ID
  //         start_date: "2024-01-01", // Default value or use actual start date
  //         end_date: "2024-12-31", // Default value or use actual end date
  //         student: student,
  //         attendance: { id: 0, points: attendancePoints },
  //         homework: { id: 0, points: homeworkPoints },
  //         punctuality: { id: 0, points: punctualityPoints },
  //         behavior: { id: 0, points: behaviorPoints },
  //         comments: "", // Default value or use actual comment
  //       };
  //     }

  //     // Update the category points based on the type of checkbox clicked
  //     switch (type.toLowerCase()) {
  //       case "attendance":
  //         setAttendancePoints(points);
  //         if (progressData.attendance) {
  //           progressData.attendance.points = points;
  //         }
  //         break;
  //       case "homework":
  //         setHomeworkPoints(points);
  //         if (progressData.homework) {
  //           progressData.homework.points = points;
  //         }
  //         break;
  //       case "punctuality":
  //         setPunctualityPoints(points);
  //         if (progressData.punctuality) {
  //           progressData.punctuality.points = points;
  //         }
  //         break;
  //       case "behavior":
  //         setBehaviorPoints(points);
  //         if (progressData.behavior) {
  //           progressData.behavior.points = points;
  //         }
  //         break;
  //       default:
  //         break;
  //     }

  //     // Update the myprogressStatus state based on whether the record exists or not
  //     if (existingIndex !== undefined && existingIndex !== -1) {
  //       updateProgress(existingIndex, progressData);
  //     } else {
  //       addProgress(progressData);
  //     }
  //   }
  // };
  const handleCheckboxChange = (
    type: "attendance" | "homework" | "punctuality" | "behavior",
    student: number,
    points: number
  ) => {
    if (!course) {
      console.error("Course ID is missing");
      return;
    }

    const existingIndex: any = myprogressStatus?.findIndex(
      (item) => item.student === student
    );

    let progressData: TPostReportDataSchema;

    if (existingIndex !== undefined && existingIndex > -1) {
      progressData = { ...myprogressStatus![existingIndex] };
    } else {
      progressData = {
        student: student,
        attendance: { points: 0 },
        homework: { points: 0 },
        punctuality: { points: 0 },
        behavior: { points: 0 },
        comments: "",
      };
    }

    // Updating the points for the specific category
    if (progressData[type]) {
      progressData[type].points = points;
    } else {
      console.error(`Invalid progress type: ${type}`);
    }

    // Now, you would update the myprogressStatus state with this new progressData object
    if (existingIndex !== undefined && existingIndex > -1) {
      updateProgress(existingIndex, progressData);
    } else {
      addProgress(progressData);
    }
  };

  // const handleSingleCheckboxChange = async (
  //   type: keyof ProgressTypeFields,
  //   points: number,
  //   student: number
  // ) => {
  //   setUpdatedSingleProgress((currentProgress) => {
  //     if (!currentProgress) {
  //       // Handle the case where currentProgress might be undefined
  //       console.error(
  //         "Current progress is undefined. Ensure state is initialized properly."
  //       );
  //       return currentProgress;
  //     }

  //     const progressUpdate = { ...currentProgress };

  //     // Find the report data for the specific type and update points
  //     const reportType = type.toLowerCase();
  //     if (progressUpdate[reportType]) {
  //       progressUpdate[reportType].points = points;
  //       // if (progressUpdate[reportType]) {
  //       //   progressUpdate[reportType] = {
  //       //     id: progressUpdate[reportType]?.id ?? 0, // Fallback to 0 or some other default
  //       //     points,
  //       //   };
  //     } else {
  //       console.error(`Invalid progress type: ${type}`);
  //     }

  //     return progressUpdate;
  //   });
  //   setUpdatedSingleProgress((currentProgress) => {
  //     if (!currentProgress) {
  //       console.error(
  //         "Current progress is undefined. Ensure state is initialized properly."
  //       );
  //       return currentProgress;
  //     }

  //     const progressUpdate = { ...currentProgress };

  //     console.log("progress update:", progressUpdate);

  //     // Assuming `type` is directly the key (e.g., 'attendance')
  //     const categoryKey = type.toLowerCase();

  //     // Ensure we always set an object with `id` and `points`, never undefined
  //     progressUpdate[categoryKey] = {
  //       id: currentProgress[categoryKey]?.id,
  //       points: points,
  //     };

  //     return progressUpdate;
  //   });
  //   alert("Edit functionality is under development");
  // };
  const handleSingleCheckboxChange = async (
    type: "attendance" | "homework" | "punctuality" | "behavior",
    points: number,
    student: number
  ) => {
    setUpdatedSingleProgress((currentProgress) => {
      if (!currentProgress) {
        console.error(
          "Current progress is undefined. Ensure state is initialized properly."
        );
        return currentProgress;
      }

      const progressUpdate: TUpdateProgressSchema = { ...currentProgress };

      // Assuming `type` directly corresponds to the property keys in TUpdateProgressSchema
      if (type in progressUpdate) {
        const category = progressUpdate[type];
        if (category) {
          category.points = points;
        } else {
          // If the category doesn't exist in the currentProgress, add it with the given points and a default id
          progressUpdate[type] = { id: 0, points }; // You might need to adjust this logic based on how you generate IDs
        }
      } else {
        console.error(`Invalid progress type: ${type}`);
      }
      console.log("updated single progress:", updatedSingleProgress);
      console.log("after check single progress:", progressUpdate);

      return progressUpdate;
    });
  };

  const handleUpdateProgress = async () => {
    console.log("Updated Progress:", updatedSingleProgress);
    startTransition(() => {
      updateMarkedProgress(updatedSingleProgress, progressRow.id).then(
        (data) => {
          setProgressIsSaving(true);
          if (data !== undefined) {
            setProgressIsSaving(false);
            setProgressSingleEditingEnabled(false);
            toast.success("successfully updated the progress");
            setIsProgressRefetched(true);
          } else {
            toast.error("successfully updated the progress");
            setProgressIsSaving(false);
            setProgressSingleEditingEnabled(false);
          }
        }
      );
    });
  };

  const handleSingleRowEdit = (row: ProgressArraySchema) => {
    setPreProgressEditRowId(row.id);
    setProgressSingleEditingEnabled(true);
  };

  if (isProgressEditingEnabled && progressRow.progress_report === null) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-muted-foreground font-semibold">Attendance</p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              {" "}
              <Checkbox
                id="excelentA"
                checked={myprogressStatus?.some(
                  (item) =>
                    item.student === progressRow.id &&
                    item?.attendance?.points === 1
                )}
                onCheckedChange={() =>
                  handleCheckboxChange("attendance", progressRow.id, 1)
                }
              />
              <p>Excelent</p>
            </div>
            <div className="flex items-center gap-2">
              {" "}
              <Checkbox
                id="roomA"
                checked={myprogressStatus?.some(
                  (item) =>
                    item.student === progressRow.id &&
                    item?.attendance?.points === 2
                )}
                onCheckedChange={() =>
                  handleCheckboxChange("attendance", progressRow.id, 2)
                }
              />
              <p>Room for improvement</p>
            </div>
            <div className="flex items-center gap-2">
              {" "}
              <Checkbox
                id="causeA"
                checked={myprogressStatus?.some(
                  (item) =>
                    item.student === progressRow.id &&
                    item?.attendance?.points === 3
                )}
                onCheckedChange={() =>
                  handleCheckboxChange("attendance", progressRow.id, 3)
                }
              />
              <p>Cause for concern</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-muted-foreground font-semibold">Homework</p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              {" "}
              <Checkbox
                id="excelentH"
                checked={myprogressStatus?.some(
                  (item) =>
                    item.student === progressRow.id &&
                    item.homework?.points === 1
                )}
                onCheckedChange={() =>
                  handleCheckboxChange("homework", progressRow.id, 1)
                }
              />
              <p>Excelent</p>
            </div>
            <div className="flex items-center gap-2">
              {" "}
              <Checkbox
                id="roomH"
                checked={myprogressStatus?.some(
                  (item) =>
                    item.student === progressRow.id &&
                    item.homework?.points === 2
                )}
                onCheckedChange={() =>
                  handleCheckboxChange("homework", progressRow.id, 2)
                }
              />
              <p>Room for improvement</p>
            </div>
            <div className="flex items-center gap-2">
              {" "}
              <Checkbox
                id="causeH"
                checked={myprogressStatus?.some(
                  (item) =>
                    item.student === progressRow.id &&
                    item.homework?.points === 3
                )}
                onCheckedChange={() =>
                  handleCheckboxChange("homework", progressRow.id, 3)
                }
              />
              <p>Cause for concern</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-muted-foreground font-semibold">Punctuality</p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              {" "}
              <Checkbox
                id="excelentP"
                checked={myprogressStatus?.some(
                  (item) =>
                    item.student === progressRow.id &&
                    item.punctuality?.points === 1
                )}
                onCheckedChange={() =>
                  handleCheckboxChange("punctuality", progressRow.id, 1)
                }
              />
              <p>Excelent</p>
            </div>
            <div className="flex items-center gap-2">
              {" "}
              <Checkbox
                id="roomP"
                checked={myprogressStatus?.some(
                  (item) =>
                    item.student === progressRow.id &&
                    item.punctuality?.points === 2
                )}
                onCheckedChange={() =>
                  handleCheckboxChange("punctuality", progressRow.id, 2)
                }
              />
              <p>Room for improvement</p>
            </div>
            <div className="flex items-center gap-2">
              {" "}
              <Checkbox
                id="causeP"
                checked={myprogressStatus?.some(
                  (item) =>
                    item.student === progressRow.id &&
                    item.punctuality?.points === 3
                )}
                onCheckedChange={() =>
                  handleCheckboxChange("punctuality", progressRow.id, 3)
                }
              />
              <p>Cause for concern</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-muted-foreground font-semibold">Behavior</p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              {" "}
              <Checkbox
                id="excelentB"
                checked={myprogressStatus?.some(
                  (item) =>
                    item.student === progressRow.id &&
                    item.behavior?.points === 1
                )}
                onCheckedChange={() =>
                  handleCheckboxChange("behavior", progressRow.id, 1)
                }
              />
              <p>Excelent</p>
            </div>
            <div className="flex items-center gap-2">
              {" "}
              <Checkbox
                id="roomB"
                checked={myprogressStatus?.some(
                  (item) =>
                    item.student === progressRow.id &&
                    item.behavior?.points === 2
                )}
                onCheckedChange={() =>
                  handleCheckboxChange("behavior", progressRow.id, 2)
                }
              />
              <p>Room for improvement</p>
            </div>
            <div className="flex items-center gap-2">
              {" "}
              <Checkbox
                id="causeB"
                checked={myprogressStatus?.some(
                  (item) =>
                    item.student === progressRow.id &&
                    item.behavior?.points === 3
                )}
                onCheckedChange={() =>
                  handleCheckboxChange("behavior", progressRow.id, 3)
                }
              />
              <p>Cause for concern</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (
    isProgressSingleEditingEnabled &&
    progressRow.progress_report !== null &&
    !isProgressEditingEnabled &&
    preProgressEditRowId === progressRow.id
  ) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col gap-2">
            <div>
              <p className="text-muted-foreground font-semibold">Attendance</p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                {" "}
                <Checkbox
                  id="excelentA"
                  disabled={progressRow.progress_report.report_data.some(
                    (item) =>
                      item.progress_type === "Attendance" && item.points === 1
                  )}
                  checked={
                    progressRow.progress_report.report_data.some(
                      (item) =>
                        item.progress_type === "Attendance" && item.points === 1
                    ) || updatedSingleProgress?.attendance?.points === 1
                  }
                  onCheckedChange={() =>
                    handleSingleCheckboxChange("attendance", 1, progressRow.id)
                  }
                />
                <p>Excelent</p>
              </div>
              <div className="flex items-center gap-2">
                {" "}
                <Checkbox
                  id="roomA"
                  disabled={progressRow.progress_report.report_data.some(
                    (item) =>
                      item.progress_type === "Attendance" && item.points === 2
                  )}
                  checked={
                    progressRow.progress_report.report_data.some(
                      (item) =>
                        item.progress_type === "Attendance" && item.points === 2
                    ) || updatedSingleProgress?.attendance?.points === 2
                  }
                  onCheckedChange={() =>
                    handleSingleCheckboxChange("attendance", 2, progressRow.id)
                  }
                />
                <p>Room for improvement</p>
              </div>
              <div className="flex items-center gap-2">
                {" "}
                <Checkbox
                  id="causeA"
                  disabled={progressRow.progress_report.report_data.some(
                    (item) =>
                      item.progress_type === "Attendance" && item.points === 3
                  )}
                  checked={
                    progressRow.progress_report.report_data.some(
                      (item) =>
                        item.progress_type === "Attendance" && item.points === 3
                    ) || updatedSingleProgress?.attendance?.points === 3
                  }
                  onCheckedChange={() =>
                    handleSingleCheckboxChange("attendance", 3, progressRow.id)
                  }
                />
                <p>Cause for concern</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <p className="text-muted-foreground font-semibold">Homework</p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                {" "}
                <Checkbox
                  id="excelentH"
                  disabled={progressRow.progress_report.report_data.some(
                    (item) =>
                      item.progress_type === "Homework" && item.points === 1
                  )}
                  checked={
                    progressRow.progress_report.report_data.some(
                      (item) =>
                        item.progress_type === "Homework" && item.points === 1
                    ) || updatedSingleProgress?.homework?.points === 1
                  }
                  onCheckedChange={() =>
                    handleSingleCheckboxChange("homework", 1, progressRow.id)
                  }
                />
                <p>Excelent</p>
              </div>
              <div className="flex items-center gap-2">
                {" "}
                <Checkbox
                  id="roomH"
                  disabled={progressRow.progress_report.report_data.some(
                    (item) =>
                      item.progress_type === "Homework" && item.points === 2
                  )}
                  checked={
                    progressRow.progress_report.report_data.some(
                      (item) =>
                        item.progress_type === "Homework" && item.points === 2
                    ) || updatedSingleProgress?.homework?.points === 2
                  }
                  onCheckedChange={() =>
                    handleSingleCheckboxChange("homework", 2, progressRow.id)
                  }
                />
                <p>Room for improvement</p>
              </div>
              <div className="flex items-center gap-2">
                {" "}
                <Checkbox
                  id="causeH"
                  disabled={progressRow.progress_report.report_data.some(
                    (item) =>
                      item.progress_type === "Homework" && item.points === 3
                  )}
                  checked={
                    progressRow.progress_report.report_data.some(
                      (item) =>
                        item.progress_type === "Homework" && item.points === 3
                    ) || updatedSingleProgress?.homework?.points === 3
                  }
                  onCheckedChange={() =>
                    handleSingleCheckboxChange("homework", 3, progressRow.id)
                  }
                />
                <p>Cause for concern</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <p className="text-muted-foreground font-semibold">Punctuality</p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                {" "}
                <Checkbox
                  id="excelentP"
                  disabled={progressRow.progress_report.report_data.some(
                    (item) =>
                      item.progress_type === "Punctuality" && item.points === 1
                  )}
                  checked={
                    progressRow.progress_report.report_data.some(
                      (item) =>
                        item.progress_type === "Punctuality" &&
                        item.points === 1
                    ) || updatedSingleProgress?.punctuality?.points === 1
                  }
                  onCheckedChange={() =>
                    handleSingleCheckboxChange("punctuality", 1, progressRow.id)
                  }
                />
                <p>Excelent</p>
              </div>
              <div className="flex items-center gap-2">
                {" "}
                <Checkbox
                  id="roomP"
                  disabled={progressRow.progress_report.report_data.some(
                    (item) =>
                      item.progress_type === "Punctuality" && item.points === 2
                  )}
                  checked={
                    progressRow.progress_report.report_data.some(
                      (item) =>
                        item.progress_type === "Punctuality" &&
                        item.points === 2
                    ) || updatedSingleProgress?.punctuality?.points === 2
                  }
                  onCheckedChange={() =>
                    handleSingleCheckboxChange("punctuality", 2, progressRow.id)
                  }
                />
                <p>Room for improvement</p>
              </div>
              <div className="flex items-center gap-2">
                {" "}
                <Checkbox
                  id="causeP"
                  disabled={progressRow.progress_report.report_data.some(
                    (item) =>
                      item.progress_type === "Punctuality" && item.points === 3
                  )}
                  checked={
                    progressRow.progress_report.report_data.some(
                      (item) =>
                        item.progress_type === "Punctuality" &&
                        item.points === 3
                    ) || updatedSingleProgress?.punctuality?.points === 3
                  }
                  onCheckedChange={() =>
                    handleSingleCheckboxChange("punctuality", 3, progressRow.id)
                  }
                />
                <p>Cause for concern</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <p className="text-muted-foreground font-semibold">Behavior</p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                {" "}
                <Checkbox
                  id="excelentB"
                  disabled={progressRow.progress_report.report_data.some(
                    (item) =>
                      item.progress_type === "Behavior" && item.points === 1
                  )}
                  checked={
                    progressRow.progress_report.report_data.some(
                      (item) =>
                        item.progress_type === "Behavior" && item.points === 1
                    ) || updatedSingleProgress?.behavior?.points === 1
                  }
                  onCheckedChange={() =>
                    handleSingleCheckboxChange("behavior", 1, progressRow.id)
                  }
                />
                <p>Excelent</p>
              </div>
              <div className="flex items-center gap-2">
                {" "}
                <Checkbox
                  id="roomB"
                  disabled={progressRow.progress_report.report_data.some(
                    (item) =>
                      item.progress_type === "Behavior" && item.points === 2
                  )}
                  checked={
                    progressRow.progress_report.report_data.some(
                      (item) =>
                        item.progress_type === "Behavior" && item.points === 2
                    ) || updatedSingleProgress?.behavior?.points === 2
                  }
                  onCheckedChange={() =>
                    handleSingleCheckboxChange("behavior", 2, progressRow.id)
                  }
                />
                <p>Room for improvement</p>
              </div>
              <div className="flex items-center gap-2">
                {" "}
                <Checkbox
                  id="causeB"
                  disabled={progressRow.progress_report.report_data.some(
                    (item) =>
                      item.progress_type === "Behavior" && item.points === 3
                  )}
                  checked={
                    progressRow.progress_report.report_data.some(
                      (item) =>
                        item.progress_type === "Behavior" && item.points === 3
                    ) || updatedSingleProgress?.behavior?.points === 3
                  }
                  onCheckedChange={() =>
                    handleSingleCheckboxChange("behavior", 3, progressRow.id)
                  }
                />
                <p>Cause for concern</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            className="flex items-center gap-2"
            size={"sm"}
            onClick={handleUpdateProgress}
          >
            {isProgressSaving || isPending ? (
              <Icons.spinner className="h-4 w-4 animate-spin" />
            ) : (
              <Check height={15} width={15} />
            )}
          </Button>
          <Button
            variant={"destructive"}
            size={"sm"}
            className="flex items-center gap-2"
            onClick={() => setProgressSingleEditingEnabled(false)}
          >
            <X height={15} width={15} />
          </Button>
        </div>
      </div>
    );
  }

  if (progressRow.progress_report) {
    return (
      <div className="flex gap-2">
        {progressRow.progress_report?.report_data.map((report) => (
          <div className="flex flex-col gap-2 items-center" key={report.id}>
            <div>
              <p className="text-muted-foreground font-semibold">
                {report.progress_type}
              </p>
            </div>
            <div
              className={cn(
                "p-4 w-32 boder rounded-sm",
                report.points === 2
                  ? "bg-yellow-500"
                  : report.points === 3
                  ? "bg-red-500"
                  : "bg-primary"
              )}
            ></div>
          </div>
        ))}
        {isProgressEditingEnabled ? null : (
          <div className="flex items-end justify-end gap-3 mr-8">
            <Button variant={"outline"} size={"sm"}>
              <Pencil
                height={18}
                width={18}
                className="text-primary cursor-pointer "
                onClick={() => handleSingleRowEdit(progressRow)}
              />
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-2 items-center">
        <div>
          <p className="text-muted-foreground font-semibold">Attendance</p>
        </div>
        <div className="p-4 w-32 boder rounded-sm bg-slate-200"></div>
      </div>
      <div className="flex flex-col gap-2 items-center">
        <div>
          <p className="text-muted-foreground font-semibold">Homework</p>
        </div>
        <div className="p-4 w-32 boder rounded-sm bg-slate-200"></div>
      </div>
      <div className="flex flex-col gap-2 items-center">
        <div>
          <p className="text-muted-foreground font-semibold">Punctuality</p>
        </div>
        <div className="p-4 w-32 boder rounded-sm bg-slate-200"></div>
      </div>
      <div className="flex flex-col gap-2 items-center">
        <div>
          <p className="text-muted-foreground font-semibold">Behaviour</p>
        </div>
        <div className="p-4 w-32 boder rounded-sm bg-slate-200"></div>
      </div>
    </div>
  );
}
