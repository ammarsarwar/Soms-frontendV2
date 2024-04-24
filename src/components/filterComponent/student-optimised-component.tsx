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
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StudentProfile } from "../student/data/schema";

interface StudentFilterComponentProps {
  selectedStudent: StudentProfile | null;
  setSelectedStudent: React.Dispatch<
    React.SetStateAction<StudentProfile | null>
  >;
  students: StudentProfile[];
  isStudentLoading: boolean;
  setIsStudentLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ISelectLessonSchema {
  student: string;
}

const StudentOptimisedFilter: React.FC<StudentFilterComponentProps> = ({
  selectedStudent,
  students, // Receive the students prop
  isStudentLoading,
  setSelectedStudent,
  setIsStudentLoading,
}) => {
  const [open, setOpen] = useState(false);
  //form
  const form = useForm<ISelectLessonSchema>({
    mode: "onChange",
  });

  const {
    reset,
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  function getstudentByStudentId(
    StudentArray: StudentProfile[],
    studentId: string
  ) {
    const result = StudentArray.find((stu) => stu.id === Number(studentId));
    return result || null;
  }

  const onSubmit = async (values: ISelectLessonSchema) => {
    setOpen(false);
    const result = getstudentByStudentId(students, values.student);
    setSelectedStudent(result);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={selectedStudent ? "secondary" : "outline"}
          className={cn(
            "w-[200px] border-dashed border-primary flex justify-start items-center gap-2 font-normal truncate ...",
            !selectedStudent && "text-muted-foreground"
          )}
        >
          {selectedStudent ? (
            <Pencil height={15} width={15} />
          ) : (
            <BookA height={15} width={15} />
          )}
          <p>
            {selectedStudent
              ? selectedStudent.studentData.student_first_name_english
              : "Select student"}
          </p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px]">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-2">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Filter lesson</h4>
              <p className="text-sm text-muted-foreground">
                Please select a section first to see the list of students
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 mt-8">
              <div className="flex items-center gap-2">
                <Label htmlFor="branch" className="w-32">
                  Select Student
                </Label>
                <div className="flex flex-col gap-2 w-full">
                  <Controller
                    name="student"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={`${field.value}`}
                        disabled={
                          isLoading ||
                          isSubmitting ||
                          isStudentLoading ||
                          students.length === 0
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              isStudentLoading
                                ? "Loading lessons"
                                : students.length < 1
                                ? "No lesson found"
                                : "Select a lesson"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                            <SelectLabel>Lessons</SelectLabel>
                            {students.length === 0 && (
                              <span>No lesson found</span>
                            )}
                            {students &&
                              students.map((student, index) => (
                                <SelectItem key={index} value={`${student.id}`}>
                                  {
                                    student.studentData
                                      .student_last_name_english
                                  }
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.student && (
                    <small className="text-red-500 font-bold">
                      {errors.student.message}
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

export default StudentOptimisedFilter;
