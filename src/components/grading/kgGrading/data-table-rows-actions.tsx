"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, Eye, Pencil, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LegacyRef,
  MutableRefObject,
  RefObject,
  useRef,
  useState,
  useTransition,
} from "react";
import { Controller, useForm } from "react-hook-form";
import {
  editKgQuizMarks,
  editQuizMarks,
  postKgQuizMarks,
  postQuizMarks,
} from "@/server/grading/marking/action";
import { toast } from "sonner";
import { Icons } from "../../ui/icons";
import {
  EditKgMarksFormSchema,
  EditMarksFormSchema,
  TKgAssessmentSchemaWithIdKey,
  TQuizSchema,
  TStudentGradingSchema,
  TStudentKgGradingSchema,
} from "@/schemas";
import { useGradingStore } from "@/GlobalStore/gradingStore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

// function calculateTotalObtainedMarksForStudent(student: TStudentKGGradingSchema) {
//   const totalWeightedMarks = student.quizes.reduce((total, quiz) => {
//     return total + (quiz.weighted_marks || 0);
//   }, 0);

//   return totalWeightedMarks;
// }

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  //states
  const [isSingleQuizEditing, setIsSingleQuizEditing] = useState(false);
  const [singleQuizId, setSingleQuizId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  //zustand logic
  const { setIsGradeRefetched } = useGradingStore();

  //refs
  const gradeEditRef: RefObject<HTMLFormElement> | LegacyRef<HTMLFormElement> =
    useRef(null);
  const gradeKgMarkRef:
    | RefObject<HTMLFormElement>
    | LegacyRef<HTMLFormElement> = useRef(null);

  //row
  const gradingRow = row.original as TStudentKgGradingSchema;

  //form logic
  const form = useForm<EditKgMarksFormSchema>({
    mode: "onChange",
  });

  const {
    reset,
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const editSubmit = async (
    values: EditKgMarksFormSchema,
    quiz: TKgAssessmentSchemaWithIdKey
  ) => {
    startTransition(() => {
      editKgQuizMarks(values, quiz).then((data) => {
        if (data.success) {
          toast.success(data.success);
          setIsGradeRefetched(true);
          handleSingleRowcancel();
          setOpen(false);
        } else {
          toast.error(data.error);
          handleSingleRowcancel();
        }
      });
    });
  };

  const markKgSubmit = async (
    values: EditKgMarksFormSchema,
    quiz: TKgAssessmentSchemaWithIdKey,
    gradingRow: TStudentKgGradingSchema
  ) => {
    startTransition(() => {
      postKgQuizMarks(values, quiz, gradingRow).then((data) => {
        if (data.success) {
          toast.success(data.success);
          setIsGradeRefetched(true);
          reset();
          handleSingleRowcancel();
        } else {
          toast.error(data.error);
          reset();
          handleSingleRowcancel();
        }
      });
    });
  };

  // functions
  const handleSingleAssessmentEdit = (
    assessment: TKgAssessmentSchemaWithIdKey
  ) => {
    // console.log(assessment);
    setSingleQuizId(assessment.id);
    setIsSingleQuizEditing(true);
  };

  const handleSingleRowcancel = () => {
    setSingleQuizId(null);
    setIsSingleQuizEditing(false);
  };

  return (
    <div className="flex gap-2 items-center justify-between">
      <div className="flex gap-2 items-center">
        <div className="flex gap-3">
          {gradingRow.assessments.map((assessment) => (
            <div
              key={assessment.id}
              className="flex flex-col gap-2 border-r-2 p-2"
            >
              <Button variant={"outline"} size={"sm"} className="">
                <span className="truncate ... w-24">{assessment.name}</span>
              </Button>
              <div
                className={cn(
                  "w-32 h-8 rounded-sm",
                  !assessment.performance_key
                    ? "bg-slate-200"
                    : assessment.performance_key === 1
                    ? "bg-primary"
                    : assessment.performance_key === 2
                    ? "bg-yellow-500"
                    : assessment.performance_key === 3
                    ? "bg-red-500"
                    : "bg-slate-200"
                )}
              ></div>
            </div>
          ))}
        </div>
      </div>
      <div className=" flex flex-col gap-2 cursor-pointer ml-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size={"sm"}
              variant={"outline"}
              className="flex items-center gap-2 hover:text-primary"
            >
              <Eye height={15} width={15} />
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Mark Details</DialogTitle>
              <DialogDescription>
                Here you can see grade calculation for each assessment. Close
                the tab when you are done.
              </DialogDescription>
            </DialogHeader>

            <div className="gap-3 p-3 border rounded-sm">
              <Table>
                <TableCaption>
                  {gradingRow.student_first_name_english}{" "}
                  {gradingRow.student_last_name_english} Grade calculation
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Assessment Name</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradingRow.assessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium">
                        {assessment.name}
                      </TableCell>
                      <TableCell>
                        <div
                          className={cn(
                            "w-32 h-8 rounded-sm",
                            !assessment.performance_key
                              ? "bg-slate-200"
                              : assessment.performance_key === 1
                              ? "bg-primary"
                              : assessment.performance_key === 2
                              ? "bg-yellow-500"
                              : assessment.performance_key === 3
                              ? "bg-red-500"
                              : "bg-slate-200"
                          )}
                        ></div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size={"sm"}
              variant={"secondary"}
              className="flex items-center gap-2 hover:text-primary"
            >
              <Pencil height={15} width={15} />
              Mark
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mark Details</DialogTitle>
              <DialogDescription>
                Here you can see grade calculation for each assessment. Close
                the tab when you are done.
              </DialogDescription>
            </DialogHeader>

            <div className="gap-3 p-3 border rounded-sm overflow-scroll no-scrollbar">
              <Table>
                <TableCaption>
                  {gradingRow.student_first_name_english}{" "}
                  {gradingRow.student_last_name_english} Grade calculation
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Assessment Name</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradingRow.assessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium">
                        {assessment.name}
                      </TableCell>
                      <TableCell className="text-right">
                        {isSingleQuizEditing &&
                        assessment.id === singleQuizId ? (
                          <>
                            {assessment.performance_key ? (
                              <form
                                onSubmit={handleSubmit((values) =>
                                  editSubmit(values, assessment)
                                )}
                                ref={gradeEditRef}
                              >
                                <div className="flex flex-col gap-2">
                                  <Controller
                                    name="performance_key"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={`${field.value}`}
                                        disabled={
                                          isLoading || isSubmitting || isPending
                                        }
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue
                                            placeholder={
                                              field.value
                                                ? field.value
                                                : "Select progress"
                                            }
                                          />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            <SelectLabel>Progress</SelectLabel>
                                            <SelectItem value="1">
                                              Progressing
                                            </SelectItem>
                                            <SelectItem value="2">
                                              Slow progressing
                                            </SelectItem>
                                            <SelectItem value="3">
                                              Not progressing
                                            </SelectItem>
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    )}
                                  />
                                  {errors.performance_key && (
                                    <small className="text-red-500 font-bold">
                                      {errors.performance_key.message}
                                    </small>
                                  )}
                                </div>
                              </form>
                            ) : (
                              <form
                                onSubmit={handleSubmit((values) =>
                                  markKgSubmit(values, assessment, gradingRow)
                                )}
                                ref={gradeKgMarkRef}
                              >
                                <div className="flex flex-col gap-2">
                                  <Controller
                                    name="performance_key"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={`${field.value}`}
                                        disabled={
                                          isLoading || isSubmitting || isPending
                                        }
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue
                                            placeholder={
                                              field.value
                                                ? field.value
                                                : "Select progress"
                                            }
                                          />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                                            <SelectLabel>Progress</SelectLabel>
                                            <SelectItem value="1">
                                              Progressing
                                            </SelectItem>
                                            <SelectItem value="2">
                                              Slow progressing
                                            </SelectItem>
                                            <SelectItem value="3">
                                              Not progressing
                                            </SelectItem>
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    )}
                                  />
                                  {errors.performance_key && (
                                    <small className="text-red-500 font-bold">
                                      {errors.performance_key.message}
                                    </small>
                                  )}
                                </div>
                              </form>
                            )}
                          </>
                        ) : (
                          <div
                            className={cn(
                              "w-32 h-8 rounded-sm",
                              !assessment.performance_key
                                ? "bg-slate-200"
                                : assessment.performance_key === 1
                                ? "bg-primary"
                                : assessment.performance_key === 2
                                ? "bg-yellow-500"
                                : assessment.performance_key === 3
                                ? "bg-red-500"
                                : "bg-slate-200"
                            )}
                          ></div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {isSingleQuizEditing &&
                        assessment.id === singleQuizId ? (
                          <div className="flex gap-2">
                            {assessment.performance_key ? (
                              <Button
                                size={"sm"}
                                onClick={() => {
                                  if (gradeEditRef.current) {
                                    gradeEditRef.current.dispatchEvent(
                                      new Event("submit", { bubbles: true })
                                    );
                                  }
                                }}
                              >
                                <Check height={15} width={15} />
                              </Button>
                            ) : (
                              <Button
                                size={"sm"}
                                onClick={() => {
                                  if (gradeKgMarkRef.current) {
                                    gradeKgMarkRef.current.dispatchEvent(
                                      new Event("submit", { bubbles: true })
                                    );
                                  }
                                }}
                              >
                                {" "}
                                {isPending ? (
                                  <Icons.spinner className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check height={15} width={15} />
                                )}
                              </Button>
                            )}
                            <Button
                              variant={"secondary"}
                              size={"sm"}
                              onClick={handleSingleRowcancel}
                            >
                              <X height={15} width={15} />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size={"sm"}
                            onClick={() =>
                              handleSingleAssessmentEdit(assessment)
                            }
                          >
                            {isLoading ||
                              (isSubmitting &&
                              assessment.id === singleQuizId ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                              ) : null)}
                            <Pencil height={15} width={15} />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
