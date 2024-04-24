"use client";
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
import { getAssignedLessons } from "@/serverParent/lessonManagement/lesson/action";

import { Lesson } from "../lessonSelect/lesson-Types";

interface StudentSelectorProps {
  onStudentSelect: (student: StudentProfile | null) => void;
  onLessonSelect: (lesson: Lesson | null) => void; // Add onLessonSelect as a prop
}

const StudentLessonSelector: React.FC<StudentSelectorProps> = ({
  onStudentSelect,
  onLessonSelect,
}) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
    null
  );
  const [hasFetched, setHasFetched] = useState(false);

  const focusSelect = () => {
    if (!hasFetched) {
      fetchStudents();
      setHasFetched(true);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const fetchedStudents = await getStudents();
      setStudents(fetchedStudents);
      console.log("Students:", fetchedStudents);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = async (studentName: any) => {
    const student = students.find(
      (s) =>
        `${s.studentData.student_first_name_english}${s.studentData.student_last_name_english}` ===
        studentName
    );

    if (student) {
      setSelectedStudent(student);
      onStudentSelect(student);

      try {
        const fetchedLessons = await getAssignedLessons(student.section?.id);
        setLessons(fetchedLessons);
        console.log("these are fetchedLessons", fetchedLessons);
      } catch (error: any) {
        console.log("Error fetching lessons:", error);
        setLessons([]);
      }
    } else {
      setSelectedStudent(null);
      onStudentSelect(null);
      setLessons([]);
    }
  };

  const handleLessonChange = (lessonName: string) => {
    const selected = lessons.find(
      (lesson) => lesson.course.title === lessonName
    );
    if (selected) {
      setSelectedLesson(selected);
      onLessonSelect(selected);
    }
  };

  const {
    control,
    formState: { errors },
  } = useForm<FormData>();

  interface FormData {
    studentName: string;
    lessonName: string;
  }

  return (
    <>
      <div className="flex flex-row gap-2">
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
                onOpenChange={focusSelect}
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
                        value={`${student.studentData.student_first_name_english}${student.studentData.student_last_name_english}`}
                      >
                        {`${student.studentData.student_first_name_english} ${student.studentData.student_last_name_english}`}
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
        <div>
          <Controller
            name="lessonName"
            control={control}
            rules={{ required: "Lesson selection is required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Select
                value={value}
                onValueChange={(val) => {
                  onChange(val);
                  handleLessonChange(val);
                }}
                disabled={loading || !selectedStudent}
              >
                <SelectTrigger
                  className={cn(
                    "w-[240px] text-left font-normal",
                    !selectedStudent && "text-muted-foreground"
                  )}
                >
                  <SelectValue
                    placeholder={loading ? "Loading..." : "Select a lesson"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                    <SelectLabel>Lesson</SelectLabel>
                    {lessons.map((lesson: Lesson) => (
                      <SelectItem key={lesson.id} value={lesson.course.title}>
                        {lesson.course.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.lessonName && (
            <small className="text-red-500 font-bold">
              {errors.lessonName.message}
            </small>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentLessonSelector;
