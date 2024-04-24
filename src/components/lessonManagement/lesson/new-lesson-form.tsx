"use client";

import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
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
import { postLessons } from "@/server/lessonManagement/lesson/action";
import { Department, Grade, PostFormLessonSchema } from "@/schemas";

const NewLessonForm = ({
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
  const isMounted = useRef(true);
  const lessonRef = useRef<HTMLFormElement>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<PostFormLessonSchema>({
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    watch,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const branchId = watch("branch");
  const campusId = watch("campus");
  const departmentId = watch("department");

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

  const onSubmit = async (values: PostFormLessonSchema) => {
    startTransition(() => {
      postLessons(values).then((data) => {
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-8 mt-8 mb-8 ">
        <div className="grid gap-3">
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
        <div className="grid gap-3">
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
                    isSubmitting ||
                    isCampusLoading ||
                    campuses.length < 1
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
                      {branches.length === 0 && <span>No campus found</span>}
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
        <div className="grid gap-3">
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
        <div className="grid gap-3">
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
        <div className="grid grid-cols-1 gap-8">
          <div className="grid gap-3">
            <Label htmlFor="title">Title</Label>
            <div className="flex flex-col gap-2">
              <Input
                id="title"
                placeholder="Lesson title"
                type="text"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                {...register("title")}
                disabled={isLoading || isSubmitting}
              />
              {errors.title && (
                <small className="text-red-500 font-bold">
                  {errors.title?.message}
                </small>
              )}
            </div>
          </div>
          {/* <div className="grid gap-3">
            <Label htmlFor="max_grade">Max Grade</Label>
            <div className="flex flex-col gap-2">
              <Input
                id="max_grade"
                placeholder="Lesson max grade "
                type="text"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                {...register("max_grade")}
                disabled={isLoading || isSubmitting}
              />
              {errors.max_grade && (
                <small className="text-red-500 font-bold">
                  {errors.max_grade?.message}
                </small>
              )}
            </div>
          </div> */}
        </div>
      </div>
      <div className="w-full flex justify-end">
        <Button
          disabled={isLoading || isSubmitting}
          type="submit"
          onClick={() => {
            if (lessonRef.current) {
              lessonRef.current.dispatchEvent(
                new Event("submit", { bubbles: true })
              );
            }
          }}
        >
          {isLoading ||
            (isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ))}
          Create
        </Button>
      </div>
    </form>
  );
};

export default NewLessonForm;
