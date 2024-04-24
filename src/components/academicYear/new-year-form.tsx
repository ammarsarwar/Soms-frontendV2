"use client";

import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { postAcademicYears } from "@/server/school-calender-server/academicyear/actions";
import { toast } from "sonner";
import { useRef, useTransition, useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SchoolYearFormSchema } from "@/schemas";

const NewYearForm = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>();
  const [selectedStartYear, setSelectedStartYear] = useState<number | null>(
    null
  );

  const form = useForm<SchoolYearFormSchema>({
    mode: "onChange",
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  // console.log(errors);
  useEffect(() => {
    // Automatically set end year based on start year
    if (selectedStartYear) {
      form.setValue("end_year", (selectedStartYear + 1).toString());
    }
  }, [selectedStartYear, form]);
  const onSubmit = (values: SchoolYearFormSchema) => {
    startTransition(() => {
      postAcademicYears(values).then((data) => {
        if (data.success) {
          toast.success(data.success);
          setOpen(false);
          reset();
        } else {
          toast.error(data.error);
        }
      });
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-8 mt-8 mb-8">
        <div className="grid gap-3">
          <Label htmlFor="start_year">Start year</Label>
          <div className="flex flex-col gap-2">
            <Controller
              name="start_year"
              rules={{ required: "Start year is required" }}
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    setSelectedStartYear(parseInt(value));
                    field.onChange(value);
                  }}
                  defaultValue={field.value}
                  disabled={isSubmitting || isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a year" />
                  </SelectTrigger>
                  <SelectContent className="h-64">
                    <SelectGroup>
                      {Array.from({ length: 100 }, (_, i) => {
                        const year = new Date().getFullYear() + i - 1;
                        return (
                          <SelectItem value={year.toString()} key={year}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.start_year && (
              <small className="text-red-500 font-bold">
                {errors.start_year?.message}
              </small>
            )}
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="end_year">End year</Label>
          <div className="flex flex-col gap-2">
            <Controller
              name="end_year"
              rules={{ required: "End year is required" }}
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={
                    selectedStartYear ? (selectedStartYear + 1).toString() : ""
                  }
                  disabled={isSubmitting || isPending || !selectedStartYear}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a year" />
                  </SelectTrigger>
                  <SelectContent className="">
                    <SelectGroup>
                      {selectedStartYear ? (
                        <SelectItem value={(selectedStartYear + 1).toString()}>
                          {selectedStartYear + 1}
                        </SelectItem>
                      ) : null}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.end_year && (
              <small className="text-red-500 font-bold">
                {errors.end_year?.message}
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
            if (formRef.current) {
              formRef.current.dispatchEvent(
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

export default NewYearForm;
