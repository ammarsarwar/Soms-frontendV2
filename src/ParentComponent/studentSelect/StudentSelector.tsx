import React, { useState, useEffect } from "react";
import { getStudents } from "@/serverParent/student_profile/actions";
import { StudentProfile } from "@/components/student/data/schema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";

interface StudentSelectorProps {
  onStudentSelect: (student: StudentProfile | null) => void; // Define the prop type
}
const StudentSelector: React.FC<StudentSelectorProps> = ({
  onStudentSelect,
}) => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
    null
  );
  const [hasFetched, setHasFetched] = useState(false);
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const fetchedStudent = await getStudents();
      setStudents(fetchedStudent);
      console.log("this is what getting stored in studentds", fetchedStudent);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = (studentName: any) => {
    const student = students.find(
      (s) =>
        s.studentData.student_first_name_english +
          s.studentData.student_last_name_english ===
        studentName
    );
    if (student) {
      setSelectedStudent(student);
      onStudentSelect(student); // Use the callback to notify the parent component
    } else {
      setSelectedStudent(null);
      onStudentSelect(null); // Notify parent component about the deselection
    }
  };
  const handleSelectFocus = () => {
    if (!hasFetched) {
      fetchStudents();
      setHasFetched(true);
    }
  };
  const {
    control,
    formState: { errors },
  } = useForm<FormData>();
  interface FormData {
    studentName: string;
  }
  return (
    <div>
      <Controller
        name="studentName"
        control={control}
        rules={{ required: "Student selection is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Select
            value={value}
            onValueChange={(val) => {
              onChange(val);
              handleStudentChange(val);
            }}
            onOpenChange={handleSelectFocus}
            disabled={loading}
          >
            <SelectTrigger
              className={cn(
                "w-[240px] text-left font-normal",
                !selectedStudent && "text-muted-foreground"
              )}
            >
              <SelectValue
                placeholder={loading ? "Loading..." : "Select a student"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                <SelectLabel>Student</SelectLabel>
                {students.map((student: StudentProfile) => (
                  <SelectItem
                    key={student.id}
                    value={
                      student.studentData.student_first_name_english +
                      student.studentData.student_last_name_english
                    }
                  >
                    {student.studentData.student_first_name_english +
                      " " +
                      student.studentData.student_last_name_english}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      {errors.studentName && (
        <small className="text-red-500 font-bold">
          {errors.studentName.message}
        </small>
      )}
    </div>
  );
};

export default StudentSelector;
