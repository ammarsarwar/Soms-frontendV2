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

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Department } from "../departmentSetup/data/schema";
import { Grade } from "../gradeSetup/data/schema";

import { getDept } from "@/serverAcademics/department/actions";
import { getSelectedGrade } from "@/serverAcademics/grade/actions";
import { getSelectedSection } from "@/serverAcademics/section/actions";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/ui/icons";
import { TSectionNewSchema } from "../attendence/attendence.types";

import { getSelectedLessonsBySection } from "@/serverAcademics/lessonManagement/lesson/action";
import { TAssignedLessonsSchema } from "@/schemas";


interface SectionFilterComponentProps {
  selectedSection: TSectionNewSchema | null;
  setSelectedSection: React.Dispatch<
    React.SetStateAction<TSectionNewSchema | null>
  >;
  setLessons: React.Dispatch<React.SetStateAction<TAssignedLessonsSchema[]>>;
  isLessonLoading: boolean;
  setIsLessonLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ISelectSectionSchema {
  branch: string;
  campus: string;
  department: string;
  grade: string;
  section: string;
}

const SectionFilterComponent: React.FC<SectionFilterComponentProps> = ({
  selectedSection,
  setSelectedSection,
  setIsLessonLoading,
  setLessons,
}) => {
  // states

  const [departments, setDepartments] = useState<Department[]>([]);
  const [isDepartmentLoading, setIsDepartmentLoading] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isGradeLoading, setIsGradeLoading] = useState(false);
  const [sections, setSections] = useState<TSectionNewSchema[]>([]);
  const [isSectionLoading, setIsSectionLoading] = useState(false);
  const isMounted = useRef(true);

  //form
  const form = useForm<ISelectSectionSchema>({
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

  const departmentId = watch("department");
  const gradeId = watch("grade");
  const sectionId = watch("section");

  //fetch branches when we have the user array

  //fetch campuses when we have the branch

  //fetch departments when we have the campus
  useEffect(() => {
    const listOfDepartments = async () => {
      try {
        setIsDepartmentLoading(true);
        const res = await getDept();
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
  }, []);

  //fetch grades when we have the department
  useEffect(() => {
    if (
      !isMounted.current &&
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

  //fetch sections when we have the teachers
  useEffect(() => {
    if (
      !isMounted.current &&
      departments.length > 0 &&
      grades.length > 0 &&
      getValues("grade") != ""
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
  }, [gradeId]);

  //fetch lessons when we have the sectionid
  useEffect(() => {
    if (
      !isMounted.current &&
      departments.length > 0 &&
      grades.length > 0 &&
      sections.length > 0 &&
      getValues("section") != ""
    ) {
      const listOfLessons = async () => {
        try {
          setIsLessonLoading(true);
          const res = await getSelectedLessonsBySection(Number(sectionId));
          console.log(res);
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
  }, [sectionId]);

  function getSectionBySectionId(
    sectionArray: TSectionNewSchema[],
    sectionId: string
  ) {
    const result = sectionArray.find(
      (section) => section.id === Number(sectionId)
    );
    return result || null;
  }

  const onSubmit = async (values: ISelectSectionSchema) => {
    const result = getSectionBySectionId(sections, values.section);
    setSelectedSection(result);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={selectedSection ? "secondary" : "outline"}
          className={cn(
            "w-[200px] border-dashed border-primary flex justify-start items-center gap-2 font-normal truncate ...",
            !selectedSection && "text-muted-foreground"
          )}
        >
          {selectedSection ? (
            <Pencil height={15} width={15} />
          ) : (
            <School height={15} width={15} />
          )}
          {selectedSection ? (
            <p>{selectedSection.name}</p>
          ) : (
            <p>Select section</p>
          )}
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
            <div className="flex items-center gap-2">
              <Label htmlFor="grade" className="w-32">
                Section
              </Label>
              <div className="flex flex-col gap-2 w-full">
                <Controller
                  name="section"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={`${field.value}`}
                      disabled={
                        isLoading ||
                        isSubmitting ||
                        isSectionLoading ||
                        sections.length < 1
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            isSectionLoading
                              ? "Loading sections"
                              : sections.length < 1
                              ? "No section found"
                              : "Select a section"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                          <SelectLabel>Sections</SelectLabel>
                          {sections.length === 0 && (
                            <span>No section found</span>
                          )}
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

export default SectionFilterComponent;
