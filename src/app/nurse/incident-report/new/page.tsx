"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { postIncidents } from "@/serverNurse/incidents/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getGrades } from "@/serverNurse/grades/actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { getStudentById } from "@/server/student_profile/actions";
import { StudentProfile } from "@/components/student/data/schema";
import { getBranches } from "@/server/branch/actions";

import { getSelectedGrade } from "@/server/grade/actions";
import { getSelectedCam } from "@/server/campus/actions";
import { getSelectedDept } from "@/server/department/actions";

import { getSelectedSection } from "@/serverNurse/sections/actions";

import { getStudentBySection } from "@/serverNurse/studentProfile/actions";
import { Grade, Section } from "@/schemas";
interface IFormSchema {
  studentId: number;
  dateTimeOfIncident: string;
  location: string;
  description: string;
  actionsTaken: string;
  studentName: string;

  gradeName: string;
  secName: string;
}

const IncidentSetup = () => {
  const [isStudentConfirmed, setIsStudentConfirmed] = useState(false);

  const confirmStudent = () => {
    setIsStudentConfirmed(true);
  };

  const [grade, setGrade] = useState<Grade[]>([]);
  const [student, setStudent] = useState<StudentProfile[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [sections, setSections] = useState<Section[]>([]);

  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
    null
  );
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchGrades = async () => {
    setLoading(true);
    try {
      const fetchedGrades = await getGrades();
      setGrade(fetchedGrades);
      console.log("fetched grades", fetchedGrades);
      setError(""); // Reset error on successful fetch
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFocus = () => {
    if (!hasFetched) {
      fetchGrades();
      setHasFetched(true);
    }
  };

  const handleGradeChange = async (gradeName: any) => {
    const selected = grade.find((g: any) => g.name === gradeName) || null;
    setSelectedGrade(selected);
    if (selected) {
      console.log("Selected grade ID:", selected.id);
      try {
        const fetchedSections = await getSelectedSection(selected.id);
        console.log("Fetched sections:", fetchedSections);
        setSections(fetchedSections);
      } catch (error) {
        console.error("Error fetching sections:", error);
        setSections([]);
      }
    } else {
      setSections([]);
    }
  };

  const handleSectionChange = async (secName: any) => {
    const selected = sections.find((s: any) => s.name === secName) || null;
    setSelectedSection(selected);
    if (selected) {
      console.log("Selected section ID:", selected.id);
      try {
        const fetchedStudents = await getStudentBySection(selected.id);
        if (fetchedStudents && fetchedStudents.results) {
          setStudent(fetchedStudents.results); // Update student state
          console.log("Fetched students:", fetchedStudents.results);
        } else {
          setStudent([]); // Reset student state if no data is returned
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudent([]);
      }
    } else {
      setStudent([]); // Reset student state if no section is selected
    }
  };

  const handleStudentChange = (studentName: any) => {
    const selected =
      student.find(
        (s: any) => s.studentData.student_first_name_english === studentName
      ) || null;
    setSelectedStudent(selected);
    if (selected) {
      console.log("Selected student ID:", selected.id);
    }
  };
  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting, isLoading, errors },
  } = useForm<IFormSchema>({
    defaultValues: {
      studentId: 0,
      dateTimeOfIncident: "",
      location: "",
      description: "",
      actionsTaken: "",
      studentName: "",
      gradeName: "",
      secName: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: IFormSchema) => {
    const refinedData = {
      student: selectedStudent ? selectedStudent.id : null,
      date_time_of_incident: values.dateTimeOfIncident,
      location: values.location,
      description: values.description,
      actions_taken: values.actionsTaken,
    };
    console.log("refinedData", refinedData);
    const res = await postIncidents(refinedData);
    if (res === undefined) {
      alert("error creating a new incident");
    } else {
      alert("Incident submitted");
    }
  };

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8">
      <h2 className="text-2xl font-bold tracking-tight">Incident Setup</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-8">
          <div className="grid gap-3">
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button type="button" variant={"secondary"}>
                    Search student
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] h-[400px]">
                  <DialogHeader>
                    <DialogTitle>Search student</DialogTitle>
                    <DialogDescription>Select the student</DialogDescription>
                  </DialogHeader>
                  {!isStudentConfirmed && (
                    <div className="flex flex-col gap-10 mb-14">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="grid gap-3">
                          <Label htmlFor="gradeName">Select Grade</Label>
                          <Controller
                            name="gradeName"
                            control={control}
                            rules={{ required: "Grade selection is required" }}
                            render={({
                              field: { onChange, value },
                              fieldState: { error },
                            }) => (
                              <Select
                                value={value}
                                onValueChange={(val) => {
                                  onChange(val);
                                  handleGradeChange(val);
                                }}
                                onOpenChange={handleSelectFocus}
                                disabled={loading}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={
                                      loading ? "Loading..." : "Select a grade"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                                    <SelectLabel>Grade</SelectLabel>
                                    {grade.map((grade) => (
                                      <SelectItem
                                        key={grade.id}
                                        value={grade.name}
                                      >
                                        {grade.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="secName">Select Section</Label>
                          <Controller
                            control={control}
                            name="secName"
                            render={({
                              field: { onChange, value },
                              fieldState: { error },
                            }) => (
                              <Select
                                value={value}
                                onValueChange={(val) => {
                                  onChange(val);
                                  handleSectionChange(val);
                                }}
                                disabled={
                                  !selectedGrade || sections.length === 0
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={
                                      sections.length > 0
                                        ? "Select a section"
                                        : "No sections available"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                                    <SelectLabel>Sections</SelectLabel>
                                    {sections.map((section: any) => (
                                      <SelectItem
                                        key={section.id}
                                        value={section.name}
                                      >
                                        {section.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="studentName">Select Student</Label>
                          <Controller
                            control={control}
                            name="studentName"
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
                                disabled={student.length === 0}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={
                                      student.length > 0
                                        ? "Select a student"
                                        : "No students available"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                                    <SelectLabel>Students</SelectLabel>
                                    {student.map((stu) => (
                                      <SelectItem
                                        key={stu.id}
                                        value={
                                          stu.studentData
                                            .student_first_name_english
                                        }
                                      >
                                        {
                                          stu.studentData
                                            .student_first_name_english
                                        }{" "}
                                        {
                                          stu.studentData
                                            .student_last_name_english
                                        }
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" onClick={confirmStudent}>
                        Confirm student
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* <Label htmlFor="studentId">Student ID</Label>
            <div className="flex items-center flex-row gap-3">
              <Input
                id="studentId"
                placeholder="Enter Student ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                onClick={handleSearch}
                type="button"
                variant={"secondary"}
              >
                Search
              </Button>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {fetchedStudent && (
              <Input
                id="studentName"
                placeholder="Student Name"
                value={`${fetchedStudent.studentData.student_first_name_english} ${fetchedStudent.studentData.student_last_name_english}`}
                disabled
                className="font-bold w-[200px]"
              />
            )} */}
          </div>
          {isStudentConfirmed && (
            <>
              <Input
                id="studentName"
                placeholder="Student Name"
                value={
                  selectedStudent
                    ? `${selectedStudent.studentData.student_first_name_english} ${selectedStudent.studentData.student_last_name_english}`
                    : ""
                }
                disabled
                className="font-bold"
              />
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
