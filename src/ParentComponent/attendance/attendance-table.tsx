"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/ParentComponent/dismissalSetup/DatePicker";
import StudentSelector from "@/ParentComponent/studentSelect/StudentSelector";
import { DataTable } from "./data-table";
import { getAttendance } from "@/serverParent/attendance/actions";
import { StudentProfile } from "@/components/student/data/schema";
import { Attendance } from "./attendance-types";
import { columns } from "./columns";
import { format } from "date-fns";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import { AlertTriangle, BookCheck, ListTodo } from "lucide-react";
const AttendanceTable = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
    null
  );
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStudentSelect = (student: StudentProfile | null) => {
    setSelectedStudent(student);
  };
  useEffect(() => {
    console.log(
      "Updated selectedStudent in parent component:",
      selectedStudent
    );
  }, [selectedStudent]);

  const fetchAttendanceData = async () => {
    if (selectedDate && selectedStudent) {
      setIsLoading(true);
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      const data = await getAttendance(formattedDate, selectedStudent.id);
      setAttendanceList(data);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex w-full border border-dashed border-primary p-2 rounded-md gap-3">
        <div className="hidden space-x-3 lg:flex">
          <StudentSelector onStudentSelect={handleStudentSelect} />
          <DatePicker onDateSelect={setSelectedDate} />
          <Button
            type="button"
            variant="secondary"
            disabled={!selectedStudent || !selectedDate}
            onClick={fetchAttendanceData}
          >
            Apply filters
          </Button>
        </div>
      </div>
      <div>
        {isLoading ? (
          <BranchTableSkeleton />
        ) : !selectedStudent || !selectedDate ? (
          <div className="w-full flex justify-center items-center mt-36 gap-3">
            <AlertTriangle size={24} />
            Please select a student and date to view attendance.
          </div>
        ) : attendanceList.length > 0 ? (
          <DataTable data={attendanceList} columns={columns} />
        ) : (
          <div className="w-full flex justify-center items-center mt-36 gap-3">
            <AlertTriangle size={24} />
            No attendance marked against the selected date yet.
          </div>
        )}
      </div>
    </>
  );
};

export default AttendanceTable;
