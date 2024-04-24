"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { TStudentProfileListForReportsSchema } from "@/schemas";
import Link from "next/link";
import { useReportsStore } from "@/GlobalStore/reportsStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@radix-ui/react-label";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  // const task = branchSchema.parse(row.original);
  const studentRow = row.original as TStudentProfileListForReportsSchema;
  const router = useRouter();

  const { addStudentReportsData, departmentTypeSelected, studentReportsData } =
    useReportsStore();

  const handleNewYearPageOpen = (
    student: TStudentProfileListForReportsSchema
  ) => {
    if (student && departmentTypeSelected !== "KG") {
      addStudentReportsData(student);
      // router.push(
      //   `/admin/reports/${student.student}/${departmentTypeSelected}`
      // );
      const academicYear = 1;
      window.open(
        `/admin/reports/${student.id}/${departmentTypeSelected}/${academicYear}`,
        "_blank",
        "noopener,noreferrer"
      );
    } else if (!student) {
      toast.error("Error fetching student details");
    }
  };

  const handleNewYTermPageOpen = (
    student: TStudentProfileListForReportsSchema
  ) => {
    if (student && departmentTypeSelected !== "KG") {
      addStudentReportsData(student);
      // router.push(
      //   `/admin/reports/${student.student}/${departmentTypeSelected}`
      // );
      const academicYear = 1;
      const academicTerm = 1;
      window.open(
        `/admin/reports/${student.id}/${departmentTypeSelected}/${academicYear}/${academicTerm}`,
        "_blank",
        "noopener,noreferrer"
      );
    } else if (!student) {
      toast.error("Error fetching student details");
    }
  };

  const handleDev = () => {
    toast.error("Reports for Grade 1 - 12 students are in development");
  };

  const handleNewPageOpen = (student: TStudentProfileListForReportsSchema) => {
    if (student) {
      addStudentReportsData(student);
      // router.push(
      //   `/admin/reports/${student.student}/${departmentTypeSelected}`
      // );
      window.open(
        `/admin/reports/${student.id}/${departmentTypeSelected}`,
        "_blank",
        "noopener,noreferrer"
      );
    } else if (!student) {
      toast.error("Error fetching student details");
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
            <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start cursor-pointer">
              View
            </p>
          </DialogTrigger>
          <DialogContent className="max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Student details</DialogTitle>
              <DialogDescription>
                View student information here. Click okay when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Student Name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {studentRow.studentData?.student_first_name_english}{" "}
                    {studentRow.studentData?.student_middle_name_english}{" "}
                    {studentRow.studentData?.student_last_name_english}
                  </p>
                </div>
              </div>

              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2  transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Parent Name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {studentRow.parentData.parent_name_english}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleNewPageOpen(studentRow)}>
          Generate report card
        </DropdownMenuItem>

        {/* //   <Dialog>
        //     <DialogTrigger asChild>
        //       <p className="text-sm text-primary cursor-pointer p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start">
        //         Generate Report
        //       </p>
        //     </DialogTrigger>
        //     <DialogContent>
        //       <DialogHeader>
        //         <DialogTitle>Filter Report Card</DialogTitle>
        //       </DialogHeader>
        //       <div className="flex flex-col gap-8 p-5 flex-1">
        //         <div className="flex flex-col gap-3">
        //           <Label htmlFor="academic_year">Academic Year</Label>
        //           <div className="flex flex-col gap-2">
        //             <Select>
        //               <SelectTrigger>
        //                 <SelectValue placeholder="Select a year" />
        //               </SelectTrigger>
        //               <SelectContent>
        //                 <SelectGroup>
        //                   <SelectLabel>Years</SelectLabel>
        //                   <SelectItem value="apple">Year 1</SelectItem>
        //                   <SelectItem value="banana">Year 2</SelectItem>
        //                   <SelectItem value="blueberry">Year 3</SelectItem>
        //                   <SelectItem value="grapes">Year 4</SelectItem>
        //                   <SelectItem value="pineapple">Year 5</SelectItem>
        //                 </SelectGroup>
        //               </SelectContent>
        //             </Select>
        //           </div>
        //         </div>
        //         <div className="flex flex-col gap-3">
        //           <Label htmlFor="academic_year">Academic Term</Label>
        //           <div className="flex flex-col gap-2">
        //             <Select>
        //               <SelectTrigger>
        //                 <SelectValue placeholder="Select a year" />
        //               </SelectTrigger>
        //               <SelectContent>
        //                 <SelectGroup>
        //                   <SelectLabel>Terms</SelectLabel>
        //                   <SelectItem value="apple">Term 1</SelectItem>
        //                   <SelectItem value="banana">Term 2</SelectItem>
        //                   <SelectItem value="blueberry">Term 3</SelectItem>
        //                   <SelectItem value="grapes">Term 4</SelectItem>
        //                   <SelectItem value="pineapple">Term 5</SelectItem>
        //                 </SelectGroup>
        //               </SelectContent>
        //             </Select>
        //           </div>
        //         </div>
        //       </div>
        //       <DialogFooter>
        //         <Button onClick={handleDev}>Generate Report</Button>
        //       </DialogFooter>
        //     </DialogContent>
        //   </Dialog> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
