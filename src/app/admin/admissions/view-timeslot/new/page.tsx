"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface IFormSchema {
  deptName: string;
  days: string;
  duration: string;
  noOfStudents: number | null;
  location: string;
}

const NewTimeSlotPage = () => {
  const form = useForm<IFormSchema>({
    defaultValues: {
      deptName: "",
      days: "",
      duration: "",
      noOfStudents: null,
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
    // i'm adding the school id mannually for now, we need to change this
    const refinedData = {
      ...values,
      school: 3,
    };
    console.log("ref data:", refinedData);

    reset();
  };
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {" "}
              Create a new time slot
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s you can create new time slot
            </p>
          </div>
        </div>
        <Separator />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className=" flex justify-center">
            <div className="flex flex-col gap-8 p-5 w-[800px]">
              <div className="grid gap-3">
                <Label htmlFor="dept">Select department</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Departments</SelectLabel>
                      <SelectItem value="Kg">Kg</SelectItem>
                      <SelectItem value="Elementary">Elementary</SelectItem>
                      <SelectItem value="Middle">Middle</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="dept">Select one or multiple days</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Monday" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Days</SelectLabel>
                      <SelectItem value="Monday">Monday</SelectItem>
                      <SelectItem value="Tuesday">Tuesday</SelectItem>
                      <SelectItem value="Wednesday">Wednesday</SelectItem>
                      <SelectItem value="Thursday">Thursday</SelectItem>
                      <SelectItem value="Friday">Friday</SelectItem>
                      <SelectItem value="Saturday">Saturday</SelectItem>
                      <SelectItem value="Sunday">Sunday</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewTimeSlotPage;
