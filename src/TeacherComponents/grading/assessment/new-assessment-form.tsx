"use client";

import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { postAssessment } from "@/serverAcademics/grading/assessment/action";

interface IAssessmentSchema {
  course: number;
  name: string;
  total_marks: string;
  weightage: string;
  description: string;
}

const NewAssessmentForm = ({ course }: { course: number | undefined }) => {
  const [isYearLoading, setIsYearLoading] = useState(false);
  const assessmentRef = useRef<HTMLFormElement>();

  //fetch years

  const form = useForm<IAssessmentSchema>({
    mode: "onChange",
  });

  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const onSubmit = async (values: IAssessmentSchema) => {
    const refinedData = {
      ...values,
      course,
      total_marks: Number(values.total_marks),
      weightage: Number(values.weightage),
    };
    const res = await postAssessment(refinedData);
    if (res === undefined) {
      toast.error("error creating a new assessment");
    } else {
      toast.success("New assessment has been created");
    }
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-8 mt-8 mb-8 ">
        <div className="grid gap-3">
          <Label htmlFor="name">Assessment Name</Label>
          <div className="flex flex-col gap-2">
            <Input
              id="name"
              placeholder="Enter assessment name"
              type="text"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              {...register("name")}
              disabled={isLoading || isSubmitting}
            />
            {errors.name && (
              <small className="text-red-500 font-bold">
                {errors.name?.message}
              </small>
            )}
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="marks">Assessment marks</Label>
          <div className="flex flex-col gap-2">
            <Input
              id="name"
              placeholder="Enter assessment marks"
              type="number"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              {...register("total_marks")}
              disabled={isLoading || isSubmitting}
            />
            {errors.total_marks && (
              <small className="text-red-500 font-bold">
                {errors.total_marks?.message}
              </small>
            )}
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="weightage">Weightage</Label>
          <div className="flex flex-col gap-2">
            <Input
              id="name"
              placeholder="Enter assessment weightage"
              type="number"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              {...register("weightage")}
              disabled={isLoading || isSubmitting}
            />
            {errors.weightage && (
              <small className="text-red-500 font-bold">
                {errors.weightage?.message}
              </small>
            )}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <Button
          disabled={isLoading || isSubmitting}
          type="submit"
          onClick={() => {
            if (assessmentRef.current) {
              assessmentRef.current.dispatchEvent(
                new Event("submit", { bubbles: true })
              );
            }
          }}
        >
          {isLoading ||
            (isSubmitting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ))}
          Create
        </Button>
      </div>
    </form>
  );
};

export default NewAssessmentForm;
