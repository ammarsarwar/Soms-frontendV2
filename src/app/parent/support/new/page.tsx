"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { postTicket } from "@/serverParent/tickets/actions";
import { getStudents } from "@/serverParent/student_profile/actions";
import { StudentProfile } from "@/components/student/data/schema";
import { Controller } from "react-hook-form";
import { Icons } from "@/components/ui/icons";

import { getAssignedLessonsBySection } from "@/serverParent/lessonManagement/lesson/action";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button"; // Assuming this is the correct import for SHAD CN Button
import { Separator } from "@/components/ui/separator";
import { TAssignedLessonsSchema, TTeacherUserSchema } from "@/schemas";
type MainCategory =
  | "Administration"
  | "Academic"
  | "Technical"
  | "Counseling"
  | "Health and Safety"
  // | "Teachers"
  | "Others";

const subCategories: Record<MainCategory, string[] | undefined> = {
  Administration: [
    "Registration",
    "Finance",
    "Logistics",
    "Transport",
    "Uniform",
    "Supplies",
  ],
  Academic: ["Attendance", "Exams", "General academics"],
  Technical: undefined,
  Counseling: ["Behavior", "well-being"],
  "Health and Safety": ["Incidents", "Health"],
  // Teachers: undefined,
  Others: undefined,
};

interface FormData {
  studentName: string;
  mainCategory: MainCategory | "";
  subCategory: string;
  title: string;
  teacherName: string;
  description: string;
  teacher: string;
}

type TeacherSchema = {
  id: number;
  school: number;
  branch: number;
  campus: number;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  created_by: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  userRole: string;
  created_at: string;
  department?: unknown;
};

const NewTicket = () => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [teacherFetched, setTeacherFetched] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
    null
  );
  const {
    reset,
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { isSubmitting, isLoading, errors },
  } = useForm<FormData>();
  const [subCategoryOptions, setSubCategoryOptions] = useState<string[]>([]);
  const [isSubCategoryDisabled, setIsSubCategoryDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const mainCategory = watch("mainCategory");

  const [teacher, setTeacher] = useState<TAssignedLessonsSchema[]>([]);
  const [selectedTeacher, setSelectedTeacher] =
    useState<TAssignedLessonsSchema | null>(null);

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
      console.log("Student id is", student.id);
    } else {
      setSelectedStudent(null);
      console.log("no student id found ");
    }
  };
  const handleSelectFocus = () => {
    if (!hasFetched) {
      fetchStudents();
      setHasFetched(true);
    }
  };

  // const fetchTeachers = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await getAssignedLessonsBySection();
  //     console.log("Fetched teachers:", response);
  //     const fetchedTeachers = response.map(
  //       (item: TAssignedLessonsSchema) => item.teacher
  //     );
  //     setTeacher(fetchedTeachers);
  //     console.log("This is what is getting stored in teacher", teacher);
  //   } catch (error) {
  //     console.error("Error fetching teachers:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleTeacherChange = (teacherName: any) => {
  //   const teachersList = teacher.find(
  //     (t) =>
  //       t.teacher.user.first_name + t.teacher.user.last_name === teacherName
  //   );
  //   if (teachersList) {
  //     setSelectedTeacher(teachersList);
  //     console.log("selected teacher id", teachersList.teacher.id);
  //   } else {
  //     setSelectedTeacher(null);
  //     console.log("no teacher id found ");
  //   }
  // };
  // const handleTeacherFocus = () => {
  //   if (!teacherFetched) {
  //     fetchTeachers();
  //     setTeacherFetched(true);
  //   }
  // };

  useEffect(() => {
    if (mainCategory && subCategories[mainCategory]) {
      setSubCategoryOptions(subCategories[mainCategory]!);
      setIsSubCategoryDisabled(false);
    } else {
      setSubCategoryOptions([]);
      setIsSubCategoryDisabled(true);
    }
  }, [mainCategory]);

  const onSubmit = async (data: FormData) => {
    const payload = {
      student: selectedStudent?.id,
      title: data.title,
      category: data.mainCategory,
      sub_category: data.subCategory,
      issue: data.description,
      teacher: selectedTeacher?.teacher.id,
    };
    console.log("this is what im sending in payload", payload);
    const res = await postTicket(payload);
    if (res === undefined) {
      alert("error creating a new ticket");
    } else {
      alert("New ticket has been created");
    }
    reset();
  };

  useEffect(() => {
    register("mainCategory");
    register("subCategory");
    register("title");
    register("description");
  }, [register]);
  const subCategory = watch("subCategory");
  // const showTeacherSelect = mainCategory === "Teachers";

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Open a support ticket
            </h2>

            <p className="text-muted-foreground">
              Here you can select category and open a ticket
            </p>
          </div>
        </div>
        <Separator />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className=" flex justify-center">
            <div className="flex flex-col gap-8 p-5 w-[800px]">
              <div className="grid gap-3">
                <Label htmlFor="studentName">Select student</Label>
                <Controller
                  name="studentName"
                  control={control}
                  rules={{ required: "Student selection is required" }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Select
                      value={value}
                      onValueChange={(val) => {
                        onChange(val);
                        handleStudentChange(val);
                      }}
                      onOpenChange={handleSelectFocus}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            loading ? "Loading..." : "Select a student"
                          }
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
              <div className="grid gap-3">
                <Label>Main categories</Label>
                <Select
                  onValueChange={(value) => {
                    setValue("mainCategory", value as MainCategory);
                  }}
                  value={mainCategory || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a main category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Main Categories</SelectLabel>
                      {Object.keys(subCategories).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {mainCategory !== "Others" && subCategoryOptions.length > 0 && (
                <>
                  <div className="grid gap-3">
                    <Label>Sub categories</Label>
                    <Select
                      onValueChange={(value) => {
                        setValue("subCategory", value);
                      }}
                      value={watch("subCategory") || ""}
                      disabled={isSubCategoryDisabled}
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-disabled={isSubCategoryDisabled}
                      >
                        <SelectValue placeholder="Select a sub category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Sub Categories</SelectLabel>
                          {subCategoryOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              {/* {showTeacherSelect && (
                <div className="grid gap-3">
                  <Label>Teachers</Label>
                  <Controller
                    name="teacherName"
                    control={control}
                    rules={{ required: "Teacher selection is required" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Select
                        value={value}
                        onValueChange={(val) => {
                          onChange(val);
                          handleTeacherChange(val);
                        }}
                        onOpenChange={handleTeacherFocus}
                        disabled={loading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              loading ? "Loading..." : "Select a teacher"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Teacher List</SelectLabel>
                            {teacher.map((t) => (
                              <SelectItem
                                key={t.teacher?.id}
                                value={`${t.teacher?.user.first_name} ${t.teacher?.user.last_name}`}
                              >
                                {`${t.teacher?.user.first_name} ${t.teacher?.user.last_name}`}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.teacherName && (
                    <small className="text-red-500 font-bold">
                      {errors.teacherName.message}
                    </small>
                  )}
                </div>
              )} */}
              <div className="grid gap-3">
                <Label>Title</Label>
                <Input {...register("title")} placeholder="Ticket title here" />
              </div>
              <div className="grid gap-3">
                <Label>Description</Label>

                <Textarea
                  {...register("description")}
                  placeholder="Write ticket details here"
                  className="resize-none"
                />
              </div>
              <div className="mt-5">
                <Button disabled={isLoading || isSubmitting} type="submit">
                  {isLoading ||
                    (isSubmitting && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ))}
                  Submit ticket
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewTicket;
