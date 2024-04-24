"use client";
import { Button } from "@/components/ui/button";
import { School, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { getBranches } from "@/server/branch/actions";
import { getSelectedCam } from "@/server/campus/actions";
import { getSelectedDept } from "@/server/department/actions";
import { getSelectedGrade } from "@/server/grade/actions";
import { getSelectedSection } from "@/server/section/actions";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Icons } from "../ui/icons";
import { Branch, Campus, Department, Grade } from "@/schemas";

interface SectionFilterComponentProps {
  selectedGrade: Grade | null;
  setSelectedGrade: React.Dispatch<React.SetStateAction<Grade | null>>;
}

interface ISelectGradeSchema {
  branch: string;
  campus: string;
  department: string;
  grade: string;
}

const GradeFilterComponent: React.FC<SectionFilterComponentProps> = ({
  selectedGrade,
  setSelectedGrade,
}) => {
  // states
  const [branches, setBranches] = useState<Branch[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [isBranchLoading, setIsBranchLoading] = useState(false);
  const [isCampusLoading, setIsCampusLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isDepartmentLoading, setIsDepartmentLoading] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isGradeLoading, setIsGradeLoading] = useState(false);
  const isMounted = useRef(true);
  const [open, setOpen] = useState(false);

  //form
  const form = useForm<ISelectGradeSchema>({
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
          // console.log(res);
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
          // console.log("deptId", departmentId);
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

  function getGradeByGradeId(gradeArray: Grade[], gradeId: string) {
    const result = gradeArray.find((grade) => grade.id === Number(gradeId));
    return result || null;
  }

  const onSubmit = async (values: ISelectGradeSchema) => {
    setOpen(false);
    const result = getGradeByGradeId(grades, values.grade);
    setSelectedGrade(result);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={selectedGrade ? "secondary" : "outline"}
          className={cn(
            "w-[200px] border-dashed border-primary flex justify-start items-center gap-2 font-normal truncate ...",
            !selectedGrade && "text-muted-foreground"
          )}
        >
          {selectedGrade ? (
            <Pencil height={15} width={15} />
          ) : (
            <School height={15} width={15} />
          )}
          {selectedGrade ? <p>{selectedGrade.name}</p> : <p>Select section</p>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px]">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-2">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filter section</h4>
            <p className="text-sm text-muted-foreground">
              Please select a section for attendence
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 mt-8">
            <div className="flex items-center gap-2">
              <Label htmlFor="branch" className="w-32">
                Branch
              </Label>
              <div className="flex flex-col gap-2 w-full">
                <Controller
                  name="branch"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={
                        isLoading ||
                        isSubmitting ||
                        isBranchLoading ||
                        branches.length < 1
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            isBranchLoading
                              ? "Loading branches"
                              : branches.length < 1
                              ? "No branches found"
                              : "Select a branch"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                          <SelectLabel>branches</SelectLabel>
                          {branches.length === 0 && (
                            <span>No branch found</span>
                          )}
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
            <div className="flex items-center gap-2">
              <Label htmlFor="campus" className="w-32">
                Campus
              </Label>
              <div className="flex flex-col gap-2 w-full">
                <Controller
                  name="campus"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                              : campuses.length < 1
                              ? "No campus found"
                              : "Select a campus"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                          <SelectLabel>campuses</SelectLabel>
                          {campuses.length === 0 && (
                            <span>No campus found</span>
                          )}
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
            <div className="flex items-center gap-2">
              <Label htmlFor="department" className="w-32">
                Department
              </Label>
              <div className="flex flex-col gap-2 w-full">
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
                        departments.length < 1
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            isDepartmentLoading
                              ? "Loading departments"
                              : departments.length < 1
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
                              <SelectItem
                                key={index}
                                value={`${department.id}`}
                              >
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
            <div className="flex items-center gap-2">
              <Label htmlFor="grade" className="w-32">
                Grade
              </Label>
              <div className="flex flex-col gap-2 w-full">
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
                        grades.length < 1
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            isGradeLoading
                              ? "Loading grades"
                              : grades.length < 1
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
          </div>
          <div className="w-full flex justify-end mt-8">
            <Button disabled={isLoading || isSubmitting} type="submit">
              {isLoading ||
                (isSubmitting && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ))}
              Add filter
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default GradeFilterComponent;
