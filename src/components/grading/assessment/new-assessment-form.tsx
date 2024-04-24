"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { postAssessment } from "@/server/grading/assessment/action";
import { AssessmentFormSchema } from "@/schemas";
import { useAttendenceStore } from "@/GlobalStore/attendenceStore";

const NewAssessmentForm = ({
  grade,
  setOpen,
}: {
  grade: number | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const assessmentRef = useRef<HTMLFormElement>();
  const [isPending, startTransition] = useTransition();

  //zustand logic
  const { setIsAssessmentRefetched } = useAttendenceStore();

  const form = useForm<AssessmentFormSchema>({
    mode: "onChange",
  });

  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const onSubmit = async (values: AssessmentFormSchema) => {
    console.log(values);
    startTransition(() => {
      postAssessment(values, grade).then((data) => {
        if (data.success) {
          toast.success(data.success);
          setOpen(false);
          reset();
          setIsAssessmentRefetched(true);
        } else {
          toast.error(data.error);
        }
      });
    });
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
              disabled={isLoading || isSubmitting || isPending}
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
              disabled={isLoading || isSubmitting || isPending}
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
          disabled={isLoading || isSubmitting || isPending}
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
            isSubmitting ||
            (isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ))}
          Create
        </Button>
      </div>
    </form>
  );
};

export default NewAssessmentForm;