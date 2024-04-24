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
import { TSchoolYearSchema, ZTCalenderFormSchema } from "@/schemas";
import { Badge } from "../ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { CalendarDate } from "../calendarComponent/custom-calendar";

const NewCalenderForm = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [yearList, setYearList] = useState<TSchoolYearSchema[]>([]);
  const [isYearLoading, setIsYearLoading] = useState(false);
  const calenderRef = useRef<HTMLFormElement>();
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

  const form = useForm<ZTCalenderFormSchema>({
    mode: "onChange",
  });

  const {
    reset,
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const onSubmit = (values: ZTCalenderFormSchema) => {
    startTransition(() => {
      postAdmissionCalender(values).then((data) => {
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
  const [currentYear] = useState(new Date().getFullYear());
  const startDateValue = watch("start_date");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-8 mt-8 mb-8 ">
        <div className="grid gap-3">
          <Label htmlFor="userRole">Academic Year</Label>
          <div className="flex flex-col gap-2">
            <Controller
              name="academic_year"
              control={control}
              rules={{ required: "Please select an Academic Year" }}
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
                          ? "No Academic Year found"
                          : "Select an Academic year"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                      <SelectLabel>Academic Years</SelectLabel>
                      {yearList.length === 0 && (
                        <span>No Academic Year found</span>
                      )}
                      {yearList?.map((year, index) => {
                        return (
                          <SelectItem key={index} value={`${year.id}`}>
                            <div className="flex items-center gap-2">
                              <p>
                                {year.start_year} - {year.end_year}
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
        <div className="grid grid-cols-2 gap-8">
          <div className="grid gap-3">
            <Label htmlFor="start_year">Start Date</Label>
            <div className="flex flex-col gap-2">
              <Controller
                name="start_date"
                control={control}
                rules={{ required: "Term start date is required" }}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "yyy-MM-dd")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      {/* <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      /> */}
                      <CalendarDate
                        mode="single"
                        captionLayout="dropdown-buttons"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        fromYear={currentYear}
                        toYear={2090}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.start_date && (
                <small className="text-red-500 font-bold">
                  {errors.start_date?.message}
                </small>
              )}
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="end_year">End Date</Label>
            <div className="flex flex-col gap-2">
              <Controller
                name="end_date"
                control={control}
                rules={{
                  required: "Admission Calendar end date is required",
                  validate: (value) =>
                    new Date(value) > new Date(startDateValue) ||
                    "End date must be after the start date",
                }}
                render={({ field, fieldState: { error } }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                          error && "border-red-500"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "yyyy-MM-dd")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarDate
                        mode="single"
                        captionLayout="dropdown-buttons"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        fromYear={currentYear}
                        toYear={2090}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.end_date && (
                <small className="text-red-500 font-bold">
                  {errors.end_date?.message}
                </small>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <Button
          disabled={isLoading || isSubmitting || isPending}
          type="submit"
          onClick={() => {
            if (calenderRef.current) {
              calenderRef.current.dispatchEvent(
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

export default NewCalenderForm;
