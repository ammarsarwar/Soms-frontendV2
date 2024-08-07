"use client";

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
import { toast } from "sonner";
import { postDept } from "@/server/department/actions";
import { Branch, Campus } from "@/schemas";
import { useRef, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
interface IFormSchema {
  branchName: string;
  campusName: string;
  deptName: string;
  departmentType: string;
}

const NewDept = ({}) => {
  const [isPending, startTransition] = useTransition();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [campus, setCampus] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);

  const form = useForm<IFormSchema>({
    defaultValues: {
      branchName: "",
      campusName: "",
      deptName: "",
      departmentType: "",
    },
    mode: "onChange",
  });

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
  const handleCampusChange = (campusName: any) => {
    const selected = campus.find((c: any) => c.name === campusName) || null;
    setSelectedCampus(selected);
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

  //   const onSubmit = async (values: any) => {
  //     console.log(values);
  //     const refinedData = {
  //       campus: selectedCampus?.id,
  //       name: values.deptName,
  //       department_type: values.departmentType,
  //     };
  //     console.log("refined data", refinedData);
  //    try{
  //  const res = await postDept(refinedData);
  //  if (res) {
  //    toast.error("New Department Created");
  //  } else {
  //    toast("Error creating new department");
  //  }
  //    }catch(error:any)
  //    {

  //    }
  //   };

  const onSubmit = (values: IFormSchema) => {
    const refinedData = {
      campus: selectedCampus?.id,
      name: values.deptName,
      department_type: values.departmentType,
    };
    console.log("refined data", refinedData);
    startTransition(() => {
      postDept(refinedData).then((data) => {
        if (data.success) {
          toast.success(data.success);

          reset();
        } else {
          toast.error(data.error);
        }
      });
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"default"}>Add New</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] max-h-[600px] overflow-scroll no-scrollbar">
        <DialogHeader>
          <DialogTitle> Create Department</DialogTitle>
        </DialogHeader>
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
                <Label htmlFor="departmentType">
                  Department Academic Level
                </Label>
                <Controller
                  name="departmentType"
                  control={control}
                  rules={{ required: "Department type is required" }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Academic Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                          {["KG", "Primary", "Middle", "High"].map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.departmentType && (
                  <small className="text-red-500 font-bold">
                    {errors.departmentType.message}
                  </small>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="deptName">Department Name</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    id="deptName"
                    placeholder="Enter your Department name"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    {...register("deptName", {
                      required: {
                        value: true,
                        message: "Department name is required",
                      },
                      pattern: {
                        value: /^[A-Za-z 0-9]+$/,
                        message: "Only alphabets and numbers are allowed",
                      },
                    })}
                    disabled={isLoading || isSubmitting}
                  />

                  {errors.deptName && (
                    <small className="text-red-500 font-bold">
                      {errors.deptName?.message}
                    </small>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <Button
                  disabled={isLoading || isSubmitting || isPending}
                  type="submit"
                >
                  {isLoading ||
                    (isPending && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ))}
                  Create
                </Button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewDept;
