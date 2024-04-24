"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { useForm, Controller } from "react-hook-form";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { getBranches } from "@/server/branch/actions";
import { getNurseUsers } from "@/server/user/action";
import { getSelectedGrade } from "@/server/grade/actions";
import { getSelectedCam } from "@/server/campus/actions";
import { getSelectedDept } from "@/server/department/actions";

import { getSectionByGrade } from "@/server/section/actions";

import {
  Branch,
  Campus,
  Department,
  Grade,
  Section,
  TTeacherUserSchema,
} from "@/schemas";
import { StudentProfile } from "../student/data/schema";
import { getStudentBySection } from "@/server/student_profile/actions";

interface IFormSchema {
  branchName: string;
  campusName: string;
  deptName: string;
  gradeName: string;
  secName: string;
  studentName: string;
  nurseName: string;
}
interface Props {
  setSelectedStudent: (student: StudentProfile | null) => void;
  setSelectedNurse: (nurse: TTeacherUserSchema | null) => void; // Add this line
}
const StudentSectionFilter: React.FC<Props> = ({
  setSelectedStudent,
  setSelectedNurse,
}) => {
  const {
    control,
    formState: { isSubmitting, errors },
  } = useForm<IFormSchema>({
    defaultValues: {
      branchName: "",
      campusName: "",
      deptName: "",
      gradeName: "",
      secName: "",
      studentName: "",
      nurseName: "",
    },
    mode: "onChange",
  });
  const [branches, setBranches] = useState<Branch[]>([]);
  const [campus, setCampus] = useState<Campus[]>([]);
  const [department, setDepartment] = useState<Department[]>([]);
  const [grade, setGrade] = useState<Grade[]>([]);

  const [hasFetched, setHasFetched] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [isStudentLoading, setIsStudentLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [students, setStudents] = useState<StudentProfile[]>([]);

  const [loading, setLoading] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [nurses, setNurses] = useState<TTeacherUserSchema[]>([]);
 
  const fetchBranches = async () => {
    setLoading(true);
    try {
      const fetchedBranches = await getBranches();
      setBranches(fetchedBranches);
      console.log("fetchedBranches", fetchedBranches);
      setError("");
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFocus = () => {
    if (!hasFetched) {
      fetchBranches();
      setHasFetched(true);
    }
  };

  const handleBranchChange = async (branchName: any) => {
    const branch = branches.find((b) => b.name === branchName) || null;
    console.log("Selected branch:", branch);
    setSelectedBranch(branch);

    if (branch) {
      console.log("this is branch id", branch.id);
      try {
        const campuses = await getSelectedCam(branch.id);
        console.log("Fetched campuses:", campuses);
        setCampus(campuses || []);
      } catch (error) {
        console.error("Error fetching campuses:", error);
      }
    } else {
      setCampus([]);
    }
  };
  const handleCampusChange = async (campusName: any) => {
    const selected = campus.find((c: any) => c.name === campusName) || null;
    setSelectedCampus(selected);
    if (selected) {
      console.log("Selected campus ID:", selected.id);
      try {
        const departments = await getSelectedDept(selected.id);
        console.log("Fetched departments:", departments);
        setDepartment(departments || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    } else {
      setDepartment([]);
    }
  };

  const handleDeptChange = async (deptName: any) => {
    const selected = department.find((d: any) => d.name === deptName) || null;
    setSelectedDepartment(selected);
    if (selected) {
      console.log("Selected dept ID:", selected.id);
      try {
        const grades = await getSelectedGrade(selected.id);
        console.log("Fetched grades:", grades);
        setGrade(grades || []);
      } catch (error) {
        console.error("Error fetching grades:", error);
      }
    } else {
      setGrade([]);
    }
  };
  const handleGradeChange = async (gradeName: any) => {
    const selected = grade.find((g) => g.id.toString() === gradeName) || null;
    setSelectedGrade(selected);
    if (selected) {
      try {
        const fetchedSections = await getSectionByGrade(selected.id);
        setSections(fetchedSections || []);
        if (fetchedSections.length > 0) {
          // This ensures that the section dropdown is enabled
          setIsStudentLoading(false);
        }
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
  };

  const handleStudentSelect = (studentName: string) => {
    const selectedStudent = students.find((stu) => `${stu.id}` === studentName);
    setSelectedStudent(selectedStudent || null);
    console.log("selected student", selectedStudent);
  };

  const confirmSection = async () => {
    setIsLoadingStudents(true);
    try {
      const fetchedStudents = await getStudentBySection(selectedSection?.id);
      setStudents(fetchedStudents || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    } finally {
      setIsStudentLoading(false);
    }
  };

  useEffect(() => {
    const fetchNurses = async () => {
      if (selectedCampus) {
        try {
          const fetchedNurses = await getNurseUsers(selectedCampus.id);
          setNurses(fetchedNurses);
        } catch (error) {
          console.error("Error fetching nurses:", error);
          setNurses([]);
        }
      }
    };

    fetchNurses();
  }, [selectedCampus]);

  const handleNurseChange = (nurseId: string) => {
    const nurse = nurses.find((n) => n.user.id.toString() === nurseId);
    setSelectedNurse(nurse || null);
  };
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant={"secondary"} className="w-[200px]">
            {selectedSection ? selectedSection.name : "Select section"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px]">
          <div className="grid grid-cols-1 gap-5 mt-8">
            <div className="flex items-center gap-2">
              <Label htmlFor="branchName" className="w-32">
                Branch
              </Label>
              <div className="flex flex-col gap-2 w-full">
                <Controller
                  name="branchName"
                  control={control}
                  rules={{
                    required: "Branch selection is required",
                  }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Select
                      value={value}
                      onValueChange={(val) => {
                        onChange(val);
                        handleBranchChange(val);
                      }}
                      onOpenChange={handleSelectFocus}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            branches.length > 0
                              ? "Select a branch"
                              : "No branch available"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                          <SelectLabel>Branch</SelectLabel>
                          {branches.map((branch) => (
                            <SelectItem key={branch.id} value={branch.name}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="campusName" className="w-32">
                Campus
              </Label>
              <div className="flex flex-col gap-2 w-full">
                <Controller
                  name="campusName"
                  control={control}
                  rules={{
                    required: "Campus selection is required",
                  }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Select
                      value={value}
                      onValueChange={(val) => {
                        onChange(val);
                        handleCampusChange(val);
                      }}
                      disabled={!selectedBranch || campus.length === 0}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            campus.length > 0
                              ? "Select a campus"
                              : "No campus available"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                          <SelectLabel>Campus</SelectLabel>
                          {campus.filter(
                            (c) =>
                              c.branch && c.branch.id === selectedBranch?.id
                          ).length > 0 ? (
                            campus
                              .filter(
                                (c) =>
                                  c.branch && c.branch.id === selectedBranch?.id
                              )
                              .map((filteredCampus) => (
                                <>
                                  <SelectItem
                                    key={filteredCampus.id}
                                    value={filteredCampus.name}
                                  >
                                    {filteredCampus.name}
                                  </SelectItem>
                                </>
                              ))
                          ) : (
                            <SelectLabel>
                              This branch does not have any campus, please
                              create a campus first
                            </SelectLabel>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="deptName" className="w-32">
                Department
              </Label>
              <Controller
                name="deptName"
                control={control}
                rules={{
                  required: "Department selection is required",
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Select
                    value={value}
                    onValueChange={(val) => {
                      onChange(val);
                      handleDeptChange(val);
                    }}
                    disabled={!selectedCampus || department.length === 0}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          department.length > 0
                            ? "Select a department"
                            : "No department available"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                        <SelectLabel>Department</SelectLabel>
                        {department.filter(
                          (d) => d.campus && d.campus.id === selectedCampus?.id
                        ).length > 0 ? (
                          department
                            .filter(
                              (d) =>
                                d.campus && d.campus.id === selectedCampus?.id
                            )
                            .map((filtereddepartment) => (
                              <>
                                <SelectItem
                                  key={filtereddepartment.id}
                                  value={filtereddepartment.name}
                                >
                                  {filtereddepartment.name}
                                </SelectItem>
                              </>
                            ))
                        ) : (
                          <SelectLabel>
                            This campus does not have any department, please
                            create a department first
                          </SelectLabel>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="gradeName" className="w-32">
                Grade
              </Label>
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
                      handleGradeChange(val); // Pass the selected grade's unique identifier
                    }}
                    disabled={!selectedDepartment || grade.length === 0}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          grade.length > 0
                            ? "Select a grade"
                            : "No grade available"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                        <SelectLabel>Grade</SelectLabel>
                        {grade.map((filteredGrade) => (
                          <SelectItem
                            key={filteredGrade.id}
                            value={filteredGrade.id.toString()} // Convert the numeric ID to a string
                          >
                            {filteredGrade.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="secName" className="w-32">
                Section
              </Label>
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
                    disabled={!selectedGrade || sections.length === 0}
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
                          <SelectItem key={section.id} value={section.name}>
                            {section.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="w-full flex justify-end mt-8">
            <Button type="button" onClick={confirmSection}>
              Confirm Section
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name="studentName"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Select
              value={value}
              onValueChange={(val) => {
                onChange(val);
                handleStudentSelect(val);
              }}
              disabled={students.length === 0}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue
                  placeholder={
                    students.length > 0
                      ? "Select a student"
                      : "No student available"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                  <SelectLabel>Lessons</SelectLabel>
                  {students.map((stu) => (
                    <SelectItem key={stu.id} value={stu.id.toString()}>
                      {stu.studentData.student_first_name_english}{" "}
                      {stu.studentData.student_middle_name_english}{" "}
                      {stu.studentData.student_last_name_english}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="flex items-center gap-2">
        <Controller
          name="nurseName"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Select
              value={value}
              onValueChange={(val) => {
                onChange(val);
                handleNurseChange(val); // Update the selected nurse state
              }}
              disabled={nurses.length === 0}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue
                  placeholder={
                    nurses.length > 0 ? "Select a Nurse" : "No nurse available"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                  <SelectLabel>Nurses</SelectLabel>
                  {nurses.map((nurse) => (
                    <SelectItem key={nurse.id} value={nurse.user.id.toString()}>
                      {nurse.user.first_name} {nurse.user.last_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </>
  );
};
export default StudentSectionFilter;
