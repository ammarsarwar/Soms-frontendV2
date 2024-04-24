"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useRef, useState } from "react";
import { useAttendenceStore } from "@/GlobalStore/attendenceStore";
import { TStudentSchemaBySectionId } from "./filter.types";

interface StudentFilterComponentProps {
  students: TStudentSchemaBySectionId[];
  isStudentLoading: boolean;
  setSelectedStudent: React.Dispatch<
    React.SetStateAction<TStudentSchemaBySectionId | null>
  >;
}

const StudentFilterComponent: React.FC<StudentFilterComponentProps> = ({
  setSelectedStudent,
  isStudentLoading,
  students,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const isMounted = useRef(true);

  // value
  //   ? students.find((student) => `${student.id}` === value)
  //       ?.student_first_name_english
  //   : "Select student...";

  //zustand logic
  const { setStudent, student } = useAttendenceStore();

  useEffect(() => {
    if (!isMounted.current && students.length > 0) {
      const setMyStudent = () => {
        const mySelectedStudent = students.find(
          (student) => `${student.id}` === value
        );
        if (mySelectedStudent) {
          setSelectedStudent(mySelectedStudent);
        }
      };
      setMyStudent();
    }
    isMounted.current = false;
  }, [value]);

  // useEffect(() => {
  //   if (!isMounted.current && students.length > 1) {
  //     const setMyStudent = async () => {
  //       const mySelectedStudent = students.find(
  //         (student) => `${student.id}` === value
  //       );
  //       if (mySelectedStudent === undefined) return;

  //       // Set the student first to ensure it's updated before setSelectedStudent
  //       await setStudent(mySelectedStudent.id);
  //       setSelectedStudent(mySelectedStudent);

  //       console.log("student selected from drop down", student);
  //     };
  //     setMyStudent();
  //   }
  //   isMounted.current = false;
  // }, [value, students]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? students.find((student) => `${student.id}` === value)?.studentData
                .student_first_name_english
            : "Select student..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search student..." />
          <CommandEmpty>No student found.</CommandEmpty>
          <CommandGroup>
            {students.map((student) => (
              <CommandItem
                key={student.id}
                value={`${student.id}`}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === `${student.id}` ? "opacity-100" : "opacity-0"
                  )}
                />
                {student.studentData.student_first_name_english}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StudentFilterComponent;
