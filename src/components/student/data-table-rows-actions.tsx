"use client";
import { useEffect, useState } from "react";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { StudentProfile } from "./data/schema";
import { updateStudent } from "@/server/student_profile/actions";
import { Controller, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSectionByGrade } from "@/server/section/actions";
import { Section } from "@/schemas";
import { Icons } from "../ui/icons";
import { toast } from "sonner";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
interface IFormSchema {
  sectionName: string;
  studentFName: string;
  studentMName: string;
  studentLName: string;
  studentID: string;
}
export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const student = row.original as StudentProfile;

  const form = useForm<IFormSchema>({
    defaultValues: {
      sectionName: student.section?.name,
      studentFName: student.studentData.student_first_name_english,
      studentMName: student.studentData.student_middle_name_english,
      studentLName: student.studentData.student_last_name_english,
      studentID: student.studentData.student_national_id,
    },
    mode: "onChange",
  });

  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  useEffect(() => {
    const fetchSections = async () => {
      if (student.section?.grade.id) {
        try {
          const fetchedSections = await getSectionByGrade(
            student.section?.grade.id
          );

          setSections(fetchedSections);
        } catch (error) {
          console.error("Error fetching sections:", error);
        }
      }
    };
    fetchSections();
  }, []);

  const handleSectionChange = (SectionName: any) => {
    const selected = sections.find((c: any) => c.name === SectionName) || null;
    setSelectedSection(selected);
    if (selected) {
      console.log("Selected section ID:", selected.id);
    }
  };
  const onSubmit: SubmitHandler<any> = async (values) => {
    const refinedData = {
      student_national_id: values.studentID,
      student_first_name_english: values.studentFName,
      student_middle_name_english: values.studentLName,
      section: selectedSection?.id,
    };
    console.log("refined data", refinedData);
    try {
      const result = await updateStudent(student.id, refinedData);
      if (result) {
        toast.success("Student information has been updated");
      } else {
        toast.error("Error updating student information");
      }
    } catch {
      toast.error("Error updating student information");
    }
  };

  const capitalizeFirstLetter = (str: string | null | undefined) => {
    if (!str) return "N/A"; // Returns "N/A" if the input is null or undefined.

    return str
      .split(" ") // Splits the string into an array of words.
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalizes the first letter of each word and converts the rest to lowercase.
      .join(" ");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <Dialog>
          <DialogTrigger asChild>
            <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start">
              View
            </p>
          </DialogTrigger>
          <DialogContent className="max-w-[800px] overflow-scroll no-scrollbar">
            <DialogHeader>
              <DialogTitle>Student Information</DialogTitle>
            </DialogHeader>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="student_info">
                <AccordionTrigger>Student Information</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2  transition-all hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Student national ID
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {student.studentData.student_national_id
                            ? student.studentData.student_national_id
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Student Name
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {capitalizeFirstLetter(
                            student.studentData.student_first_name_english
                              ? student.studentData.student_first_name_english
                              : "N/A"
                          )}{" "}
                          {capitalizeFirstLetter(
                            student.studentData.student_middle_name_english
                              ? student.studentData.student_middle_name_english
                              : "N/A"
                          )}{" "}
                          {capitalizeFirstLetter(
                            student.studentData.student_last_name_english
                              ? student.studentData.student_last_name_english
                              : "N/A"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2  transition-all hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Gender
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {student.studentData.student_gender
                            ? student.studentData.student_gender
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Date of birth
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {student.studentData.student_date_of_birth
                            ? student.studentData.student_date_of_birth
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="Parent_info">
                {" "}
                <AccordionTrigger>Parent Information</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Parent ID
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {student.parentData.parent_national_id
                            ? student.parentData.parent_national_id
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Parent Name
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {capitalizeFirstLetter(
                            student.parentData.parent_name_english
                              ? student.parentData.parent_name_english
                              : "N/A"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Parent Email
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {student.parentData.parent_email
                            ? student.parentData.parent_email
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Parent Number
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {student.parentData.parent_phone_number
                            ? student.parentData.parent_phone_number
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="location_info">
                <AccordionTrigger>Location Preferrence</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Branch
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {student.campus.branch.name
                            ? student.campus.branch.name
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2  transition-all hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Campus
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {student.campus.name ? student.campus.name : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="-mx-2 flex items-start space-x-4 rounded-md  p-2 hover:bg-accent hover:text-accent-foreground transition-all">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Grade
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {student.section?.grade.name
                            ? student.section?.grade.name
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Department
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {student.section?.grade.department.name
                            ? student.section?.grade.department.name
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start">
              Edit Information
            </p>
          </DialogTrigger>
          <DialogContent className="max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Student Information</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-5 justify-center">
                <Label>First Name</Label>
                <Input type="text" {...register("studentFName")} />
                <Label>Middle Name</Label>
                <Input type="text" {...register("studentMName")} />
                <Label>Last Name</Label>
                <Input type="text" {...register("studentLName")} />
                <Label>Student ID</Label>
                <Input type="text" {...register("studentID")} />

                <Label>Select Section</Label>
                <Controller
                  control={control}
                  name="sectionName"
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
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                          <SelectLabel>Sections</SelectLabel>
                          {sections.map((section) => {
                            return (
                              <SelectItem key={section.id} value={section.name}>
                                {section.name}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <DialogFooter className="mt-5">
                <Button disabled={isLoading || isSubmitting} type="submit">
                  {isLoading ||
                    (isSubmitting && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ))}
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
      {/* <DropdownMenuContent align="end" className="w-[160px]">
       
      </DropdownMenuContent> */}
    </DropdownMenu>
  );
}
