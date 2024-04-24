"use client";
import { useEffect, useState } from "react";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { StudentProfile } from "./data/schema";
import { updateStudent } from "@/serverAcademics/student_profile/actions";
import { Controller, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

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
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
interface IFormSchema {
  sectionName: string;
}
export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const {
    handleSubmit,
    control,
    formState: { errors, isLoading, isSubmitting },
  } = useForm({
    mode: "onChange",
  });
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const student = row.original as StudentProfile;
  const form = useForm<IFormSchema>({
    defaultValues: {
      sectionName: "",
    },
    mode: "onChange",
  });
  const fetchSections = async () => {
    if (student.applied_grade.id) {
      try {
        const fetchedSections = await getSectionByGrade(
          student.applied_grade.id
        );

        setSections(fetchedSections);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    }
  };

  const onClickAssignSection = () => {
    // Fetch sections only when the "Assign a section" dropdown is clicked
    fetchSections();
  };
  const handleSectionChange = (SectionName: any) => {
    const selected = sections.find((c: any) => c.name === SectionName) || null;
    setSelectedSection(selected);
    if (selected) {
      console.log("Selected section ID:", selected.id);
    }
  };
  const onSubmit: SubmitHandler<any> = async (values) => {
    const refinedData = {
      section: selectedSection?.id,
    };
    console.log("refined data", refinedData);
    try {
      const result = await updateStudent(student.id, refinedData);
      if (result) {
        alert("Application status has been updated");
      } else {
        alert("Error updating application status");
      }
    } catch {
      alert("Error updating application status");
    } finally {
    }
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
            <p
              className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start"
              onClick={onClickAssignSection}
            >
              Assign a section
            </p>
          </DialogTrigger>
          <DialogContent className="max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Section Assignment</DialogTitle>
              <DialogDescription>
                Here you can assign a section to the student
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Applied Grade
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {" "}
                      {student.applied_grade.name}
                    </p>
                  </div>
                </div>
                <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all ">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Select a Section
                    </p>
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
                          <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="Select a section" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                              <SelectLabel>Sections</SelectLabel>
                              {sections.map((section) => {
                                return (
                                  <SelectItem
                                    key={section.id}
                                    value={section.name}
                                  >
                                    {section.name}
                                  </SelectItem>
                                );
                              })}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {/* <Select>
                      <SelectTrigger className="w-[380px]">
                        <SelectValue placeholder="List of sections" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Sections</SelectLabel>
                          <SelectItem value="apple">
                            Grade 1 - Section 1
                          </SelectItem>
                          <SelectItem value="banana">
                            Grade 1 - Section 2
                          </SelectItem>
                          <SelectItem value="blueberry">
                            Grade 1 - Section 3
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select> */}
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-5">
                <Button type="submit">Save changes</Button>
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
