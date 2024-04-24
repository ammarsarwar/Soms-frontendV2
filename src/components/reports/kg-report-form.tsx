"use client";

import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { useEffect, useRef, useState, useTransition } from "react";
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
import { postAdmissionCalender } from "@/server/school-calender-server/admissionCalender/actions";
import { getAcademicYears } from "@/server/school-calender-server/academicyear/actions";
import {
  TSchoolYearSchema,
  ZTCalenderFormSchema,
  ZTKgReportFormSchemaForKg,
} from "@/schemas";
import { Badge } from "../ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { postKgReportGenerate } from "@/server/reports/actions";
import { Textarea } from "../ui/textarea";

const KgReportForm = ({
  studentId,
  setOpen,
}: {
  studentId: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [yearList, setYearList] = useState<TSchoolYearSchema[]>([]);
  const [isYearLoading, setIsYearLoading] = useState(false);
  const kgReportRef = useRef<HTMLFormElement>();

  const [isPending, startTransition] = useTransition();

  //fetch years
  useEffect(() => {
    const listOfYears = async () => {
      try {
        setIsYearLoading(true);
        const res = await getAcademicYears();
        setYearList(res);
        setIsYearLoading(false);
      } catch (error) {
        console.error("error", error);
        toast.error("error fetching branches");
        setIsYearLoading(false);
      } finally {
        setIsYearLoading(false);
      }
    };

    listOfYears();
  }, []);

  const form = useForm<ZTKgReportFormSchemaForKg>({
    mode: "onChange",
    defaultValues: {
      student: studentId,
    },
  });

  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const onSubmit = (values: ZTKgReportFormSchemaForKg) => {
    startTransition(() => {
      postKgReportGenerate(values).then((data) => {
        if (data.success) {
          toast.success(data.success);
          reset();
          setOpen(false);
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
          <Label htmlFor="userRole">Select school year</Label>
          <div className="flex flex-col gap-2">
            <Controller
              name="academic_year"
              control={control}
              rules={{ required: "Please select a school year" }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={
                    isLoading ||
                    isSubmitting ||
                    isYearLoading ||
                    yearList.length === 0
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isYearLoading
                          ? "Loading school years"
                          : yearList.length === 0
                          ? "No school year found"
                          : "Select a year"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                      <SelectLabel>years</SelectLabel>
                      {yearList.length === 0 && (
                        <span>No school year found</span>
                      )}
                      {yearList?.map((year, index) => {
                        return (
                          <SelectItem key={index} value={`${year.id}`}>
                            <div className="flex items-center gap-2">
                              <p>
                                School year: {year.start_year}-{year.end_year}
                              </p>
                              <Badge
                                variant={
                                  year.status === "Active"
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {year.status}
                              </Badge>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.academic_year && (
              <small className="text-red-500 font-bold">
                {errors.academic_year.message}
              </small>
            )}
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="final_evaluation">Final evaluation</Label>
          <div className="flex flex-col gap-2">
            <Controller
              name="final_evalution"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading || isSubmitting || isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select final evaluation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                      <SelectLabel>Evaluations</SelectLabel>
                      <SelectItem value="Eligible for Promotion">
                        Eligible for Promotion
                      </SelectItem>
                      <SelectItem value="Assessment Required">
                        Assessment Required
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.final_evalution && (
              <small className="text-red-500 font-bold">
                {errors.final_evalution?.message}
              </small>
            )}
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="final_comments">Final comments</Label>
          <div className="flex flex-col gap-2">
            <Textarea
              id="city"
              placeholder="Enter final comments"
              {...register("final_coments", {
                required: {
                  value: true,
                  message: "Final comments is required",
                },
                pattern: {
                  value: /^[A-Za-z ]+$/,
                  message: "Only alphabets are allowed",
                },
              })}
              disabled={isLoading || isSubmitting || isPending}
            />
            {errors.final_coments && (
              <small className="text-red-500 font-bold">
                {errors.final_coments?.message}
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
            if (kgReportRef.current) {
              kgReportRef.current.dispatchEvent(
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

export default KgReportForm;
