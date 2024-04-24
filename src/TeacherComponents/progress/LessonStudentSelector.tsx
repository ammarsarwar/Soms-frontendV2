import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BookA, Pencil } from "lucide-react";
import { getAssignedLessons } from "@/serverTeacher/lessons/actions";
import { getStudentBySection } from "@/serverTeacher/student_profile/actions";

import { StudentProfile } from "@/components/student/data/schema";
import { TAssignedLessonsSchema } from "@/schemas";
interface LessonStudentSelectorProps {
  onSelectionChange: (selection: {
    lessonId: number | string;
    studentId: number | string;
  }) => void;
}

interface Selection {
  lessonId: number | string;
  studentId: number | string;
}
export const LessonStudentSelector: React.FC<LessonStudentSelectorProps> = ({
  onSelectionChange,
}) => {
  const { control, setValue, watch } = useForm({
    defaultValues: {
      lesson: "",
      student: "",
    },
  });

  const [lessons, setLessons] = useState<TAssignedLessonsSchema[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [selectedLesson, setSelectedLesson] =
    useState<TAssignedLessonsSchema | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await getAssignedLessons();
        setLessons(res);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    fetchLessons();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedLesson && selectedLesson.section.id) {
        try {
          const students = await getStudentBySection(selectedLesson.section.id);
          setStudents(students.results || []);
          setValue("student", ""); // Reset student selection when lessons change
        } catch (error) {
          console.error("Error fetching students:", error);
          setStudents([]);
        }
      }
    };

    fetchStudents();
  }, [selectedLesson, setValue]);

  // Update selectedLesson state when lesson selection changes
  useEffect(() => {
    const lessonId = watch("lesson");
    const lesson = lessons.find((l) => l.id.toString() === lessonId);
    setSelectedLesson(lesson || null);
  }, [watch("lesson"), lessons]);

  // Notify parent component about selection changes
  useEffect(() => {
    const selectedStudentId = watch("student");
    if (selectedLesson) {
      onSelectionChange({
        lessonId: selectedLesson.id, // Ensure this is typed correctly based on your data model
        studentId: selectedStudentId,
      });
    }
  }, [watch("lesson"), watch("student"), selectedLesson, onSelectionChange]);
  return (
    <div className="flex flex-row gap-3">
      <div className="">
        {" "}
        <Controller
          name="lesson"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select a lesson" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Lessons</SelectLabel>
                  {lessons.map((lesson) => (
                    <SelectItem key={lesson.id} value={lesson.id.toString()}>
                      {lesson.course.title} {"-"} {lesson.section.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div>
        <Controller
          name="student"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger className="w-[220px]" disabled={!selectedLesson}>
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Students</SelectLabel>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.studentData.student_first_name_english}{" "}
                      {student.studentData.student_middle_name_english}{" "}
                      {student.studentData.student_last_name_english}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  );
};
