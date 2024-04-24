"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { postIncidents } from "@/server/incidents/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { StudentProfile } from "@/components/student/data/schema";
import StudentSectionFilter from "@/components/incidents/student-section-filter";
import { toast } from "sonner";
import { TTeacherUserSchema } from "@/schemas";
interface IFormSchema {
  studentId: number | null;
  dateTimeOfIncident: string;
  location: string;
  description: string;
  actionsTaken: string;
}

const IncidentSetup = () => {
  const [isStudentConfirmed, setIsStudentConfirmed] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
    null
  );
  const [selectedNurse, setSelectedNurse] = useState<TTeacherUserSchema | null>(
    null
  );

  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting, isLoading, errors },
  } = useForm<IFormSchema>({
    defaultValues: {
      studentId: null,
      dateTimeOfIncident: "",
      location: "",
      description: "",
      actionsTaken: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: IFormSchema) => {
    const refinedData = {
      student: selectedStudent ? selectedStudent.id : null,
      nurse: selectedNurse?.user.id,
      campus: selectedStudent?.campus.id,
      date_time_of_incident: values.dateTimeOfIncident,
      location: values.location,
      description: values.description,
      actions_taken: values.actionsTaken,
    };
    console.log("refinedData", refinedData);
    const res = await postIncidents(refinedData);
    if (res === undefined) {
      toast.error("error creating a new incident");
    } else {
      toast.success("Incident submitted");
    }
  };

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8">
      <h2 className="text-2xl font-bold tracking-tight">Incident Setup</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-8">
          <div className="grid gap-3">
            <div className="flex w-full border border-dashed border-primary p-2 rounded-md gap-3">
              <div className="hidden space-x-3 lg:flex">
                <StudentSectionFilter
                  setSelectedStudent={setSelectedStudent}
                  setSelectedNurse={setSelectedNurse} // Pass this function to update the parent's state
                />
              </div>
            </div>
          </div>
          {isStudentConfirmed && (
            <>
              <div className="grid gap-3">
                <Label htmlFor="dateTimeOfIncident">
                  Date & Time of Incident
                </Label>
                <Input
                  id="dateTimeOfIncident"
                  type="datetime-local"
                  {...register("dateTimeOfIncident", {
                    required: "Date and time of incident are required",
                  })}
                />
                {errors.dateTimeOfIncident && (
                  <small className="text-red-500 font-bold">
                    {errors.dateTimeOfIncident.message}
                  </small>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Incident location"
                  {...register("location", {
                    required: "Location is required",
                  })}
                />
                {errors.location && (
                  <small className="text-red-500 font-bold">
                    {errors.location.message}
                  </small>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Describe the incident"
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
                {errors.description && (
                  <small className="text-red-500 font-bold">
                    {errors.description.message}
                  </small>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="actionsTaken">Actions Taken</Label>
                <Input
                  id="actionsTaken"
                  placeholder="Actions taken in response"
                  {...register("actionsTaken", {
                    required: "Actions taken are required",
                  })}
                />
                {errors.actionsTaken && (
                  <small className="text-red-500 font-bold">
                    {errors.actionsTaken.message}
                  </small>
                )}
              </div>

              <div className="mt-5">
                <Button disabled={isLoading || isSubmitting} type="submit">
                  {isLoading || isSubmitting ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default IncidentSetup;
