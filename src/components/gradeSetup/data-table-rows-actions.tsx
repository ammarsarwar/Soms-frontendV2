"use client";
import { useState } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Controller } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Icons } from "../ui/icons";
import { updateGrade } from "@/server/grade/actions";
import { getSelectedDept } from "@/server/department/actions";
import { Department, Grade } from "@/schemas";

interface DataTableRowActionsProps {
  row: Row<Grade>;
}
interface IFormSchema {
  name: string;
  gradeID: number;
  department: number;
  deptName: string;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<number>();
  const [department, setDepartment] = useState<Department[]>([]);
  console.log(row.original);
  // const task = branchSchema.parse(row.original);
  const grade = row.original as Grade;

  const form = useForm<IFormSchema>({
    defaultValues: {
      name: grade.name,
      gradeID: grade.id,
      department: grade.department?.id,
      deptName: grade.department?.name,
    },
    mode: "onChange",
  });
  const fetchdept = async () => {
    if (grade.department?.campus?.branch?.id) {
      try {
        const campuses = await getSelectedDept(grade.department?.campus?.id);
        setDepartment(campuses || []);
      } catch (error) {
        console.error("Error fetching campuses:", error);
      }
    }
  };
  const handleDeptChange = (deptName: any) => {
    const selected = department.find((d: any) => d.name === deptName);
    setSelectedDepartment(selected?.id);
    if (selected) {
      console.log("Selected department ID:", selected.id);
    }
  };
  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const onSubmit = async (values: IFormSchema) => {
    console.log("values", values);
    const refinedData = {
      ...values,
      department: selectedDepartment,
    };
    console.log("refinedData", refinedData);
    const { gradeID, ...updatedValues } = refinedData;

    console.log("Payload for update:", refinedData);

    const res = await updateGrade(gradeID, refinedData);
    if (res === undefined) {
      alert("Error updating the grade");
    } else {
      alert("Your grade has been updated");
    }
    // toast({
    //   title: "Department updated",
    //   description: "Department information has been updated.",
    // });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <Dialog>
          <DialogTrigger asChild>
            <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start">
              View
            </p>
          </DialogTrigger>
          <DialogContent className="max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Grade Details</DialogTitle>
              <DialogDescription>
                View grade information below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Branch Name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {grade.department?.campus?.branch?.name}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Campus Name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {grade.department?.campus?.name}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Department Name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {grade.department?.name}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Grade Name</p>
                  <p className="text-sm text-muted-foreground">{grade.name}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <DropdownMenuSeparator />
        <Dialog>
          <DialogTrigger asChild>
            <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start">
              Edit
            </p>
          </DialogTrigger>
          <DialogContent className="max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Grade Name</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-8">
                <div className="grid gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Branch Name
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <Input
                        value={grade.department?.campus?.branch?.name}
                        disabled
                        id="branchName"
                      />
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Campus Name
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <Input
                        value={grade.department?.campus?.name}
                        disabled
                        id="campusName"
                      />
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Department Name
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <Input
                        value={grade.department?.name}
                        disabled
                        id="deptName"
                      />
                    </p>
                  </div>
                </div>
                {/* <div className="grid gap-3">
                  <Label htmlFor="deptName">
                    Select Department you want to add grade in
                  </Label> */}
                {/* <Controller
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
                                    <SelectLabel>Department</SelectLabel>
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
                                This campus does not have any department, please
                                create a department first
                              </SelectLabel>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  /> */}

                {/* <Controller
                    name="deptName"
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
                          handleDeptChange(val);
                        }}
                        onOpenChange={fetchdept} // Fetch campuses when the select is focused/opened
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a campus" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                            <SelectLabel>Department</SelectLabel>
                            {department.length > 0 ? (
                              department.map((filteredCampus) => (
                                <SelectItem
                                  key={filteredCampus.id}
                                  value={filteredCampus.name}
                                >
                                  {filteredCampus.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectLabel>
                                No Department available for this campus.
                              </SelectLabel>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  /> */}

                {/* {errors.deptName && (
                    <small className="text-red-500 font-bold">
                      {errors.deptName.message}
                    </small>
                  )}
                </div> */}
                <div className="grid gap-3">
                  <Label htmlFor="name">Grade Name</Label>
                  <Input id="name" {...register("name")} />
                </div>
              </div>
              <div className="mt-10">
                <Button disabled={isLoading || isSubmitting} type="submit">
                  {isLoading ||
                    (isSubmitting && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ))}
                  Update
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
