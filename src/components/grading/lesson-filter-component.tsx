"use client";
import { Button } from "@/components/ui/button";
import { BookA, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { TAssignedLessonsSchema } from "@/schemas";
import { useState } from "react";

interface LessonFilterComponentProps {
  selectedLesson: TAssignedLessonsSchema | null;
  setSelectedLesson: React.Dispatch<
    React.SetStateAction<TAssignedLessonsSchema | null>
  >;
  lessons: TAssignedLessonsSchema[];
  isLessonLoading: boolean;
  setIsLessonLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ISelectLessonSchema {
  lesson: string;
}

const LessonFilterComponent: React.FC<LessonFilterComponentProps> = ({
  selectedLesson,
  lessons,
  isLessonLoading,
  setIsLessonLoading,
  setSelectedLesson,
}) => {
  //form
  const form = useForm<ISelectLessonSchema>({
    mode: "onChange",
  });
  const [open, setOpen] = useState(false);
  const {
    reset,
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  function getLessonByLessonId(
    LessonArray: TAssignedLessonsSchema[],
    lessonId: string
  ) {
    const result = LessonArray.find((lesson) => lesson.id === Number(lessonId));
    return result || null;
  }

  const onSubmit = async (values: ISelectLessonSchema) => {
    setOpen(false);
    const result = getLessonByLessonId(lessons, values.lesson);
    setSelectedLesson(result);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={selectedLesson ? "secondary" : "outline"}
          className={cn(
            "w-[200px] border-dashed border-primary flex justify-start items-center gap-2 font-normal truncate ...",
            !selectedLesson && "text-muted-foreground"
          )}
        >
          {selectedLesson ? (
            <Pencil height={15} width={15} />
          ) : (
            <BookA height={15} width={15} />
          )}
          <p>
            {selectedLesson ? selectedLesson.course.title : "Select lesson"}
          </p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px]">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-2">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Filter lesson</h4>
              <p className="text-sm text-muted-foreground">
                Please select a section first to see the list of lessons
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 mt-8">
              <div className="flex items-center gap-2">
                <Label htmlFor="branch" className="w-32">
                  Select lesson
                </Label>
                <div className="flex flex-col gap-2 w-full">
                  <Controller
                    name="lesson"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={`${field.value}`}
                        disabled={
                          isLoading ||
                          isSubmitting ||
                          isLessonLoading ||
                          lessons.length === 0
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              isLessonLoading
                                ? "Loading lessons"
                                : lessons.length < 1
                                ? "No lesson found"
                                : "Select a lesson"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                            <SelectLabel>Branches</SelectLabel>
                            {lessons.length === 0 && (
                              <span>No lesson found</span>
                            )}
                            {lessons?.map((lesson, index) => {
                              return (
                                <SelectItem key={index} value={`${lesson.id}`}>
                                  {lesson.course.title}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.lesson && (
                    <small className="text-red-500 font-bold">
                      {errors.lesson.message}
                    </small>
                  )}
                </div>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 w-full ">
              <div className="flex justify-end">
                <Button
                  variant={"default"}
                  size={"sm"}
                  className="border-dotted"
                >
                  Add filter
                </Button>
              </div>
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default LessonFilterComponent;
