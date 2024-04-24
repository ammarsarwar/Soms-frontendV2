"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { StudentProfile } from "@/components/student/data/schema";
import { Controller } from "react-hook-form";
import { getStudents } from "@/serverParent/student_profile/actions";
import { Label } from "@/components/ui/label";
import { postDismissalRequests } from "@/serverParent/dismissal/actions";
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
import { Icons } from "@/components/ui/icons";
const DismissalCreate = () => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
    null
  );
  const [hasFetched, setHasFetched] = useState(false);
  const {
    reset,
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { isSubmitting, isLoading, errors },
  } = useForm<FormData>();
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const fetchedStudent = await getStudents();
      setStudents(fetchedStudent);
      console.log("this is what getting stored in studentds", fetchedStudent);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleStudentChange = (studentName: any) => {
    const student = students.find(
      (s) =>
        s.studentData.student_first_name_english +
          s.studentData.student_last_name_english ===
        studentName
    );
    if (student) {
      setSelectedStudent(student);
      console.log("Student id is", student.id);
    } else {
      setSelectedStudent(null);
      console.log("no student id found ");
    }
  };
  const handleSelectFocus = () => {
    if (!hasFetched) {
      fetchStudents();
      setHasFetched(true);
    }
  };
  interface FormData {
    studentName: string;
    dismissalTypeName: string;
    earlyDismissalDocument?: FileList;
  }
  const onSubmit = async (data: FormData) => {
    try {
      const result = await postDismissalRequests({
        student: selectedStudent?.id,
        dismissal_type: data.dismissalTypeName,
      });

      if (result.success) {
        toast.success(result.success);
        reset(); // Reset the form on successful submission
      } else if (result.error) {
        toast.error(result.error); // Display the backend error message
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">Add new</Button>
        </DialogTrigger>
        <DialogContent className="450px p-5">
          <DialogHeader>
            <DialogTitle>New dismissal request</DialogTitle>
          </DialogHeader>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="studentName">Select student</Label>
                  <Controller
                    name="studentName"
                    control={control}
                    rules={{ required: "Student selection is required" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Select
                        value={value}
                        onValueChange={(val) => {
                          onChange(val);
                          handleStudentChange(val);
                        }}
                        onOpenChange={handleSelectFocus}
                        disabled={loading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              loading ? "Loading..." : "Select a student"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                            <SelectLabel>Student</SelectLabel>
                            {students.map((student: StudentProfile) => (
                              <SelectItem
                                key={student.id}
                                value={
                                  student.studentData
                                    .student_first_name_english +
                                  student.studentData.student_last_name_english
                                }
                              >
                                {student.studentData
                                  .student_first_name_english +
                                  " " +
                                  student.studentData.student_last_name_english}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.studentName && (
                    <small className="text-red-500 font-bold">
                      {errors.studentName.message}
                    </small>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="studentName">Select dismissal type</Label>
                  <Controller
                    name="dismissalTypeName"
                    control={control}
                    rules={{ required: "Dismissal type is required" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Select value={value} onValueChange={onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select dismissal type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Types</SelectLabel>
                            <SelectItem value="End Of Day">
                              End of Day
                            </SelectItem>
                            <SelectItem value="Early">Early</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.dismissalTypeName && (
                    <small className="text-red-500 font-bold">
                      {errors.dismissalTypeName.message}
                    </small>
                  )}
                </div>

                {watch("dismissalTypeName") === "Early" && (
                  <div className="grid gap-3">
                    <Label htmlFor="earlyDismissalDocument">
                      Upload document
                    </Label>
                    <Controller
                      name="earlyDismissalDocument"
                      control={control}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => onChange(e.target.files)}
                          // value={value}
                        />
                      )}
                    />
                    {errors.earlyDismissalDocument && (
                      <small className="text-red-500 font-bold">
                        {errors.earlyDismissalDocument.message}
                      </small>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter className="sm:justify-end mt-5">
                <Button disabled={isLoading || isSubmitting} type="submit">
                  {isLoading ||
                    (isSubmitting && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ))}
                  Create
                </Button>

                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DismissalCreate;
