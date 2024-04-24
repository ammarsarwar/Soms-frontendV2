"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { School, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { Controller } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { getBranches } from "@/server/branch/actions";
import { getSelectedGradeByYear } from "@/server/grade/actions";
import { getSelectedCam } from "@/server/campus/actions";
import { getSelectedDept } from "@/server/department/actions";
import { postSection } from "@/server/section/actions";
import { useStore } from "@/GlobalStore/gradeStore";
import { toast } from "sonner";
import {
  Branch,
  Campus,
  Department,
  Grade,
  TSchoolYearSchema,
} from "@/schemas";
import { getAcademicYears } from "@/server/school-calender-server/academicyear/actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
interface IFormSchema {
  branchName: string;
  campusName: string;
  deptName: string;
  gradeName: string;
  secName: string;
  noOfStudents: null;
  yearName: number | null;
}
interface SectionCreationProps {
  selectedGrade: Grade | null;
  setSelectedGrade: (grade: Grade | null) => void;
}
const SectionCreation: React.FC<SectionCreationProps> = ({
  selectedGrade,
  setSelectedGrade,
}) => {
  const [academicYear, setAcademicYear] = useState<TSchoolYearSchema[]>([]);
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<TSchoolYearSchema | null>(null);
  const [academicFetched, setAcademicFetched] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [campus, setCampus] = useState<Campus[]>([]);
  const [department, setDepartment] = useState<Department[]>([]);
  const [grade, setGrade] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  //   const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const form = useForm<IFormSchema>({
    defaultValues: {
      branchName: "",
      campusName: "",
      deptName: "",
      gradeName: "",
      secName: "",
      yearName: null,
      noOfStudents: null,
    },
    mode: "onChange",
  });

  const fetchAcademicyear = async () => {
    setLoading(true);
    try {
      const fetchedAcademicyears = await getAcademicYears();
      setAcademicYear(fetchedAcademicyears);
      console.log("Fetched academic years", fetchedAcademicyears);
      setError(null);
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to fetch Academic years");
    } finally {
      setLoading(false);
    }
  };

  const handleAcademicYearChange = (yearName: string) => {
    const year =
      academicYear.find((y) => `${y.start_year}-${y.end_year}` === yearName) ||
      null;
    console.log("I have selected year:", year?.id);
    setSelectedAcademicYear(year);
  };

  const handleAcademicSelect = () => {
    if (!academicFetched) {
      fetchAcademicyear();
      setAcademicFetched(true);
    }
  };

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const fetchedBranches = await getBranches();
      setBranches(fetchedBranches);
      console.log("fetchedBranches", fetchedBranches);
      setError(null); // Reset error on successful fetch
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFocus = () => {
    if (!hasFetched) {
      fetchBranches();
      setHasFetched(true);
    }
  };

  const handleBranchChange = async (branchName: any) => {
    const branch = branches.find((b) => b.name === branchName) || null;
    console.log("Selected branch:", branch);
    setSelectedBranch(branch);
    form.setValue("campusName", "");
    if (branch) {
      console.log("this is branch id", branch.id);
      try {
        const campuses = await getSelectedCam(branch.id);
        console.log("Fetched campuses:", campuses);
        setCampus(campuses || []);
      } catch (error) {
        console.error("Error fetching campuses:", error);
      }
    } else {
      setCampus([]);
    }
  };
  const handleCampusChange = async (campusName: any) => {
    const selected = campus.find((c: any) => c.name === campusName) || null;
    setSelectedCampus(selected);
    if (selected) {
      console.log("Selected campus ID:", selected.id);
      try {
        const departments = await getSelectedDept(selected.id);
        console.log("Fetched departments:", departments);
        setDepartment(departments || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    } else {
      setDepartment([]);
    }
  };

  const handleDeptChange = async (deptName: any) => {
    const selected = department.find((d: any) => d.name === deptName) || null;
    setSelectedDepartment(selected);
    // if (selected) {
    //   console.log("Selected dept ID:", selected.id);
    //   try {
    //     const grades = await getSelectedGradeByYear(
    //       selected.id,
    //       selectedAcademicYear?.id
    //     );
    //     console.log("Fetched grades:", grades);
    //     setGrade(grades || []);
    //   } catch (error) {
    //     console.error("Error fetching grades:", error);
    //   }
    // } else {
    //   setGrade([]);
    // }
  };

  useEffect(() => {
    const fetchGrades = async () => {
      if (selectedDepartment && selectedAcademicYear) {
        try {
          const grades = await getSelectedGradeByYear(
            selectedDepartment?.id,
            selectedAcademicYear?.id
          );
          console.log(
            "Fetched grades based on department and academic year:",
            grades
          );
          setGrade(grades || []);
        } catch (error) {
          console.error("Error fetching grades:", error);
        }
      } else {
        setGrade([]);
      }
    };

    fetchGrades();
  }, [selectedDepartment, selectedAcademicYear]);
  const handleGradeChange = (gradeName: any) => {
    const selected = grade.find((g: any) => g.name === gradeName) || null;
    setSelectedGrade(selected);

    if (selected) {
      console.log("this is Selected grade ID:", selectedGrade?.id);
    }
  };

  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const onSubmit = async (values: any) => {
    console.log(values);

    const refinedData = {
      grade: selectedGrade?.id,
      max_no_of_student: Number(values.noOfStudents),
      name: values.secName,
    };
    console.log("payload", refinedData);
    const res = await postSection(refinedData);
    try {
        if (res.error) {
          toast.error(`Error: ${res.error}`);
        } else {
          toast.success(res.success);
          useStore.getState().triggerFetch();
          form.reset({
            ...values,
            secName: "",
            noOfStudents: null,
          });
        }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex w-full border border-dashed border-primary p-2 rounded-md gap-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-row gap-6">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={selectedGrade ? "secondary" : "outline"}
                  className={cn(
                    "w-[300px] border-dashed border-primary flex justify-start items-center gap-2 font-normal truncate ...",
                    !selectedGrade && "text-muted-foreground"
                  )}
                >
                  {selectedGrade ? (
                    <Pencil height={15} width={15} />
                  ) : (
                    <School height={15} width={15} />
                  )}
                  {selectedGrade ? (
                    <p>{selectedGrade.name}</p>
                  ) : (
                    <p>Select a grade</p>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px]">
                <div className="grid grid-cols-1 gap-5 mt-8">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="branchName" className="w-32">
                      Branch
                    </Label>
                    <div className="flex flex-col gap-2 w-full">
                      <Controller
                        name="branchName"
                        control={control}
                        rules={{ required: "Branch selection is required" }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <Select
                            value={value}
                            onValueChange={(val) => {
                              onChange(val);
                              handleBranchChange(val);
                            }}
                            onOpenChange={handleSelectFocus}
                            disabled={loading}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  loading ? "Loading..." : "Select a branch"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                                <SelectLabel>Branch</SelectLabel>
                                {branches.map((branch) => (
                                  <SelectItem
                                    key={branch.id}
                                    value={branch.name}
                                  >
                                    {branch.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.branchName && (
                        <small className="text-red-500 font-bold">
                          {errors.branchName.message}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="campusName" className="w-32">
                      Campus
                    </Label>
                    <div className="flex flex-col gap-2 w-full">
                      {" "}
                      <Controller
                        name="campusName"
                        control={control}
                        rules={{ required: "Campus selection is required" }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <Select
                            value={value}
                            onValueChange={(val) => {
                              onChange(val);
                              handleCampusChange(val);
                            }}
                            disabled={!selectedBranch || campus.length === 0}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a campus" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                                <SelectLabel>Campus</SelectLabel>
                                {campus.filter(
                                  (c) =>
                                    c.branch &&
                                    c.branch.id === selectedBranch?.id
                                ).length > 0 ? (
                                  campus
                                    .filter(
                                      (c) =>
                                        c.branch &&
                                        c.branch.id === selectedBranch?.id
                                    )
                                    .map((filteredCampus) => (
                                      <>
                                        <SelectItem
                                          key={filteredCampus.id}
                                          value={filteredCampus.name}
                                        >
                                          {filteredCampus.name}
                                        </SelectItem>
                                      </>
                                    ))
                                ) : (
                                  <SelectLabel>
                                    This branch does not have any campus, please
                                    create a campus first
                                  </SelectLabel>
                                )}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.campusName && (
                        <small className="text-red-500 font-bold">
                          {errors.campusName.message}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="deptName" className="w-32">
                      Department
                    </Label>
                    <div className="flex flex-col gap-2 w-full">
                      <Controller
                        name="deptName"
                        control={control}
                        rules={{ required: "Department selection is required" }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <Select
                            value={value}
                            onValueChange={(val) => {
                              onChange(val);
                              handleDeptChange(val);
                            }}
                            disabled={
                              !selectedCampus || department.length === 0
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                                <SelectLabel>Department</SelectLabel>
                                {department.filter(
                                  (d) =>
                                    d.campus &&
                                    d.campus.id === selectedCampus?.id
                                ).length > 0 ? (
                                  department
                                    .filter(
                                      (d) =>
                                        d.campus &&
                                        d.campus.id === selectedCampus?.id
                                    )
                                    .map((filtereddepartment) => (
                                      <>
                                        <SelectItem
                                          key={filtereddepartment.id}
                                          value={filtereddepartment.name}
                                        >
                                          {filtereddepartment.name}
                                        </SelectItem>
                                      </>
                                    ))
                                ) : (
                                  <SelectLabel>
                                    This campus does not have any department,
                                    please create a department first
                                  </SelectLabel>
                                )}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />

                      {errors.deptName && (
                        <small className="text-red-500 font-bold">
                          {errors.deptName.message}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="yearName" className="w-32">
                      Academic year
                    </Label>
                    <div className="flex flex-col gap-2 w-full">
                      <Controller
                        name="yearName"
                        control={control}
                        rules={{ required: "Year selection is required" }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <Select
                            value={value ? value.toString() : ""}
                            onValueChange={(val) => {
                              onChange(val);
                              handleAcademicYearChange(val);
                            }}
                            onOpenChange={handleAcademicSelect}
                            disabled={!selectedDepartment}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                                <SelectLabel>Years</SelectLabel>
                                {academicYear.map((year) => (
                                  <SelectItem
                                    key={year.id}
                                    value={`${year.start_year}-${year.end_year}`}
                                  >
                                    {`${year.start_year} - ${year.end_year}`}{" "}
                                    {year.status}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />

                      {errors.yearName && (
                        <small className="text-red-500 font-bold">
                          {errors.yearName.message}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="gradeName" className="w-32">
                      Grade
                    </Label>
                    <div className="flex flex-col gap-2 w-full">
                      <Controller
                        name="gradeName"
                        control={control}
                        rules={{ required: "Grade selection is required" }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <Select
                            value={value}
                            onValueChange={(val) => {
                              onChange(val);
                              handleGradeChange(val);
                            }}
                            disabled={!selectedAcademicYear}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a grade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                                <SelectLabel>Grade</SelectLabel>
                                {grade.length > 0 ? (
                                  grade.map((filteredGrade) => (
                                    <SelectItem
                                      key={filteredGrade.id}
                                      value={filteredGrade.name}
                                    >
                                      {filteredGrade.name}
                                    </SelectItem>
                                  ))
                                ) : !selectedDepartment ? (
                                  <SelectLabel>
                                    Please select a department first.
                                  </SelectLabel>
                                ) : !selectedAcademicYear ? (
                                  <SelectLabel>
                                    Please select an academic year first.
                                  </SelectLabel>
                                ) : (
                                  <SelectLabel>
                                    {`There is no grade associated with the selected academic year, please create a grade in Academic year:${selectedAcademicYear.start_year}-${selectedAcademicYear.end_year} first, in order to create or view its sections.`}
                                  </SelectLabel>
                                )}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />

                      {errors.gradeName && (
                        <small className="text-red-500 font-bold">
                          {errors.gradeName.message}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <div className="grid gap-3">
              <div className="flex flex-col gap-2">
                <Input
                  id="secName"
                  placeholder="Enter new section name"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  {...register("secName", {
                    required: {
                      value: true,
                      message: "Section name is required",
                    },
                  })}
                  disabled={isLoading || isSubmitting || !selectedGrade}
                  className="w-[300px]"
                />

                {errors.secName && (
                  <small className="text-red-500 font-bold">
                    {errors.secName?.message}
                  </small>
                )}
              </div>
            </div>
            <div className="grid gap-3">
              <div className="flex flex-col gap-2">
                <Input
                  id="noOfStudents"
                  placeholder="Enter number of students"
                  type="number"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  {...register("noOfStudents", {
                    required: {
                      value: true,
                      message: "Number of students level is required",
                    },
                  })}
                  className="w-[300px]"
                  disabled={isLoading || isSubmitting || !selectedGrade}
                />

                {errors.secName && (
                  <small className="text-red-500 font-bold">
                    {errors.secName?.message}
                  </small>
                )}
              </div>
            </div>

            <Button
              disabled={isLoading || isSubmitting || !selectedGrade}
              type="submit"
            >
              {isLoading ||
                (isSubmitting && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ))}
              Create
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SectionCreation;
