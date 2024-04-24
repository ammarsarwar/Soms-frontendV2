"use client";

import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { getAcademicYears } from "@/server/school-calender-server/academicyear/actions";
import { toast } from "sonner";
import { useEffect, useRef, useState, useTransition } from "react";
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
import { TSchoolYearSchema, ZTAcademicTermFormSchema } from "@/schemas";
import { postAcademicTerms } from "@/server/school-calender-server/academicterm/actions";
import { Badge } from "../ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
// import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarDate } from "../calendarComponent/custom-calendar";

const NewTermForm = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isPending, startTransition] = useTransition();
  const termFormRef = useRef<HTMLFormElement>();
  const [isYearLoading, setIsYearLoading] = useState(false);
  const [yearList, setYearList] = useState<TSchoolYearSchema[]>([]);

  const form = useForm<ZTAcademicTermFormSchema>({
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

  //fetch academic years
  useEffect(() => {
    const listOfYear = async () => {
      try {
        setIsYearLoading(true);
        const res: TSchoolYearSchema[] = await getAcademicYears();
        setYearList(res);
        setIsYearLoading(false);
      } catch (error) {
        console.error("error", error);
        alert("error fetching branches");
        setIsYearLoading(false);
      } finally {
        setIsYearLoading(false);
      }
    };

    listOfYear();
  }, []);

  const onSubmit = (values: ZTAcademicTermFormSchema) => {
    startTransition(() => {
      postAcademicTerms(values).then((data) => {
        if (data.success) {
          toast.success(data.success);
          setOpen(false);
          reset();
        } else {
          toast.error(data.error);
        }
        console.log(values);
      });
    });
  };
  const [currentYear] = useState(new Date().getFullYear());
  const startDateValue = watch("start_date");
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex">
        <div className="flex flex-col gap-8 p-5 flex-1">
          <div className="flex flex-col gap-3">
            <Label htmlFor="academic_year">Academic Year</Label>
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
                            ? "No school year found"
                            : "Select an Academic Year"
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
                                  {year.start_year}-{year.end_year}
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
                  {errors.academic_year?.message}
                </small>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="name">Term Name</Label>
            <div className="flex flex-col gap-2">
              <Input
                id="name"
                placeholder="Term Name"
                type="text"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                {...register("name", {
                  required: "Term name is required",
                })}
                disabled={isLoading || isSubmitting}
              />
              {errors.name && (
                <small className="text-red-500 font-bold">
                  {errors.name?.message}
                </small>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="start_date">Term Start Date</Label>
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
          <div className="flex flex-col gap-3">
            <Label htmlFor="end_date">Term End Date</Label>
            <div className="flex flex-col gap-2">
              <Controller
                name="end_date"
                control={control}
                rules={{
                  required: "Term end date is required",
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
                  {errors.end_date.message}
                </small>
              )}
            </div>
          </div>

          <div className="w-full flex justify-end">
            <Button
              disabled={isLoading || isSubmitting || isPending}
              type="submit"
              onClick={() => {
                if (termFormRef.current) {
                  termFormRef.current.dispatchEvent(
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
        </div>
      </div>
    </form>
  );
};

export default NewTermForm;
