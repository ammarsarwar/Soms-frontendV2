"use client";

import { Row } from "@tanstack/react-table";
import {
  TOptimizedStudentAttendenceSchema,
  TPostAttendenceSchema,
} from "./attendence.types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAttendenceStore } from "@/GlobalStore/attendenceStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Pencil, X } from "lucide-react";
import { Icons } from "@/components/ui/icons";
import { toast } from "sonner";
import { updateStudentAttendence } from "@/server/attendence/actions";
import { cn } from "@/lib/utils";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const attendanceRow = row.original as TOptimizedStudentAttendenceSchema;

  const [isSingleEditLoading, setIsSingleEditLoading] = useState(false);
  const [updatedSingleEditStatus, setUpdatedSingleEditStatus] = useState("");

  const {
    addAttendance,
    course,
    myattendanceStatus,
    isEditingEnabled,
    myDate,
    isSaving,
    updateAttendance,
    isSingleEditingEnabled,
    preEditRowId,
    setIsSaving,
    setPreEditRowId,
    setSingleEditingEnabled,
  } = useAttendenceStore();

  // before duplicate check
  // const handleCheckboxChange = (type: string) => {
  //   if (course) {
  //     addAttendance({
  //       student: attendanceRow.id,
  //       course,
  //       status: type,
  //       date: myDate,
  //     });
  //   }
  // };

  //after duplicate check
  const handleCheckboxChange = (type: string) => {
    if (course) {
      const existingIndex = myattendanceStatus.findIndex(
        (item) => item.student === attendanceRow.id
      );

      const attendanceData = {
        student: attendanceRow.id,
        course,
        status: type,
        date: myDate,
      };

      if (existingIndex !== -1) {
        updateAttendance(existingIndex, attendanceData);
      } else {
        addAttendance(attendanceData);
      }
    }
  };

  const handleSingleCheckboxChange = async () => {
    if (course) {
      const singleAttendanceData = {
        attendence_id: attendanceRow.attendance_id,
        course,
        status: updatedSingleEditStatus,
        date: myDate,
      };
      setIsSingleEditLoading(true);
      setIsSaving(true);
      const res = await updateStudentAttendence(singleAttendanceData);
      if (res !== undefined) {
        toast.success("Successfully updated attendance status");
        setIsSingleEditLoading(false);
        setIsSaving(false);
      } else {
        toast.error("Error updating attendance status");
        setIsSingleEditLoading(false);
        setIsSaving(false);
      }
      setSingleEditingEnabled(false);
    }
  };

  const handleSingleRowEdit = (row: TOptimizedStudentAttendenceSchema) => {
    setPreEditRowId(row.id);
    setSingleEditingEnabled(true);
  };

  if (isEditingEnabled && attendanceRow.attendance === null) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-2">
          <Checkbox
            id="Present"
            checked={myattendanceStatus.some(
              (item) =>
                item.student === attendanceRow.id && item.status === "Present"
            )}
            onCheckedChange={() => handleCheckboxChange("Present")}
          />
          <p>Present</p>
        </div>
        <div className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-2">
          <Checkbox
            id="Absent"
            checked={myattendanceStatus.some(
              (item) =>
                item.student === attendanceRow.id && item.status === "Absent"
            )}
            onCheckedChange={() => handleCheckboxChange("Absent")}
          />
          <p>Absent</p>
        </div>
        <div className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-2">
          <Checkbox
            id="Late"
            checked={myattendanceStatus.some(
              (item) =>
                item.student === attendanceRow.id && item.status === "Late"
            )}
            onCheckedChange={() => handleCheckboxChange("Late")}
          />
          <p>Late</p>
        </div>
        <div className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-2">
          <Checkbox
            id="Excused"
            checked={myattendanceStatus.some(
              (item) =>
                item.student === attendanceRow.id && item.status === "Excused"
            )}
            onCheckedChange={() => handleCheckboxChange("Excused")}
          />
          <p>Excused</p>
        </div>
      </div>
    );
  }

  if (
    isSingleEditingEnabled &&
    attendanceRow.attendance !== null &&
    !isEditingEnabled &&
    preEditRowId === attendanceRow.id
  ) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-2">
          <Checkbox
            id="Present"
            disabled={attendanceRow.attendance.status === "Present"}
            checked={
              updatedSingleEditStatus === "Present" ||
              attendanceRow.attendance.status === "Present"
            }
            onCheckedChange={() => setUpdatedSingleEditStatus("Present")}
          />
          <p>Present</p>
        </div>
        <div className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-2">
          <Checkbox
            id="Absent"
            disabled={attendanceRow.attendance.status === "Absent"}
            checked={
              updatedSingleEditStatus === "Absent" ||
              attendanceRow.attendance.status === "Absent"
            }
            onCheckedChange={() => setUpdatedSingleEditStatus("Absent")}
          />
          <p>Absent</p>
        </div>
        <div className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-2">
          <Checkbox
            id="Late"
            checked={
              updatedSingleEditStatus === "Late" ||
              attendanceRow.attendance.status === "Late"
            }
            disabled={attendanceRow.attendance.status === "Late"}
            onCheckedChange={() => setUpdatedSingleEditStatus("Late")}
          />
          <p>Late</p>
        </div>
        <div className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-2">
          <Checkbox
            id="Excused"
            checked={
              updatedSingleEditStatus === "Excused" ||
              attendanceRow.attendance.status === "Excused"
            }
            disabled={attendanceRow.attendance.status === "Excused"}
            onCheckedChange={() => setUpdatedSingleEditStatus("Excused")}
          />
          <p>Excused</p>
        </div>
        <div className="flex gap-2">
          <Button
            className="flex items-center gap-2"
            size={"sm"}
            onClick={handleSingleCheckboxChange}
          >
            {isSaving ? (
              <Icons.spinner className="h-4 w-4 animate-spin" />
            ) : (
              <Check height={15} width={15} />
            )}
          </Button>
          <Button
            variant={"destructive"}
            size={"sm"}
            className="flex items-center gap-2"
            onClick={() => setSingleEditingEnabled(false)}
          >
            <X height={15} width={15} />
          </Button>
        </div>
      </div>
    );
  }

  if (attendanceRow.attendance) {
    const getButtonVariant = (type: string) => {
      return attendanceRow.attendance?.status === type
        ? type.toLowerCase()
        : "secondary";
    };

    return (
      <div className="flex justify-between">
        <div className="flex gap-3">
          <Button
            variant={getButtonVariant("Present") as "present" | "secondary"}
            size="sm"
          >
            Present
          </Button>
          <Button
            variant={getButtonVariant("Absent") as "absent" | "secondary"}
            size="sm"
          >
            Absent
          </Button>
          <Button
            variant={getButtonVariant("Late") as "late" | "secondary"}
            size="sm"
          >
            Late
          </Button>
          <Button
            variant={getButtonVariant("Excused") as "excused" | "secondary"}
            size="sm"
          >
            Excused
          </Button>
        </div>
        {isEditingEnabled ? null : (
          <div className="flex items-center gap-3 mr-8">
            <Button variant={"outline"} size={"sm"}>
              <Pencil
                height={18}
                width={18}
                className="text-primary cursor-pointer "
                onClick={() => handleSingleRowEdit(attendanceRow)}
              />
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button variant="secondary" size="sm">
        Present
      </Button>
      <Button variant="secondary" size="sm">
        Absent
      </Button>
      <Button variant="secondary" size="sm">
        Late
      </Button>
      <Button variant="secondary" size="sm">
        Excused
      </Button>
    </div>
  );
}
