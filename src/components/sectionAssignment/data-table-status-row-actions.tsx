"use client";
import { useEffect, useState } from "react";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { StudentProfile } from "./data/schema";
import { updateStudent } from "@/server/student_profile/actions";
import { Controller, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Icons } from "../ui/icons";

interface DataTableStatusRowActionsProps<TData> {
  row: Row<TData>;
}
interface IFormSchema {
  sectionName: string;
}
export function DataTableStatusRowActions<TData>({
  row,
}: DataTableStatusRowActionsProps<TData>) {
  const {
    handleSubmit,
    control,
    formState: { errors, isLoading, isSubmitting },
  } = useForm({
    mode: "onChange",
  });
  const student = row.original as StudentProfile;

  const status = student.status || "N/A";

  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  const [sections, setSections] = useState<Section[]>([]);

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
        toast.success("Section has been assigned");
      } else {
        toast.error("Error assigning the section");
      }
    } catch {
      toast.error("Error assigning the section");
    } finally {
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Badge
            className=" cursor-pointer hover:bg-[#2dd4bf]"
            onClick={onClickAssignSection}
          >
            {status}
          </Badge>
        </DialogTrigger>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Section Assignment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5 justify-center">
              <Label>Grade</Label>
              <Input type="text" readOnly value={student.applied_grade.name} />

              <Label>Select section</Label>
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
    </>
  );
}
