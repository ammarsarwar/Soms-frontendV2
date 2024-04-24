"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatISO, parseISO } from "date-fns";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState, useTransition } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { motion, useTransform } from "framer-motion";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDate } from "@/components/calendarComponent/custom-calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getBranchesForAdmission,
  getCampusForAdmission,
  getGradesForAdmission,
  getSlotsForAdmission,
  getTimesForAdmission,
  postApplication,
} from "@/server/application/action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ApplicationDataSchema,
  TApplicationDataSchema,
  TBranchSchemaExtended,
  TCampusSchemaExtended,
  TGradeListForAdmissionsSchema,
  TTimeSlotsForAdmissionsSchema,
} from "@/schemas";
import { Progress } from "@/components/ui/progress";

function extractDepartment(
  gradeList: TGradeListForAdmissionsSchema[],
  applied_grade_id: string
): number | undefined {
  const matchingGrade = gradeList.find(
    (grade) => grade.id === Number(applied_grade_id)
  );
  return matchingGrade?.department;
}

const NewApplicationPage = ({}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(0);
  const [date, setDate] = useState<Date>();
  const delta = currentStep - previousStep;
  //states
  const [branches, setBranches] = useState<TBranchSchemaExtended[]>([]);
  const [isBranchLoading, setIsBranchLoading] = useState(false);
  const [gradelist, setGradeList] = useState<TGradeListForAdmissionsSchema[]>(
    []
  );
  const [campuses, setCampuses] = useState<TCampusSchemaExtended[]>([]);
  const [isCampusLoading, setIsCampusLoading] = useState(false);

  const [selectedCampusObj, setSelectedCampusObj] =
    useState<TCampusSchemaExtended | null>(null);

  const [selectedGradeObj, setSelectedGradeObj] =
    useState<TGradeListForAdmissionsSchema | null>(null);

  const [selectedBranchObj, setSelectedBranchObj] =
    useState<TBranchSchemaExtended | null>(null);

  const [isGradeLoading, setIsGradeLoading] = useState(false);
  const [slotList, setSlotList] = useState<TTimeSlotsForAdmissionsSchema[]>([]);
  const [isSlotLoading, setIsSlotLoading] = useState(false);
  const [timeList, setTimeList] = useState<TTimeSlotsForAdmissionsSchema[]>([]);
  const [isTimeLoading, setIsTimeLoading] = useState(false);
  const [selectedTimeSlotObj, setSelectedTimeSlotObj] =
    useState<TTimeSlotsForAdmissionsSchema | null>(null);

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState(false);
  const isMounted = useRef(true);

  //highlighted dates logic starts here
  const [booked, setBooked] = useState(false);

  let bookedDays: Date[] = [];
  slotList.forEach((slot) => {
    const date = new Date(slot.date);
    bookedDays.push(
      new Date(date.getFullYear(), date.getMonth(), date.getDate())
    );
  });

  // bookedDays = [new Date(2024, 3, 19), new Date(2024, 3, 21)];
  console.log(bookedDays);
  const bookedStyle = { border: "2px solid black" };

  //highlighted dates logic end  here

  //rhf
  const {
    reset,
    register,
    getValues,
    handleSubmit,
    trigger,
    watch,
    control,
    clearErrors,
    setError,
    setValue,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<TApplicationDataSchema>({
    resolver: zodResolver(ApplicationDataSchema),
    mode: "onChange",
  });

  // tracking the change of grade and branch selection
  const selectedCampus = watch("applied_campus");
  const selectedBranch = watch("applied_branch");
  const selectedGrade = watch("applied_grade");
  const isCoEduTrue = watch("isCoEduSelected");
  const selectedGender = watch("student_gender");

  //fetch branches when we have the user array

  useEffect(() => {
    const branchObj = branches.find(
      (branch) => branch.id === Number(selectedBranch)
    );
    setSelectedBranchObj(branchObj || null);
  }, [selectedBranch, branches]);

  useEffect(() => {
    const listOfBranches = async () => {
      try {
        setIsBranchLoading(true);
        const res = await getBranchesForAdmission();
        console.log("branches after fethc", res);
        setBranches(res);
        setIsBranchLoading(false);
      } catch (error) {
        console.error("error", error);
        alert("error fetching branches");
        setIsBranchLoading(false);
      } finally {
        setIsBranchLoading(false);
      }
    };

    listOfBranches();
  }, []);

  //fetch campuses when branch is selected
  useEffect(() => {
    const campusObj = campuses.find(
      (campus) => campus.id === Number(selectedCampus)
    );
    setSelectedCampusObj(campusObj || null);
  }, [selectedCampus, campuses]);

  useEffect(() => {
    if (
      !isMounted.current &&
      branches.length > 0 &&
      getValues("applied_branch") != ""
    ) {
      const listOfCampus = async () => {
        const branchId = getValues("applied_branch");

        const data = {
          branch: Number(branchId),
        };
        console.log(data);

        try {
          setIsCampusLoading(true);
          const res = await getCampusForAdmission(data);
          setCampuses(res);
          setIsCampusLoading(false);
        } catch (error) {
          console.error("error", error);
          alert("error fetching branches");
          setIsCampusLoading(false);
        } finally {
          setIsCampusLoading(false);
        }
      };

      listOfCampus();
    }
    isMounted.current = false;
  }, [selectedBranch]);

  useEffect(() => {
    const gradeObj = gradelist.find(
      (grade) => grade.id === Number(selectedGrade)
    );
    setSelectedGradeObj(gradeObj || null);
  }, [selectedGrade, gradelist]);

  //fetch grades when we have the branch
  useEffect(() => {
    if (
      !isMounted.current &&
      campuses.length > 0 &&
      getValues("applied_campus") != ""
    ) {
      const listOfGrades = async () => {
        const campusId = getValues("applied_campus");

        const data = {
          campus: Number(campusId),
        };
        console.log(data);

        try {
          setIsGradeLoading(true);
          const res = await getGradesForAdmission(data);
          setGradeList(res);
          setIsGradeLoading(false);
        } catch (error) {
          console.error("error", error);
          alert("error fetching branches");
          setIsGradeLoading(false);
        } finally {
          setIsGradeLoading(false);
        }
      };

      listOfGrades();
    }
    isMounted.current = false;
  }, [selectedCampus]);

  //fetch test slots when we have the grade
  useEffect(() => {
    if (
      !isMounted.current &&
      gradelist.length > 0 &&
      getValues("applied_grade") != ""
    ) {
      const listOfSlots = async () => {
        const gradeId = getValues("applied_grade");
        const deptId = extractDepartment(gradelist, gradeId);
        // alert(deptId);
        try {
          setIsSlotLoading(true);
          const res = await getSlotsForAdmission(deptId);
          if (res === undefined) {
            setIsSlotLoading(false);
            return null;
          } else {
            console.log("slots found", res);
            setSlotList(res);
            setIsSlotLoading(false);
          }
        } catch (error) {
          console.error("error", error);
          alert("error fetching grades");
          setIsSlotLoading(false);
        } finally {
          setIsSlotLoading(false);
        }
      };

      listOfSlots();
    }
    isMounted.current = false;
  }, [selectedGrade]);

  useEffect(() => {
    const timeSlotObj = timeList.find(
      (timeSlot) => timeSlot.id === Number(getValues("scheduled_test"))
    );
    setSelectedTimeSlotObj(timeSlotObj || null);
  }, [getValues("scheduled_test"), timeList]);
  const formattedDate = selectedTimeSlotObj?.date
    ? format(parseISO(selectedTimeSlotObj.date), "MMM dd, yyyy")
    : "";

  // Example time formatting - remove seconds from time
  const formattedStartTime = selectedTimeSlotObj?.start_time
    ? selectedTimeSlotObj.start_time.substr(0, 5)
    : "";
  const formattedEndTime = selectedTimeSlotObj?.end_time
    ? selectedTimeSlotObj.end_time.substr(0, 5)
    : "";

  //fetch times slots when we have the grade
  useEffect(() => {
    if (!isMounted.current && slotList.length > 0 && date) {
      const newDate = format(date, "yyyy-MM-dd");
      const gradeId = getValues("applied_grade");
      const deptId = extractDepartment(gradelist, gradeId);
      const listOfTimes = async () => {
        try {
          setIsTimeLoading(true);
          const res = await getTimesForAdmission(newDate, deptId);
          if (res === undefined) {
            setIsTimeLoading(false);
            return null;
          } else {
            setTimeList(res);
            setIsTimeLoading(false);
          }
        } catch (error) {
          console.error("error", error);
          alert("error fetching grades");
          setIsTimeLoading(false);
        } finally {
          setIsTimeLoading(false);
        }
      };

      listOfTimes();
    }
    isMounted.current = false;
  }, [date]);

  // steps
  const steps = [
    {
      id: "Step 1",
      name: "Parent Information",
      fields: [
        "parent_name_english",
        "parent_name_arabic",
        "parent_email",
        "parent_national_id",
        "parent_phone_number",
        "emergency_phone_number",
        "relation_to_child",
      ],
    },
    {
      id: "Step 2",
      name: "Student Information",
      fields: [
        "student_first_name_english",
        "student_middle_name_english",
        "student_last_name_english",
        "student_first_name_arabic",
        "student_middle_name_arabic",
        "student_last_name_arabic",
        "student_gender",
        "student_national_id",
        "student_date_of_birth",
      ],
    },
    {
      id: "Step 3",
      name: "Branch & Grade",
      fields: ["applied_branch", "applied_grade", "isCoEduSelected"],
    },
    {
      id: "Step 4",
      name: "Book Your Placement Test",
      fields: ["scheduled_test"],
    },
    {
      id: "Step 5",
      name: "Please Review Your Information",
    },
    { id: "Step 6", name: "Application Complete √" },
  ];

  const processForm: SubmitHandler<TApplicationDataSchema> = async (values) => {
    startTransition(() => {
      postApplication(values).then((data) => {
        if (data.success) {
          toast.success(data.success);
          reset();
        } else {
          toast.error(data.error);
          setErrorMsg(true);
        }
      });
    });
  };

  //next and prev functions
  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(
      fields as Array<keyof TApplicationDataSchema>,
      {
        shouldFocus: false,
      }
    );

    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await handleSubmit(processForm)();
      }
      setPreviousStep(currentStep);
      setCurrentStep(currentStep + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep(currentStep - 1);
    }
  };

  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setValue("student_national_id", "", { shouldValidate: false });

    clearErrors("student_national_id");
  };

  const reviewStepIndex = steps.length - 2; // Second-to-last step, for "Please Review Your Information"
  const completeStepIndex = steps.length - 1; // Last step, for "Application Complete √"
  let progress = (currentStep / reviewStepIndex) * 100; // Ensure full progress at the review step
  progress = progress > 100 ? 100 : progress; // Cap the progress at 100%

  const [currentYear] = useState(new Date().getFullYear());
  return (
    <main className="h-screen w-full flex flex-col">
      <div className="w-full h-16 flex items-center pl-8">
        <Image src="/Logo.svg" height={150} width={150} alt="soms" />
      </div>
      <div className="w-full h-full flex items-center justify-center">
        <div className="border border-slate-200 shadow-sm rounded-sm w-[50rem] h-[38rem] flex flex-col p-8 gap-2">
          <div>
            {/* Step {currentStep} of 5 */}
            {currentStep < completeStepIndex && (
              <>
                <div className="w-full flex justify-center py-4">
                  <Progress value={progress} className="w-full" />
                </div>
                {/* <span className="text-lg font-bold flex justify-center">
                  {Math.round(progress)}%
                </span> */}
              </>
            )}

            <div className="flex flex-col py-2">
              <p className="text-2xl font-bold">{steps[currentStep].name}</p>
              <p className="text-sm text-muted-foreground">
                {/* {steps[currentStep].name === "Parent Information"
                  ? "Lets start by giving parent/guardian information."
                  : steps[currentStep].name === "Student Information"
                  ? "Great, Now please give us student information."
                  : steps[currentStep].name === "Preferred branch & grade"
                  ? "Good job! Please select your preffered branch and grade"
                  : steps[currentStep].name === "Test slot"
                  ? "An onsite admission test is mandatory to take admission, Please select a time slot from the calender"
                  : steps[currentStep].name === "Review"
                  ? "Please review all the information before submitting the application"
                  : steps[currentStep].name === "Status"
                  ? "Please confirm that your application is submitted. Try again later if something went wrong"
                  : null} */}
              </p>
            </div>
          </div>
          <div className="overflow-scroll-y no-scrollbar cursor-pointer h-[400px] overflow-hidden">
            <ScrollArea className="relative h-full">
              <div>
                <form
                  className="mt-8 pl-8 pr-8"
                  onSubmit={handleSubmit(processForm)}
                >
                  {/* Step 1: Personal Information */}
                  {currentStep === 0 && (
                    <motion.div
                      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="grid gap-3">
                          <Label htmlFor="parent_name_english">
                            Parent/Guardian Name (English)
                          </Label>
                          <div className="flex flex-col gap-2">
                            <Input
                              id="parent_name_english"
                              placeholder=""
                              type="text"
                              autoCapitalize="none"
                              autoComplete="off"
                              autoCorrect="off"
                              {...register("parent_name_english")}
                              disabled={isLoading || isSubmitting || isPending}
                            />
                            {errors.parent_name_english && (
                              <small className="text-red-500 font-bold">
                                {errors.parent_name_english?.message}
                              </small>
                            )}
                          </div>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="parent_name_arabic">
                            Parent/Guardian Name (Arabic)
                          </Label>
                          <div className="flex flex-col gap-2">
                            <Input
                              id="parent_name_arabic"
                              placeholder=""
                              type="text"
                              autoCapitalize="none"
                              autoComplete="off"
                              autoCorrect="off"
                              {...register("parent_name_arabic")}
                              disabled={isLoading || isSubmitting || isPending}
                            />
                            {errors.parent_name_arabic && (
                              <small className="text-red-500 font-bold">
                                {errors.parent_name_arabic?.message}
                              </small>
                            )}
                          </div>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="parent_email">Parent Email</Label>
                          <div className="flex flex-col gap-2">
                            <Input
                              id="parent_email"
                              placeholder=""
                              type="text"
                              autoCapitalize="none"
                              autoComplete="off"
                              autoCorrect="off"
                              {...register("parent_email")}
                              disabled={isLoading || isSubmitting || isPending}
                            />
                            {errors.parent_email && (
                              <small className="text-red-500 font-bold">
                                {errors.parent_email?.message}
                              </small>
                            )}
                          </div>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="parent_national_id">
                            Parent National ID
                          </Label>
                          <div className="flex flex-col gap-2">
                            <Input
                              id="parent_national_id"
                              placeholder=""
                              type="text"
                              autoCapitalize="none"
                              autoComplete="off"
                              autoCorrect="off"
                              {...register("parent_national_id")}
                              disabled={isLoading || isSubmitting || isPending}
                            />
                            {errors.parent_national_id && (
                              <small className="text-red-500 font-bold">
                                {errors.parent_national_id?.message}
                              </small>
                            )}
                          </div>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="parent_phone_number">
                            Parent Phone Number
                          </Label>
                          <div className="flex flex-col gap-2">
                            <Input
                              id="parent_phone_number"
                              placeholder=""
                              type="text"
                              autoCapitalize="none"
                              autoComplete="off"
                              autoCorrect="off"
                              {...register("parent_phone_number")}
                              disabled={isLoading || isSubmitting || isPending}
                            />
                            {errors.parent_phone_number && (
                              <small className="text-red-500 font-bold">
                                {errors.parent_phone_number?.message}
                              </small>
                            )}
                          </div>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="emergency_phone_number">
                            Emergency Phone Number
                          </Label>
                          <div className="flex flex-col gap-2">
                            <Input
                              id="emergency_phone_number"
                              placeholder=""
                              type="text"
                              autoCapitalize="none"
                              autoComplete="off"
                              autoCorrect="off"
                              {...register("emergency_phone_number")}
                              disabled={isLoading || isSubmitting || isPending}
                            />
                            {errors.emergency_phone_number && (
                              <small className="text-red-500 font-bold">
                                {errors.emergency_phone_number?.message}
                              </small>
                            )}
                          </div>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="relation_to_child">
                            Relation to Child
                          </Label>
                          <div className="flex flex-col gap-2">
                            {/* <Input
                                id="relation_to_child"
                                placeholder="Enter the relation"
                                type="text"
                                autoCapitalize="none"
                                autoComplete="off"
                                autoCorrect="off"
                                {...register("relation_to_child")}
                                disabled={isLoading || isSubmitting}
                              /> */}
                            <Controller
                              name="relation_to_child"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  disabled={
                                    isLoading || isSubmitting || isPending
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a relation" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                                      <SelectLabel>Relations</SelectLabel>
                                      <SelectItem value="Parent">
                                        Parent
                                      </SelectItem>
                                      <SelectItem value="Guardian">
                                        Guardian
                                      </SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.relation_to_child && (
                              <small className="text-red-500 font-bold">
                                {errors.relation_to_child?.message}
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Student information */}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="grid grid-cols-1 gap-6 mb-8">
                        <div className="grid gap-3">
                          <Label htmlFor="student_first_name_english">
                            Student First Name (English)
                          </Label>
                          <div className="flex flex-col gap-2">
                            <Input
                              id="student_first_name_english"
                              placeholder=""
                              type="text"
                              autoCapitalize="none"
                              autoComplete="off"
                              autoCorrect="off"
                              {...register("student_first_name_english")}
                              disabled={isLoading || isSubmitting || isPending}
                            />
                            {errors.student_first_name_english && (
                              <small className="text-red-500 font-bold">
                                {errors.student_first_name_english?.message}
                              </small>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid gap-3">
                            <Label htmlFor="student_middle_name_english">
                              Student Middle Name (English)
                            </Label>
                            <div className="flex flex-col gap-2">
                              <Input
                                id="student_middle_name_english"
                                placeholder=""
                                type="text"
                                autoCapitalize="none"
                                autoComplete="off"
                                autoCorrect="off"
                                {...register("student_middle_name_english")}
                                disabled={
                                  isLoading || isSubmitting || isPending
                                }
                              />
                              {errors.student_middle_name_english && (
                                <small className="text-red-500 font-bold">
                                  {errors.student_middle_name_english?.message}
                                </small>
                              )}
                            </div>
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="student_last_name_english">
                              Student Last Name (English)
                            </Label>
                            <div className="flex flex-col gap-2">
                              <Input
                                id="student_last_name_english"
                                placeholder=""
                                type="text"
                                autoCapitalize="none"
                                autoComplete="off"
                                autoCorrect="off"
                                {...register("student_last_name_english")}
                                disabled={
                                  isLoading || isSubmitting || isPending
                                }
                              />
                              {errors.student_last_name_english && (
                                <small className="text-red-500 font-bold">
                                  {errors.student_last_name_english?.message}
                                </small>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="student_first_name_arabic">
                            Student First Name (Arabic)
                          </Label>
                          <div className="flex flex-col gap-2">
                            <Input
                              id="student_first_name_arabic"
                              placeholder=""
                              type="text"
                              autoCapitalize="none"
                              autoComplete="off"
                              autoCorrect="off"
                              {...register("student_first_name_arabic")}
                              disabled={isLoading || isSubmitting || isPending}
                            />
                            {errors.student_first_name_arabic && (
                              <small className="text-red-500 font-bold">
                                {errors.student_first_name_arabic?.message}
                              </small>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid gap-3">
                            <Label htmlFor="student_middle_name_arabic">
                              Student Middle Name (Arabic)
                            </Label>
                            <div className="flex flex-col gap-2">
                              <Input
                                id="student_middle_name_arabic"
                                placeholder=""
                                type="text"
                                autoCapitalize="none"
                                autoComplete="off"
                                autoCorrect="off"
                                {...register("student_middle_name_arabic")}
                                disabled={
                                  isLoading || isSubmitting || isPending
                                }
                              />
                              {errors.student_middle_name_arabic && (
                                <small className="text-red-500 font-bold">
                                  {errors.student_middle_name_arabic?.message}
                                </small>
                              )}
                            </div>
                          </div>

                          <div className="grid gap-3">
                            <Label htmlFor="student_last_name_arabic">
                              Student Last Name (Arabic)
                            </Label>
                            <div className="flex flex-col gap-2">
                              <Input
                                id="student_last_name_arabic"
                                placeholder=""
                                type="text"
                                autoCapitalize="none"
                                autoComplete="off"
                                autoCorrect="off"
                                {...register("student_last_name_arabic")}
                                disabled={
                                  isLoading || isSubmitting || isPending
                                }
                              />
                              {errors.student_last_name_arabic && (
                                <small className="text-red-500 font-bold">
                                  {errors.student_last_name_arabic?.message}
                                </small>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid gap-3">
                            <Label htmlFor="country">
                              Country of Residency
                            </Label>
                            <div className="flex flex-col gap-2">
                              <Select onValueChange={handleCountryChange}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Countries</SelectLabel>
                                    <SelectItem value="saudi">Saudi</SelectItem>
                                    <SelectItem value="bahrain">
                                      Bahrain
                                    </SelectItem>
                                    <SelectItem value="qatar">Qatar</SelectItem>
                                    <SelectItem value="kuwait">
                                      Kuwait
                                    </SelectItem>
                                    <SelectItem value="oman">Oman</SelectItem>
                                    <SelectItem value="uae">UAE</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="student_national_id">
                              Residency ID
                            </Label>
                            <div className="flex flex-col gap-2">
                              <Input
                                id="student_national_id"
                                placeholder=""
                                type="text"
                                autoCapitalize="none"
                                autoComplete="off"
                                autoCorrect="off"
                                {...register("student_national_id", {
                                  required: "National ID is required",
                                })}
                                disabled={
                                  isLoading || isSubmitting || isPending
                                }
                              />
                              {errors.student_national_id && (
                                <small className="text-red-500 font-bold">
                                  {errors.student_national_id.message}
                                </small>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid gap-3">
                            <Label htmlFor="student_date_of_birth">
                              Date Of Birth
                            </Label>
                            <div className="flex flex-col gap-2">
                              {/* <Input
                                id="student_date_of_birth"
                                placeholder=""
                                type="text"
                                autoCapitalize="none"
                                autoComplete="off"
                                autoCorrect="off"
                                {...register("student_date_of_birth")}
                                disabled={
                                  isLoading || isSubmitting || isPending
                                }
                              /> */}
                              <Controller
                                name="student_date_of_birth"
                                control={control}
                                rules={{
                                  required: "Student birth date is required",
                                }}
                                render={({ field }) => (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "pl-3 text-left font-normal",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        {field.value &&
                                        !isNaN(Date.parse(field.value)) ? (
                                          format(
                                            parseISO(field.value),
                                            "yyyy-MM-dd"
                                          )
                                        ) : (
                                          <span>Pick a date</span>
                                        )}

                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <CalendarDate
                                        mode="single"
                                        captionLayout="dropdown-buttons"
                                        selected={
                                          field.value &&
                                          !isNaN(Date.parse(field.value))
                                            ? parseISO(field.value)
                                            : undefined
                                        }
                                        onSelect={(date) =>
                                          field.onChange(
                                            date
                                              ? formatISO(date, {
                                                  representation: "date",
                                                })
                                              : ""
                                          )
                                        }
                                        initialFocus
                                        fromYear={currentYear - 100}
                                        toYear={currentYear}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                )}
                              />
                              {errors.student_date_of_birth && (
                                <small className="text-red-500 font-bold">
                                  {errors.student_date_of_birth.message}
                                </small>
                              )}
                            </div>
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="gender">Gender</Label>
                            <div className="flex flex-col gap-2">
                              <Controller
                                name="student_gender"
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={
                                      isLoading || isSubmitting || isPending
                                    }
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                                        <SelectLabel>Gender</SelectLabel>
                                        <SelectItem value="Male">
                                          Male
                                        </SelectItem>
                                        <SelectItem value="Female">
                                          Female
                                        </SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                              {errors.student_gender && (
                                <small className="text-red-500 font-bold">
                                  {errors.student_gender?.message}
                                </small>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Branch Selection */}
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="grid grid-cols-1 gap-6">
                        {/* <div className="grid gap-3">
                          <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-primary border-dashed p-4">
                            <Controller
                              name="isCoEduSelected"
                              control={control}
                              render={({ field }) => (
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              )}
                            />
                            <div className="space-y-1 leading-none">
                              <Label>
                                Do you want your child to study in our mixed
                                (Boys & Girls) / Co Education campus
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                By selecting this you can only see grades from a
                                Co education campus
                              </p>
                            </div>
                          </div>
                        </div> */}
                        <div className="grid gap-3">
                          <Label htmlFor="branch">Select Branch</Label>
                          <div className="flex flex-col gap-2">
                            <Controller
                              name="applied_branch"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    // Find and set the selected branch object
                                    const selectedBranch = branches.find(
                                      (branch) => `${branch.id}` === value
                                    );
                                    setSelectedBranchObj(
                                      selectedBranch || null
                                    );
                                  }}
                                  defaultValue={field.value}
                                  disabled={
                                    isLoading ||
                                    isSubmitting ||
                                    isPending ||
                                    isBranchLoading ||
                                    branches.length < 1
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue
                                      placeholder={
                                        isBranchLoading
                                          ? "Loading branches"
                                          : branches.length < 1
                                          ? "No branches found"
                                          : "Select a branch"
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                                      <SelectLabel>branches</SelectLabel>
                                      {branches.length === 0 && (
                                        <span>No branch found</span>
                                      )}
                                      {branches?.map((branch, index) => {
                                        return (
                                          <SelectItem
                                            key={index}
                                            value={`${branch.id}`}
                                          >
                                            {branch.name}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              )}
                            />

                            {errors.applied_branch && (
                              <small className="text-red-500 font-bold">
                                {errors.applied_branch?.message}
                              </small>
                            )}
                          </div>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="grade">Select Campus</Label>
                          <div className="flex flex-col gap-2">
                            <Controller
                              name="applied_campus"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    const selectedCampus = campuses.find(
                                      (campus) => `${campus.id}` === value
                                    );
                                    setSelectedCampusObj(
                                      selectedCampus || null
                                    );
                                  }}
                                  defaultValue={field.value}
                                  disabled={
                                    isLoading ||
                                    isPending ||
                                    isSubmitting ||
                                    isCampusLoading ||
                                    campuses.length < 1
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue
                                      placeholder={
                                        isCampusLoading
                                          ? "Loading campuses"
                                          : campuses.length < 1
                                          ? "No campus found"
                                          : "Select a campus"
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                                      <SelectLabel>Campus</SelectLabel>
                                      {campuses.length === 0 && (
                                        <span>No campus found</span>
                                      )}
                                      {campuses?.map((campus, index) => {
                                        return (
                                          <SelectItem
                                            key={index}
                                            value={`${campus.id}`}
                                          >
                                            {campus.name}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              )}
                            />

                            {errors.applied_campus && (
                              <small className="text-red-500 font-bold">
                                {errors.applied_campus?.message}
                              </small>
                            )}
                          </div>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="grade">Select Grade</Label>
                          <div className="flex flex-col gap-2">
                            <Controller
                              name="applied_grade"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    const selectedGrade = gradelist.find(
                                      (grade) => `${grade.id}` === value
                                    );
                                    setSelectedGradeObj(selectedGrade || null);
                                  }}
                                  defaultValue={field.value}
                                  disabled={
                                    isLoading ||
                                    isPending ||
                                    isSubmitting ||
                                    isGradeLoading ||
                                    gradelist.length < 1
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue
                                      placeholder={
                                        isGradeLoading
                                          ? "Loading grades"
                                          : gradelist.length < 1
                                          ? "No grade found"
                                          : "Select a grade"
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                                      <SelectLabel>grade</SelectLabel>
                                      {gradelist.length === 0 && (
                                        <span>No grade found</span>
                                      )}
                                      {gradelist?.map((grade, index) => {
                                        return (
                                          <SelectItem
                                            key={index}
                                            value={`${grade.id}`}
                                          >
                                            {grade.name}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              )}
                            />

                            {errors.applied_grade && (
                              <small className="text-red-500 font-bold">
                                {errors.applied_grade?.message}
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 5: preffered school */}
                  {currentStep === 3 && (
                    <motion.div
                      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="grid grid-cols-1 gap-6 ">
                        <div className="grid gap-2">
                          <Label htmlFor="slot">Select test slot</Label>
                          {slotList.length === 0 ? null : (
                            <small className="text-sm text-muted-foreground">
                              Test slots are assigned on first come first serve
                              basis. Admission are open from{" "}
                              <strong>
                                {slotList[0].admission_calendar.start_date} to{" "}
                                {slotList[0].admission_calendar.end_date}
                              </strong>
                              . Please make sure to book a slot before deadline
                            </small>
                          )}
                          <div className="flex justify-center gap-8 mt-8">
                            {slotList.length === 0 ? (
                              <p>no slots available for this grade</p>
                            ) : (
                              <>
                                <div>
                                  <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    modifiers={{ booked: bookedDays }}
                                    modifiersStyles={{
                                      booked: { border: "2px solid black" },
                                    }}
                                    className="rounded-md border"
                                    disabled={(date) => {
                                      const startDate = new Date(
                                        slotList[0].admission_calendar.start_date
                                      );
                                      const endDate = new Date(
                                        slotList[0].admission_calendar.end_date
                                      );
                                      const today = new Date();
                                      today.setHours(0, 0, 0, 0); // Normalize today to the start of the day

                                      return (
                                        date > endDate ||
                                        date < startDate ||
                                        date < today // Add this condition to disable past dates
                                      );
                                    }}
                                  />

                                  {/* <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="rounded-md border"
                                    disabled={(date) =>
                                      date >
                                        new Date(
                                          slotList[0].admission_calendar.end_date
                                        ) ||
                                      date <
                                        new Date(
                                          slotList[0].admission_calendar.start_date
                                        )
                                    }
                                  /> */}
                                </div>
                                <div className="border border-muted shadow-sm rounded-md w-[500px]">
                                  <p className="flex w-full justify-center mt-4">
                                    Pick a time
                                  </p>
                                  {timeList.length === 0 ? (
                                    <div className="flex gap-2 justify-center items-center w-full h-full">
                                      <p>No slots found</p>
                                    </div>
                                  ) : isTimeLoading ? (
                                    <div className="flex gap-2 justify-center items-center w-full h-full">
                                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                      <p>Loading time slots</p>
                                    </div>
                                  ) : (
                                    <div className="p-8 overflow-y-scroll no-scrollbar">
                                      {timeList.map((time, index) => {
                                        return (
                                          <Controller
                                            key={time.id}
                                            name="scheduled_test"
                                            control={control}
                                            render={({ field }) => (
                                              <RadioGroup
                                                defaultValue={field.value}
                                                onValueChange={(value) => {
                                                  field.onChange(value);
                                                  const selectedTimeSlot =
                                                    timeList.find(
                                                      (timeSlot) =>
                                                        `${timeSlot.id}` ===
                                                        value
                                                    );
                                                  setSelectedTimeSlotObj(
                                                    selectedTimeSlot || null
                                                  );
                                                }}
                                                className="flex gap-2"
                                              >
                                                <div>
                                                  <RadioGroupItem
                                                    value={`${time.id}`}
                                                    className="peer sr-only"
                                                    id={`${time.id}`}
                                                  />

                                                  <Label
                                                    htmlFor={`${time.id}`}
                                                    className="flex flex-col items-center gap-4 justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                  >
                                                    {time.start_time.slice(
                                                      0,
                                                      5
                                                    )}
                                                  </Label>
                                                </div>
                                              </RadioGroup>
                                            )}
                                          />
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                                {errors.scheduled_test && (
                                  <small className="text-red-500 font-bold">
                                    {errors.scheduled_test?.message}
                                  </small>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 5: Review = */}
                  {currentStep === 4 && (
                    <motion.div
                      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>
                            Parent / Guardian Information
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="grid gap-3">
                                <span className="text-sm text-muted-foreground font-bold">
                                  Parent name (english)
                                </span>
                                <small className="text-sm text-muted-foreground">
                                  {getValues("parent_name_english")}
                                </small>
                              </div>
                              <div className="grid gap-3">
                                <span className="text-sm text-muted-foreground font-bold">
                                  Parent name (arabic)
                                </span>
                                <small className="text-sm text-muted-foreground">
                                  {getValues("parent_name_arabic")}
                                </small>
                              </div>
                              <div className="grid gap-3">
                                <span className="text-sm text-muted-foreground font-bold">
                                  Parent email
                                </span>
                                <small className="text-sm text-muted-foreground">
                                  {getValues("parent_email")}
                                </small>
                              </div>
                              <div className="grid gap-3">
                                <span className="text-sm text-muted-foreground font-bold">
                                  Parent phone #
                                </span>
                                <small className="text-sm text-muted-foreground">
                                  {getValues("parent_phone_number")}
                                </small>
                              </div>
                              <div className="grid gap-3">
                                <span className="text-sm text-muted-foreground font-bold">
                                  Emergency phone #
                                </span>
                                <small className="text-sm text-muted-foreground">
                                  {getValues("emergency_phone_number")}
                                </small>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                          <AccordionTrigger>
                            Student Information
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="grid gap-3">
                                <span className="text-sm text-muted-foreground font-bold">
                                  Student First Name (English)
                                </span>
                                <small className="text-sm text-muted-foreground">
                                  {getValues("student_first_name_english")}
                                </small>
                              </div>
                              <div className="grid gap-3">
                                <span className="text-sm text-muted-foreground font-bold">
                                  Student Middle Name (English)
                                </span>
                                <small className="text-sm text-muted-foreground">
                                  {getValues("student_middle_name_english")}
                                </small>
                              </div>
                              <div className="grid gap-3">
                                <span className="text-sm text-muted-foreground font-bold">
                                  Student Last Name (English)
                                </span>
                                <small className="text-sm text-muted-foreground">
                                  {getValues("student_last_name_english")}
                                </small>
                              </div>
                              <div className="grid gap-3">
                                <span className="text-sm text-muted-foreground font-bold">
                                  Student First Name (Arabic)
                                </span>
                                <small className="text-sm text-muted-foreground">
                                  {getValues("student_first_name_arabic")}
                                </small>
                              </div>
                              <div className="grid gap-3">
                                <span className="text-sm text-muted-foreground font-bold">
                                  Student Middle Name (Arabic)
                                </span>
                                <small className="text-sm text-muted-foreground">
                                  {getValues("student_middle_name_arabic")}
                                </small>
                              </div>
                              <div className="grid gap-3">
                                <span className="text-sm text-muted-foreground font-bold">
                                  Student Last Name (Arabic)
                                </span>
                                <small className="text-sm text-muted-foreground">
                                  {getValues("student_last_name_arabic")}
                                </small>
                              </div>
                              <div className="grid gap-3">
                                <span className="text-sm text-muted-foreground font-bold">
                                  Residency ID
                                </span>
                                <small className="text-sm text-muted-foreground">
                                  {getValues("student_national_id")}
                                </small>
                              </div>
                              <div className="grid gap-3">
                                <span className="text-sm text-muted-foreground font-bold">
                                  Student Gender
                                </span>
                                <small className="text-sm text-muted-foreground">
                                  {getValues("student_gender")}
                                </small>
                              </div>
                              <div className="grid gap-3">
                                <span className="text-sm text-muted-foreground font-bold">
                                  Student Date Of Birth
                                </span>
                                <small className="text-sm text-muted-foreground">
                                  {getValues("student_date_of_birth")}
                                </small>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                          <AccordionTrigger>
                            Branch, Campus & Grade
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="grid gap-3">
                                <span className="text-sm text-muted-foreground font-bold">
                                  Branch
                                </span>
                                <small className="text-sm text-muted-foreground">
                                  {selectedBranchObj?.name}
                                </small>
                              </div>
                              <div className="grid gap-3">
                                <span className="text-sm text-muted-foreground font-bold">
                                  Campus
                                </span>
                                <small className="text-sm text-muted-foreground">
                                  {selectedCampusObj?.name}
                                </small>
                              </div>
                              <div className="grid gap-3">
                                <span className="text-sm text-muted-foreground font-bold">
                                  Grade
                                </span>
                                <small className="text-sm text-muted-foreground">
                                  {selectedGradeObj?.name}
                                </small>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-4">
                          <AccordionTrigger>Placement Test</AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="grid gap-3">
                                <span className="text-sm text-muted-foreground font-bold">
                                  Placement Test
                                </span>
                                <small className="text-sm text-muted-foreground">
                                  {`${formattedStartTime} - ${formattedEndTime} ${formattedDate}`}
                                </small>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </motion.div>
                  )}

                  {/* Step 6: Complete */}
                  {currentStep === 5 && (
                    <motion.div
                      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {errorMsg ? (
                        <div className="w-full h-full flex flex-col justify-center items-center mt-32 text-center">
                          <h1>Application Failed!</h1>
                          <p>Something went wrong, Please try again later</p>
                        </div>
                      ) : isPending ? (
                        <div className="w-full h-full flex flex-col justify-center items-center mt-8">
                          <Icons.spinner className="h-12 w-12 animate-spin" />
                          <div className="text-center">
                            <h1>Submitting your application</h1>
                            <p>
                              Please wait while we are processing your
                              application
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col justify-center items-center gap-8">
                          <Image
                            src="/application.svg"
                            alt="Success"
                            height={150}
                            width={150}
                          />
                          <div className="text-center">
                            <h1>Application submitted!</h1>
                            <p>
                              Please check your inbox for placement test
                              information
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </form>
              </div>
            </ScrollArea>
          </div>
          <div className="flex justify-between">
            <Button
              type="button"
              onClick={prev}
              disabled={currentStep === 0 || currentStep === steps.length - 1}
              variant={"outline"}
            >
              Previous
            </Button>
            <Button
              type="button"
              onClick={next}
              disabled={currentStep === steps.length - 1}
              variant={"default"}
            >
              {isLoading ||
                (isSubmitting && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ))}
              {currentStep === steps.length - 1
                ? "Submitted"
                : currentStep === steps.length - 2
                ? "Submit"
                : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NewApplicationPage;
