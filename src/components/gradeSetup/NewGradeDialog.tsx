"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { Controller } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { getBranches } from "@/server/branch/actions";

import { getSelectedCam } from "@/server/campus/actions";
import { getSelectedDept } from "@/server/department/actions";
import { postGrade } from "@/server/grade/actions";
import { Branch, Campus, Department, TSchoolYearSchema } from "@/schemas/index";
import { getAcademicYears } from "@/server/school-calender-server/academicyear/actions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
interface IFormSchema {
  branchName: string;
  campusName: string;
  deptName: string;
  level: string;
  yearName: number | null;
}

const NewGradeDialog = ({}) => {
  const [academicYear, setAcademicYear] = useState<TSchoolYearSchema[]>([]);
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<TSchoolYearSchema | null>(null);
  const [academicFetched, setAcademicFetched] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [campus, setCampus] = useState<Campus[]>([]);
  const [department, setDepartment] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const form = useForm<IFormSchema>({
    defaultValues: {
      branchName: "",
      campusName: "",
      deptName: "",
      level: "",
      yearName: null,
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

  const handleDeptChange = (deptName: any) => {
    const selected = department.find((d: any) => d.name === deptName) || null;
    setSelectedDepartment(selected);
    if (selected) {
      console.log("Selected campus ID:", selected.id);
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
      department: selectedDepartment?.id,
      name: values.level,
      academic_year: selectedAcademicYear?.id,
    };
    console.log("payload", refinedData);

    try {
      const result = await postGrade(refinedData);

      if (result.error) {
        toast.error(`Error: ${result.error}`);
      } else {
        toast.success(result.success);
        reset();
      }
    } catch (error) {
      // This catch block is for catching errors in the await call itself, if needed
      toast.error("An unexpected error occurred");
    }
  };

  // const onSubmit = async (values: any) => {
  //   console.log(values);

  //   const refinedData = {
  //     department: selectedDepartment?.id,
  //     name: values.level,
  //     academic_year: selectedAcademicYear?.id,
  //   };
  //   console.log("payload", refinedData);
  //   const res = await postGrade(refinedData);
  //   if (res === undefined) {
  //     alert("error creating a new grade");
  //   } else {
  //     alert("New grade has been created");
  //   }
  //   reset();
  // };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"default"}>Add New</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px] max-h-[600px] overflow-scroll no-scrollbar">
          <DialogHeader>
            <DialogTitle> Create Grade</DialogTitle>
          </DialogHeader>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className=" flex justify-center">
                <div className="flex flex-col gap-8 p-5 w-full">
                  <div className="grid gap-3">
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
                                  c.branch && c.branch.id === selectedBranch?.id
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
                  <div className="grid gap-3">
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
                          disabled={!selectedCampus || department.length === 0}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                              <SelectLabel>Department</SelectLabel>
                              {department.filter(
                                (d) =>
                                  d.campus && d.campus.id === selectedCampus?.id
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
                  <div className="grid gap-3">
                    <Label htmlFor="yearName">Academic Year</Label>
                    <div className="flex flex-col gap-2 w-full">
                      <Controller
                        name="yearName"
                        control={control}
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
                  <div className="grid gap-3">
                    <Label htmlFor="level">Grade Name</Label>
                    <div className="flex flex-col gap-2">
                      <Input
                        id="level"
                        placeholder="Enter your Grade name"
                        type="text"
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect="off"
                        {...register("level", {
                          required: {
                            value: true,
                            message: "Grade level is required",
                          },
                          pattern: {
                            value: /^[A-Za-z0-9 ]+$/,
                            message:
                              "Only alphabets, numbers, and spaces are allowed",
                          },
                        })}
                        disabled={isLoading || isSubmitting}
                      />

                      {errors.level && (
                        <small className="text-red-500 font-bold">
                          {errors.level?.message}
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
                      Create
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewGradeDialog;
