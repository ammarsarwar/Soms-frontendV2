"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
import { useForm } from "react-hook-form";
import { editQuizMarks, postQuizMarks } from "@/server/grading/marking/action";
import { toast } from "sonner";
import { Icons } from "../ui/icons";
import {
  EditMarksFormSchema,
  TQuizSchema,
  TStudentGradingSchema,
} from "@/schemas";
import { useAttendenceStore } from "@/GlobalStore/attendenceStore";
import { useGradingStore } from "@/GlobalStore/gradingStore";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

function calculateTotalObtainedMarksForStudent(student: TStudentGradingSchema) {
  const totalWeightedMarks = student.quizes.reduce((total, quiz) => {
    return total + (quiz.weighted_marks || 0);
  }, 0);

  return totalWeightedMarks;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  //states
  const [isSingleQuizEditing, setIsSingleQuizEditing] = useState(false);
  const [singleQuizId, setSingleQuizId] = useState<number | undefined>(
    undefined
  );
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  //zustand logic
  const { setIsGradeRefetched } = useGradingStore();

  //refs
  const gradeEditRef: RefObject<HTMLFormElement> | LegacyRef<HTMLFormElement> =
    useRef(null);
  const gradeMarkRef: RefObject<HTMLFormElement> | LegacyRef<HTMLFormElement> =
    useRef(null);

  //row
  const gradingRow = row.original as TStudentGradingSchema;

  //total marks calculation
  const TotalObtainedMarks = calculateTotalObtainedMarksForStudent(gradingRow);

  // functions
  const handleSingleAssessmentEdit = (assessment: TQuizSchema) => {
    setSingleQuizId(assessment.id);
    setIsSingleQuizEditing(true);
  };

  const handleSingleRowcancel = () => {
    setSingleQuizId(undefined);
    setIsSingleQuizEditing(false);
  };

  //form logic
  const form = useForm<EditMarksFormSchema>({
    mode: "onChange",
  });

  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const editSubmit = async (values: EditMarksFormSchema, quiz: TQuizSchema) => {
    startTransition(() => {
      editQuizMarks(values, quiz).then((data) => {
        if (data.success) {
          toast.success(data.success);
          handleSingleRowcancel();
          setIsGradeRefetched(true);
          setOpen(false);
        } else {
          toast.error(data.error);
          handleSingleRowcancel();
        }
      });
    });
  };

  const markSubmit = async (
    values: EditMarksFormSchema,
    quiz: TQuizSchema,
    gradingRow: TStudentGradingSchema
  ) => {
    startTransition(() => {
      postQuizMarks(values, quiz, gradingRow).then((data) => {
        if (data.success) {
          toast.success(data.success);
          setIsGradeRefetched(true);
          reset();
          handleSingleRowcancel();
        } else {
          toast.error(data.error);
          handleSingleRowcancel();
          reset();
        }
      });
    });
  };

  return (
    <div className="flex gap-2 items-center justify-between">
      <div className="flex gap-2 items-center">
        <div className="flex gap-3">
          {gradingRow.quizes.map((quiz, index) => (
            <div key={index} className="flex flex-col gap-2 border-r-2 p-2">
              <Button variant={"outline"} size={"sm"} className="truncate">
                {quiz.name}
              </Button>
              <Button
                variant={"secondary"}
                size={"sm"}
                className={cn(
                  "truncate",
                  !quiz.obtained_marks ? "text-red-500" : "text-primary"
                )}
              >
                {quiz.obtained_marks ? Math.floor(quiz.obtained_marks) : "NA"} /{" "}
                {Math.floor(Number(quiz.total_marks))}
              </Button>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Button variant={"default"} size={"sm"} className="truncate">
            Total Marks
          </Button>
          <Button
            variant={"secondary"}
            size={"sm"}
            className={cn(
              "truncate",
              !TotalObtainedMarks ? "text-red-500" : "text-primary"
            )}
          >
            {TotalObtainedMarks} / {gradingRow.max_grade}
          </Button>
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
          <DialogContent className="max-w-[800px]">
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
                    <TableHead>Total marks</TableHead>
                    <TableHead>Weightage</TableHead>
                    <TableHead className="text-right">Obtained Marks</TableHead>
                    <TableHead className="text-right">Weighted Marks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradingRow.quizes.map((quiz) => (
                    <TableRow key={quiz.id}>
                      <TableCell className="font-medium">{quiz.name}</TableCell>
                      <TableCell>
                        {Math.floor(Number(quiz.total_marks))}
                      </TableCell>
                      <TableCell>
                        {Math.floor(Number(quiz.weightage))}%
                      </TableCell>
                      <TableCell className="text-right">
                        {quiz.obtained_marks}
                      </TableCell>
                      <TableCell className="text-right">
                        {quiz.weighted_marks}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4} className="text-primary">
                      Final total marks
                    </TableCell>
                    <TableCell className="text-right text-primary">
                      {TotalObtainedMarks}
                    </TableCell>
                  </TableRow>
                </TableFooter>
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
          <DialogContent className="max-w-[800px]">
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
                    <TableHead>Total marks</TableHead>
                    <TableHead>Weightage</TableHead>
                    <TableHead className="text-right">Obtained Marks</TableHead>
                    <TableHead className="text-right">Weighted Marks</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradingRow.quizes.map((quiz) => (
                    <TableRow key={quiz.id}>
                      <TableCell className="font-medium">{quiz.name}</TableCell>
                      <TableCell>
                        {Math.floor(Number(quiz.total_marks))}
                      </TableCell>
                      <TableCell>
                        {Math.floor(Number(quiz.weightage))}%
                      </TableCell>
                      <TableCell className="text-right">
                        {isSingleQuizEditing && quiz.id === singleQuizId ? (
                          <>
                            {quiz.obtained_marks ? (
                              <form
                                onSubmit={handleSubmit((values) =>
                                  editSubmit(values, quiz)
                                )}
                                ref={gradeEditRef}
                              >
                                <div className="flex flex-col gap-2">
                                  <Input
                                    id="obtained_marks"
                                    placeholder="Enter Marks"
                                    type="text"
                                    defaultValue={
                                      quiz.obtained_marks
                                        ? quiz.obtained_marks
                                        : ""
                                    }
                                    autoCapitalize="none"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    {...register("obtained_marks", {
                                      required: "Required",
                                      max: {
                                        value: Math.floor(
                                          Number(quiz.total_marks)
                                        ),
                                        message: `Marks should be equal to or less than ${Math.floor(
                                          Number(quiz.total_marks)
                                        )}`,
                                      },
                                    })}
                                    disabled={
                                      isLoading || isSubmitting || isPending
                                    }
                                  />
                                  {errors.obtained_marks && (
                                    <small className="text-red-500 font-bold">
                                      {errors.obtained_marks.message}
                                    </small>
                                  )}
                                </div>
                              </form>
                            ) : (
                              <form
                                onSubmit={handleSubmit((values) =>
                                  markSubmit(values, quiz, gradingRow)
                                )}
                                ref={gradeMarkRef}
                              >
                                <div className="flex flex-col gap-2">
                                  <Input
                                    id="obtained_marks"
                                    placeholder="Enter Marks"
                                    type="text"
                                    defaultValue={
                                      quiz.obtained_marks
                                        ? quiz.obtained_marks
                                        : ""
                                    }
                                    autoCapitalize="none"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    {...register("obtained_marks", {
                                      required: "Required",
                                      max: {
                                        value: Math.floor(
                                          Number(quiz.total_marks)
                                        ),
                                        message: `Marks should be equal to or less than ${Math.floor(
                                          Number(quiz.total_marks)
                                        )}`,
                                      },
                                    })}
                                    disabled={
                                      isLoading || isSubmitting || isPending
                                    }
                                  />
                                  {errors.obtained_marks && (
                                    <small className="text-red-500 font-bold">
                                      {errors.obtained_marks.message}
                                    </small>
                                  )}
                                </div>
                              </form>
                            )}
                          </>
                        ) : (
                          <div>
                            {quiz.obtained_marks ? quiz.obtained_marks : "NA"}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {quiz.weighted_marks ? quiz.weighted_marks : "NA"}
                      </TableCell>
                      <TableCell className="text-right">
                        {isSingleQuizEditing && quiz.id === singleQuizId ? (
                          <div className="flex gap-2">
                            {quiz.obtained_marks ? (
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
                                  if (gradeMarkRef.current) {
                                    gradeMarkRef.current.dispatchEvent(
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
                            onClick={() => handleSingleAssessmentEdit(quiz)}
                          >
                            {isLoading ||
                              (isSubmitting && quiz.id === singleQuizId ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                              ) : null)}
                            <Pencil height={15} width={15} />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4} className="text-primary">
                      Final total marks
                    </TableCell>
                    <TableCell className="text-right text-primary">
                      {TotalObtainedMarks}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
