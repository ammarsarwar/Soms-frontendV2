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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { Section } from "./data/schema";
import { updateSection } from "@/server/section/actions";
import { getSelectedDept } from "@/server/department/actions";
import { Department } from "../departmentSetup/data/schema";
interface DataTableRowActionsProps {
  row: Row<Section>;
}
interface IFormSchema {
  name: string;
  sectionID: number;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  console.log(row.original);
  // const task = branchSchema.parse(row.original);
  const section = row.original as Section;

  const form = useForm<IFormSchema>({
    defaultValues: {
      name: section.name,
      sectionID: section.id,
    },
    mode: "onChange",
  });

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
    };
    // console.log("refinedData", refinedData);
    const { sectionID, ...updatedValues } = refinedData;

    console.log("Payload for update:", refinedData);

    const res = await updateSection(sectionID, refinedData);
    if (res === undefined) {
      alert("Error updating the section");
    } else {
      alert("Your section has been updated");
    }
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
                    {section.grade?.department?.campus?.branch?.name}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Campus Name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {section.grade?.department?.campus?.name}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Department name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {section.grade?.department?.name}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Grade name</p>
                  <p className="text-sm text-muted-foreground">
                    {section.grade?.name}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Section name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {section.name}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Number of students{" "}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {section.number_of_students}
                  </p>
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
              <DialogTitle>Edit Department</DialogTitle>
              <DialogDescription>
                Update the department information here.
              </DialogDescription>
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
                        value={section.grade?.department?.campus?.branch?.name}
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
                        value={section.grade?.department?.campus?.name}
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
                        value={section.grade?.department?.name}
                        disabled
                        id="deptName"
                      />
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Grade Name
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <Input
                        value={section.grade?.name}
                        disabled
                        id="deptName"
                      />
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="name">Section Name</Label>
                  <Input id="name" {...register("name")} />
                </div>
                <div className="grid gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Number of students
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <Input
                        value={section.number_of_students}
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
