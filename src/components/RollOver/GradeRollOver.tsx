"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { getSelectedCam } from "@/server/campus/actions";
import { getCampus } from "@/server/campus/actions";

import { getBranches } from "@/server/branch/actions";

import { postDept } from "@/server/department/actions";

import { getSelectedGradeByYearCampus } from "@/server/grade/actions";
import { Branch, Campus, Grade, TSchoolYearSchema } from "@/schemas/index";
import { getAcademicYears } from "@/server/school-calender-server/academicyear/actions";
import { gradeRollOver } from "@/server/roll_over/grade-roll_over/actions";
interface IFormSchema {
  branchName: string;
  campusName: string;
  gradeName: string;
  yearName: number | null;
  toYearName: number | null;
}

const GradeRollOver = ({}) => {
  // State to hold selected grade IDs
  const [selectedGradeIds, setSelectedGradeIds] = useState<number[]>([]);

  const [branches, setBranches] = useState<Branch[]>([]);
  const [grade, setGrade] = useState<Grade[]>([]);
  const [campus, setCampus] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);

  const [academicYear, setAcademicYear] = useState<TSchoolYearSchema[]>([]);
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<TSchoolYearSchema | null>(null);
  const [academicFetched, setAcademicFetched] = useState(false);
  const [toAcademicYear, setToAcademicYear] =
    useState<TSchoolYearSchema | null>(null);

  const form = useForm<IFormSchema>({
    defaultValues: {
      branchName: "",
      campusName: "",
      gradeName: "",
      yearName: null,
      toYearName: null,
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
    setToAcademicYear(null);
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
  };
  useEffect(() => {
    const fetchGrades = async () => {
      if (selectedCampus && selectedAcademicYear) {
        setLoading(true);
        try {
          const grades = await getSelectedGradeByYearCampus(
            selectedCampus?.id,
            selectedAcademicYear?.id
          );
          console.log(
            "Fetched grades based on department and academic year:",
            grades
          );
          setGrade(grades || []);
        } catch (error) {
          console.error("Error fetching grades:", error);
        } finally {
          setLoading(false); // End loading
        }
      } else {
        setGrade([]); // Reset grades if either selection is missing
      }
    };

    fetchGrades();
  }, [selectedCampus, selectedAcademicYear]);

  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const onSubmit = async (values: any) => {
    const payload = {
      grades: selectedGradeIds,

      to_academic_year: toAcademicYear?.id,
    };
    console.log("this is payload", payload);

    try {
      const res = await gradeRollOver(payload);
      if (res === undefined) {
        alert("error Rolling over the grades");
      } else {
        alert(
          `Grade has been successfully rolled over to${toAcademicYear?.start_year} - ${toAcademicYear?.end_year}`
        );
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <Separator />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" flex justify-center">
          <div className="flex flex-col gap-8 p-5 w-[800px]">
            <div className="grid gap-3">
              <Label htmlFor="branchName">Select branch</Label>
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
                        placeholder={loading ? "Loading..." : "Select a branch"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                        <SelectLabel>Branch</SelectLabel>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.name}>
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
            <div className="grid gap-3">
              <Label htmlFor="campusName">Select campus</Label>

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
                          (c) => c.branch && c.branch.id === selectedBranch?.id
                        ).length > 0 ? (
                          campus
                            .filter(
                              (c) =>
                                c.branch && c.branch.id === selectedBranch?.id
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
                            This branch does not have any campus, please create
                            a campus first
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
            <div className="grid gap-3">
              <Label htmlFor="yearName" className="w-40">
                From Academic year
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
                      disabled={!selectedCampus}
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
            <div className="grid gap-3">
              <Label>Select Grade(s)</Label>
              <div className="flex flex-wrap gap-2">
                {loading ? (
                  <p>Loading grades...</p>
                ) : !selectedAcademicYear ? (
                  <p>Please select an academic year to view grades.</p>
                ) : !selectedCampus ? (
                  <p>Select a campus first to view grades.</p>
                ) : grade.length > 0 ? (
                  grade.map((filteredGrade) => (
                    <div
                      key={filteredGrade.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`grade-${filteredGrade.id}`}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedGradeIds((prevIds) => [
                              ...prevIds,
                              filteredGrade.id,
                            ]);
                          } else {
                            setSelectedGradeIds((prevIds) =>
                              prevIds.filter((id) => id !== filteredGrade.id)
                            );
                          }
                        }}
                        checked={selectedGradeIds.includes(filteredGrade.id)}
                      />
                      <label
                        htmlFor={`grade-${filteredGrade.id}`}
                        className="text-sm font-medium leading-none"
                      >
                        {filteredGrade.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p>
                    There are no grades currently associated with the selected
                    academic year and campus.
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="toYearName" className="w-40">
                To Academic Year
              </Label>
              <div className="flex flex-col gap-2 w-full">
                <Controller
                  name="toYearName"
                  control={control}
                  rules={{ required: "To Academic Year selection is required" }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Select
                      value={value ? value.toString() : ""}
                      onValueChange={(val) => {
                        onChange(val);
                        const toYear =
                          academicYear.find(
                            (y) => `${y.start_year}-${y.end_year}` === val
                          ) || null;
                        setToAcademicYear(toYear);
                      }}
                      disabled={!selectedAcademicYear}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                          <SelectLabel>Years</SelectLabel>
                          {academicYear
                            .filter((y) => y.id !== selectedAcademicYear?.id)
                            .map((year) => (
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
                {errors.toYearName && (
                  <small className="text-red-500 font-bold">
                    {errors.toYearName?.message}
                  </small>
                )}
              </div>
            </div>

            <div className="mt-5">
              <Button disabled={isLoading || isSubmitting} type="submit">
                {isLoading ||
                  (isSubmitting && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ))}
                Roll over
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default GradeRollOver;
