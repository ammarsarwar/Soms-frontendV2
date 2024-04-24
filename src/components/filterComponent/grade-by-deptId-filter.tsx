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
  selectedDepartment: Department | null;
}

interface ISelectGradeSchema {
  grade: string;
}

const GradeByDeptIdFilterComponent: React.FC<SectionFilterComponentProps> = ({
  selectedDepartment,
  selectedGrade,
  setSelectedGrade,
}) => {
  // states
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isGradeLoading, setIsGradeLoading] = useState(false);
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

  //fetch grades when we have the department
  useEffect(() => {
    const listOfGrades = async () => {
      try {
        setIsGradeLoading(true);
        // console.log("deptId", departmentId);
        const res = await getSelectedGrade(Number(selectedDepartment?.id));
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
  }, [selectedDepartment]);

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
          {selectedGrade ? <p>{selectedGrade.name}</p> : <p>Select grade</p>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px]">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-2">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filter grade</h4>
            <p className="text-sm text-muted-foreground">
              Please select a grade for assessment
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 mt-8">
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

export default GradeByDeptIdFilterComponent;
