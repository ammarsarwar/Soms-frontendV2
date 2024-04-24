// import React, { useState, useEffect } from "react";
// import { getStudents } from "@/serverParent/student_profile/actions";
// import { StudentProfile } from "@/components/student/data/schema";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Controller } from "react-hook-form";
// import { useForm } from "react-hook-form";
// import { cn } from "@/lib/utils";
// import { Lesson } from "./lesson-Types";
// import { getAssignedLessons } from "@/serverParent/lessonManagement/lesson/action";

// interface StudentLessonSelectorProps {
//   onStudentSelect: (student: StudentProfile | null) => void;
//   onLessonSelect: (lesson: Lesson | null) => void;
// }
// interface FormData {
//   studentName: string;
//   lessonName: string;
// }
// const StudentLessonSelector: React.FC<StudentLessonSelectorProps> = ({
//   onStudentSelect,
//   onLessonSelect,
// }) => {
//   const [lessons, setLessons] = useState<Lesson[]>([]);
//   const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
//   const [students, setStudents] = useState<StudentProfile[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
//     null
//   );
//   const [hasFetched, setHasFetched] = useState(false);
//   const fetchStudents = async () => {
//     setLoading(true);
//     try {
//       const fetchedStudent = await getStudents();
//       setStudents(fetchedStudent);
//       console.log("this is what getting stored in studentds", fetchedStudent);
//     } catch (error: any) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     const fetchLessons = async () => {
//       // Ensure there's a selected student with a valid section ID
//       if (selectedStudent?.section?.id) {
//         setLoading(true);
//         try {
//           const fetchedLessons = await getAssignedLessons(
//             selectedStudent.section.id
//           );
//           console.log("Fetched lessons:", fetchedLessons);
//           setLessons(fetchedLessons);
//         } catch (error) {
//           console.error("Error fetching lessons:", error);
//           setLessons([]); // Ensure to clear lessons on error or if no lessons are found
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         // No selected student or no valid section ID, clear lessons
//         setLessons([]);
//       }
//     };

//     fetchLessons();
//   }, [selectedStudent]); // Listen for changes in selectedStudent

//   const handleStudentChange = (studentName: string) => {
//     const student = students.find(
//       (s) =>
//         `${s.studentData.student_first_name_english}${s.studentData.student_last_name_english}` ===
//         studentName
//     );
//     setSelectedStudent(student || null); // Set to null if not found
//     onStudentSelect(student || null);
//     console.log("this is student id", student?.id);
//   };
//   const handleLessonChange = (lessonName: any) => {
//     const selectedLesson =
//       lessons.find((l: any) => l.course.title === lessonName) || null;
//     setSelectedLesson(selectedLesson);
//     onLessonSelect(selectedLesson);
//     if (selectedLesson) {
//       console.log("Selected lesson ID:", selectedLesson.id);
//     }
//   };
//   const handleSelectFocus = () => {
//     if (!hasFetched) {
//       fetchStudents();
//       setHasFetched(true);
//     }
//   };

//   const {
//     control,
//     formState: { errors },
//   } = useForm<FormData>();

//   return (
//     <div>
//       <Controller
//         name="studentName"
//         control={control}
//         rules={{ required: "Student selection is required" }}
//         render={({ field: { onChange, value }, fieldState: { error } }) => (
//           <Select
//             value={value}
//             onValueChange={(val) => {
//               onChange(val);
//               handleStudentChange(val);
//             }}
//             onOpenChange={handleSelectFocus}
//             disabled={loading}
//           >
//             <SelectTrigger
//               className={cn(
//                 "w-[240px] text-left font-normal",
//                 !selectedStudent && "text-muted-foreground"
//               )}
//             >
//               <SelectValue
//                 placeholder={loading ? "Loading..." : "Select a student"}
//               />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectGroup className="h-36 overflow-scroll no-scrollbar">
//                 <SelectLabel>Student</SelectLabel>
//                 {students.map((student: StudentProfile) => (
//                   <SelectItem
//                     key={student.id}
//                     value={
//                       student.studentData.student_first_name_english +
//                       student.studentData.student_last_name_english
//                     }
//                   >
//                     {student.studentData.student_first_name_english +
//                       " " +
//                       student.studentData.student_last_name_english}
//                   </SelectItem>
//                 ))}
//               </SelectGroup>
//             </SelectContent>
//           </Select>
//         )}
//       />
//       {errors.studentName && (
//         <small className="text-red-500 font-bold">
//           {errors.studentName.message}
//         </small>
//       )}
//       <Controller
//         name="lessonName"
//         control={control}
//         rules={{ required: "Lesson selection is required" }}
//         render={({ field: { onChange, value }, fieldState: { error } }) => (
//           <Select
//             value={value}
//             onValueChange={(val) => {
//               onChange(val);
//               handleLessonChange(val);
//             }}
//             disabled={lessons.length === 0}
//           >
//             <SelectTrigger
//               className={cn(
//                 "w-[240px] text-left font-normal",
//                 !value && "text-muted-foreground"
//               )}
//             >
//               <SelectValue
//                 placeholder={
//                   lessons.length === 0
//                     ? "Select a student first"
//                     : "Select a lesson"
//                 }
//               />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectGroup>
//                 <SelectLabel>Lesson</SelectLabel>
//                 {lessons.map((lesson) => (
//                   <SelectItem key={lesson.id} value={lesson.id.toString()}>
//                     {lesson.course.title}
//                   </SelectItem>
//                 ))}
//               </SelectGroup>
//             </SelectContent>
//           </Select>
//         )}
//       />
//       {errors.lessonName && (
//         <small className="text-red-500 font-bold">
//           {errors.lessonName.message}
//         </small>
//       )}
//     </div>
//   );
// };

// export default StudentLessonSelector;

"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { getStudents } from "@/serverParent/student_profile/actions";
import { StudentProfile } from "@/components/student/data/schema";
import { Lesson } from "./lesson-Types";
import { getAssignedLessons } from "@/serverParent/lessonManagement/lesson/action";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface StudentLessonSelectorProps {
  onStudentSelect: (student: StudentProfile | null) => void;
  onLessonSelect: (lesson: Lesson | null) => void;
}

interface FormData {
  studentName: string;
  lessonName: string;
}

const StudentLessonSelector: React.FC<StudentLessonSelectorProps> = ({
  onStudentSelect,
  onLessonSelect,
}) => {
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch students on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const fetchedStudents = await getStudents();
        setStudents(fetchedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Fetch lessons when a student is selected
  useEffect(() => {
    const fetchLessons = async () => {
      const studentName = getValues("studentName");
      const student = students.find(
        (s) =>
          `${s.studentData.student_first_name_english}${s.studentData.student_last_name_english}` ===
          studentName
      );

      if (student && student.section?.id) {
        setLoading(true);
        try {
          const fetchedLessons = await getAssignedLessons(student.section.id);
          setLessons(fetchedLessons);
          onStudentSelect(student);
          setValue("lessonName", "");
        } catch (error) {
          console.error("Error fetching lessons:", error);
          setLessons([]);
        } finally {
          setLoading(false);
        }
      }
    };

    if (students.length > 0) {
      fetchLessons();
    }
  }, [getValues, onStudentSelect, setValue, students]);

  return (
    <div>
      {/* Student Selection */}
      <Controller
        name="studentName"
        control={control}
        rules={{ required: "Student selection is required" }}
        render={({ field }) => (
          <Select
            {...field}
            onValueChange={(val) => {
              field.onChange(val);
              // This triggers useEffect to refetch lessons based on the new student selection
            }}
            disabled={loading}
          >
            <SelectTrigger
              className={cn("w-full", !field.value && "text-muted-foreground")}
            >
              <SelectValue
                placeholder={loading ? "Loading..." : "Select a student"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {students.map((student) => (
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
        <p className="text-red-500">{errors.studentName.message}</p>
      )}

      {/* Lesson Selection */}
      <Controller
        name="lessonName"
        control={control}
        rules={{ required: "Lesson selection is required" }}
        render={({ field }) => (
          <Select
            {...field}
            onValueChange={(val) => {
              field.onChange(val);
              const selectedLesson = lessons.find(
                (l) => l.id.toString() === val
              );
              onLessonSelect(selectedLesson || null);
            }}
            disabled={lessons.length === 0}
          >
            <SelectTrigger
              className={cn("w-full", !field.value && "text-muted-foreground")}
            >
              <SelectValue
                placeholder={
                  lessons.length === 0
                    ? "Select a student first"
                    : "Select a lesson"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {lessons.map((lesson) => (
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
        <p className="text-red-500">{errors.lessonName.message}</p>
      )}
    </div>
  );
};

export default StudentLessonSelector;
