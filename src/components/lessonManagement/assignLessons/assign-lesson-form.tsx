"use client";

import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Branch, Campus } from "@/components/TeacherSchema/schema";
import { getBranches } from "@/server/branch/actions";
import { getSelectedCam } from "@/server/campus/actions";

import { getSelectedDept } from "@/server/department/actions";

import { getSelectedGrade } from "@/server/grade/actions";
import {
  getSelectedLessons,
  getSelectedTeachers,
  postAssignLessons,
} from "@/server/lessonManagement/lesson/action";
import {
  AssignLessonFormSchema,
  Department,
  Grade,
  Section,
  TLessonSchema,
} from "@/schemas";
import { TFilteredTeachersWithRoleSchema } from "./assign-lesson-types";
import { getSection, getSelectedSection } from "@/server/section/actions";

const AssignLessonForm = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [isBranchLoading, setIsBranchLoading] = useState(false);
  const [isCampusLoading, setIsCampusLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isDepartmentLoading, setIsDepartmentLoading] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isGradeLoading, setIsGradeLoading] = useState(false);
  const [lessons, setLessons] = useState<TLessonSchema[]>([]);
  const [isLessonLoading, setIsLessonLoading] = useState(false);
  const [teacherList, setTeacherList] = useState<
    TFilteredTeachersWithRoleSchema[]
  >([]);
  const [isTeacherLoading, setIsTeacherLoading] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [isSectionLoading, setIsSectionLoading] = useState(false);
  const isMounted = useRef(true);
  const assignLessonRef = useRef<HTMLFormElement>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<AssignLessonFormSchema>({
    mode: "onChange",
  });

  const {
    reset,
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const branchId = watch("branch");
  const campusId = watch("campus");
  const departmentId = watch("department");
  const gradeId = watch("grade");
  const lessonId = watch("lesson");
  const teacherId = watch("teacher");

  //fetch branches when we have the user array
  useEffect(() => {
    const listOfBranches = async () => {
      try {
        setIsBranchLoading(true);
        const res = await getBranches();
        setBranches(res);
        setIsBranchLoading(false);
      } catch (error) {
        console.error("error", error);
        alert("error fetching branches");
        setIsBranchLoading(false);
      } finally {
        setIsBranchLoading(false);
      }
    };

    listOfBranches();
  }, []);

  //fetch campuses when we have the branch
  useEffect(() => {
    if (
      !isMounted.current &&
      branches.length > 0 &&
      getValues("branch") != ""
    ) {
      const listOfCampuses = async () => {
        try {
          setIsCampusLoading(true);
          const res = await getSelectedCam(Number(branchId));
          setCampuses(res);
          setIsCampusLoading(false);
        } catch (error) {
          console.error("error", error);
          alert("error fetching campuses");
          setIsCampusLoading(false);
        } finally {
          setIsCampusLoading(false);
        }
      };

      listOfCampuses();
    }
    isMounted.current = false;
  }, [branchId]);

  //fetch departments when we have the campus
  useEffect(() => {
    if (
      !isMounted.current &&
      branches.length > 0 &&
      campuses.length > 0 &&
      getValues("campus") != ""
    ) {
      const listOfDepartments = async () => {
        try {
          setIsDepartmentLoading(true);
          const res = await getSelectedDept(Number(campusId));
          setDepartments(res);
          setIsDepartmentLoading(false);
        } catch (error) {
          console.error("error", error);
          alert("error fetching departments");
          setIsDepartmentLoading(false);
        } finally {
          setIsDepartmentLoading(false);
        }
      };

      listOfDepartments();
    }
    isMounted.current = false;
  }, [campusId]);

  //fetch grades when we have the department
  useEffect(() => {
    if (
      !isMounted.current &&
      branches.length > 0 &&
      campuses.length > 0 &&
      departments.length > 0 &&
      getValues("department") != ""
    ) {
      const listOfGrades = async () => {
        try {
          setIsGradeLoading(true);
          console.log("deptId", departmentId);
          const res = await getSelectedGrade(Number(departmentId));
          setGrades(res);
          setIsGradeLoading(false);
        } catch (error) {
          console.error("error", error);
          alert("error fetching grades");
          setIsGradeLoading(false);
        } finally {
          setIsGradeLoading(false);
        }
      };

      listOfGrades();
    }
    isMounted.current = false;
  }, [departmentId]);

  //fetch lessons when we have the grades
  useEffect(() => {
    if (
      !isMounted.current &&
      branches.length > 0 &&
      campuses.length > 0 &&
      departments.length > 0 &&
      grades.length > 0 &&
      getValues("grade") != ""
    ) {
      const listOfLessons = async () => {
        try {
          setIsLessonLoading(true);
          const res = await getSelectedLessons(Number(gradeId));
          setLessons(res);
          setIsLessonLoading(false);
        } catch (error) {
          console.error("error", error);
          alert("error fetching lessons");
          setIsLessonLoading(false);
        } finally {
          setIsLessonLoading(false);
        }
      };

      listOfLessons();
    }
    isMounted.current = false;
  }, [gradeId]);

  //fetch teachers when we have the courses
  useEffect(() => {
    if (
      !isMounted.current &&
      branches.length > 0 &&
      campuses.length > 0 &&
      departments.length > 0 &&
      grades.length > 0 &&
      lessons.length > 0 &&
      getValues("lesson") != ""
    ) {
      const listOfTeachers = async () => {
        try {
          setIsTeacherLoading(true);
          const res = await getSelectedTeachers(Number(campusId));
          setTeacherList(res);
          setIsTeacherLoading(false);
        } catch (error) {
          console.error("error", error);
          alert("error fetching teachers");
          setIsTeacherLoading(false);
        } finally {
          setIsTeacherLoading(false);
        }
      };

      listOfTeachers();
    }
    isMounted.current = false;
  }, [lessonId]);

  //fetch sections when we have the teachers
  useEffect(() => {
    if (
      !isMounted.current &&
      branches.length > 0 &&
      campuses.length > 0 &&
      departments.length > 0 &&
      grades.length > 0 &&
      lessons.length > 0 &&
      teacherList.length > 0 &&
      getValues("teacher") != ""
    ) {
      const listOfSections = async () => {
        try {
          setIsSectionLoading(true);
          const res = await getSelectedSection(Number(gradeId));
          setSections(res);
          setIsSectionLoading(false);
        } catch (error) {
          console.error("error", error);
          alert("error fetching sections");
          setIsSectionLoading(false);
        } finally {
          setIsSectionLoading(false);
        }
      };

      listOfSections();
    }
    isMounted.current = false;
  }, [teacherId]);

  const onSubmit = async (values: AssignLessonFormSchema) => {
    startTransition(() => {
      postAssignLessons(values).then((data) => {
        if (data.success) {
          toast.success(data.success);
          reset();
          setOpen(false);
        } else {
          toast.error(data.error);
        }
      });
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
      <div className="grid grid-cols-1 gap-2 mt-2 mb-2 ">
        <div className="grid gap-2">
          <Label htmlFor="branch">Select branch</Label>
          <div className="flex flex-col gap-2">
            <Controller
              name="branch"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={`${field.value}`}
                  disabled={
                    isLoading ||
                    isPending ||
                    isSubmitting ||
                    isBranchLoading ||
                    branches.length === 0
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isBranchLoading
                          ? "Loading branches"
                          : branches.length < 1
                          ? "No branch found"
                          : "Select a branch"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                      <SelectLabel>Branches</SelectLabel>
                      {branches.length === 0 && <span>No branch found</span>}
                      {branches?.map((branch, index) => {
                        return (
                          <SelectItem key={index} value={`${branch.id}`}>
                            {branch.name}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.branch && (
              <small className="text-red-500 font-bold">
                {errors.branch.message}
              </small>
            )}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="campus">Select campus</Label>
          <div className="flex flex-col gap-2">
            <Controller
              name="campus"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={`${field.value}`}
                  disabled={
                    isLoading ||
                    isPending ||
                    isSubmitting ||
                    isCampusLoading ||
                    campuses.length === 0
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isCampusLoading
                          ? "Loading campuses"
                          : campuses.length === 0
                          ? "No campus found"
                          : "Select a campus"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                      <SelectLabel>Campuses</SelectLabel>
                      {campuses.length === 0 && <span>No campus found</span>}
                      {campuses?.map((campus, index) => {
                        return (
                          <SelectItem key={index} value={`${campus.id}`}>
                            {campus.name}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.campus && (
              <small className="text-red-500 font-bold">
                {errors.campus.message}
              </small>
            )}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="department">Select department</Label>
          <div className="flex flex-col gap-2">
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={`${field.value}`}
                  disabled={
                    isLoading ||
                    isPending ||
                    isSubmitting ||
                    isDepartmentLoading ||
                    departments.length === 0
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isDepartmentLoading
                          ? "Loading departments"
                          : departments.length === 0
                          ? "No department found"
                          : "Select a department"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                      <SelectLabel>Departments</SelectLabel>
                      {departments.length === 0 && (
                        <span>No department found</span>
                      )}
                      {departments?.map((department, index) => {
                        return (
                          <SelectItem key={index} value={`${department.id}`}>
                            {department.name}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.department && (
              <small className="text-red-500 font-bold">
                {errors.department.message}
              </small>
            )}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="grade">Select grade</Label>
          <div className="flex flex-col gap-2">
            <Controller
              name="grade"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={`${field.value}`}
                  disabled={
                    isLoading ||
                    isPending ||
                    isSubmitting ||
                    isGradeLoading ||
                    grades.length === 0
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isGradeLoading
                          ? "Loading grades"
                          : grades.length === 0
                          ? "No grade found"
                          : "Select a grade"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                      <SelectLabel>Grades</SelectLabel>
                      {grades.length === 0 && <span>No grade found</span>}
                      {grades?.map((grade, index) => {
                        return (
                          <SelectItem key={index} value={`${grade.id}`}>
                            {grade.name}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.grade && (
              <small className="text-red-500 font-bold">
                {errors.grade.message}
              </small>
            )}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="grade">Select lesson</Label>
          <div className="flex flex-col gap-2">
            <Controller
              name="lesson"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={`${field.value}`}
                  disabled={
                    isLoading ||
                    isPending ||
                    isSubmitting ||
                    isLessonLoading ||
                    lessons.length === 0
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isLessonLoading
                          ? "Loading lessons"
                          : lessons.length === 0
                          ? "No lesson found"
                          : "Select a lesson"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                      <SelectLabel>Lesons</SelectLabel>
                      {lessons.length === 0 && <span>No lesson found</span>}
                      {lessons?.map((lesson, index) => {
                        return (
                          <SelectItem key={index} value={`${lesson.id}`}>
                            {lesson.title}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.lesson && (
              <small className="text-red-500 font-bold">
                {errors.lesson.message}
              </small>
            )}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="grade">Assign teacher</Label>
          <div className="flex flex-col gap-2">
            <Controller
              name="teacher"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={`${field.value}`}
                  disabled={
                    isLoading ||
                    isPending ||
                    isSubmitting ||
                    isTeacherLoading ||
                    teacherList.length === 0
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isTeacherLoading
                          ? "Loading teachers"
                          : teacherList.length === 0
                          ? "No teacher found"
                          : "Select a teacher"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                      <SelectLabel>Teachers</SelectLabel>
                      {teacherList.length === 0 && (
                        <span>No teacher found</span>
                      )}
                      {teacherList?.map((teacher, index) => {
                        return (
                          <SelectItem key={index} value={`${teacher.user.id}`}>
                            {teacher.user.first_name} {teacher.user.last_name}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.lesson && (
              <small className="text-red-500 font-bold">
                {errors.lesson.message}
              </small>
            )}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="grade">Assign section</Label>
          <div className="flex flex-col gap-2">
            <Controller
              name="section"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={`${field.value}`}
                  disabled={
                    isLoading ||
                    isPending ||
                    isSubmitting ||
                    isSectionLoading ||
                    sections.length === 0
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isSectionLoading
                          ? "Loading sections"
                          : sections.length === 0
                          ? "No section found"
                          : "Select a section"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                      <SelectLabel>Sections</SelectLabel>
                      {sections.length === 0 && <span>No section found</span>}
                      {sections?.map((section, index) => {
                        return (
                          <SelectItem key={index} value={`${section.id}`}>
                            {section.name}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.section && (
              <small className="text-red-500 font-bold">
                {errors.section.message}
              </small>
            )}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <Button disabled={isLoading || isSubmitting} type="submit">
          {isLoading ||
            isPending ||
            (isSubmitting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ))}
          Create
        </Button>
      </div>
    </form>
  );
};

export default AssignLessonForm;
