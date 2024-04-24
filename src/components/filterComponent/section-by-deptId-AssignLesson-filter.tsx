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
import {
  getGenericLessonsByGrade,
  getSelectedLessonsBySection,
} from "@/server/lessonManagement/lesson/action";
import {
  Branch,
  Campus,
  Department,
  Grade,
  Section,
  TAssignedLessonsSchema,
  TLessonSchema,
} from "@/schemas";

interface SectionFilterComponentProps {
  selectedDepartment: Department | null;
  selectedSection: Section | null;
  setSelectedSection: React.Dispatch<React.SetStateAction<Section | null>>;
  setAssignedLessons: React.Dispatch<
    React.SetStateAction<TAssignedLessonsSchema[]>
  >;
  isAssignedLessonLoading: boolean;
  setIsAssignedLessonLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ISelectSectionSchema {
  grade: string;
  section: string;
}

const SectionByDeptIdAssignLessonFilterComponent: React.FC<
  SectionFilterComponentProps
> = ({
  selectedDepartment,
  selectedSection,
  setSelectedSection,
  setIsAssignedLessonLoading,
  setAssignedLessons,
}) => {
  // states
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isGradeLoading, setIsGradeLoading] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [isSectionLoading, setIsSectionLoading] = useState(false);
  const [open, setOpen] = useState(false);
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
  const gradeId = watch("grade");
  const sectionId = watch("section");

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

  //fetch sections when we have the teachers
  useEffect(() => {
    if (!isMounted.current && grades.length > 0 && getValues("grade") != "") {
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
      grades.length > 0 &&
      sections.length > 0 &&
      getValues("section") != ""
    ) {
      const listOfLessons = async () => {
        try {
          setIsAssignedLessonLoading(true);
          const res = await getSelectedLessonsBySection(Number(sectionId));
          console.log(res);
          setAssignedLessons(res);
          setIsAssignedLessonLoading(false);
        } catch (error) {
          console.error("error", error);
          alert("error fetching lessons");
          setIsAssignedLessonLoading(false);
        } finally {
          setIsAssignedLessonLoading(false);
        }
      };

      listOfLessons();
    }
    isMounted.current = false;
  }, [sectionId]);

  function getSectionBySectionId(sectionArray: Section[], sectionId: string) {
    const result = sectionArray.find(
      (section) => section.id === Number(sectionId)
    );
    return result || null;
  }

  const onSubmit = async (values: ISelectSectionSchema) => {
    setOpen(false);
    const result = getSectionBySectionId(sections, values.section);
    setSelectedSection(result);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
            <p>Select Section</p>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px]">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-2">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filter Section</h4>
            {/* <p className="text-sm text-muted-foreground">
              Please select a section for attendence
            </p> */}
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

export default SectionByDeptIdAssignLessonFilterComponent;
