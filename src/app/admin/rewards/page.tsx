"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getSkillsByReward } from "@/server/rewards/actions";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import { useForm, Controller } from "react-hook-form";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSelectedLessonsBySection } from "@/server/lessonManagement/lesson/action";
import SkillsList from "@/components/rewards/skills/SkillsList";
import { getRewards, getSkills } from "@/server/rewards/actions";
import { Reward } from "@/components/rewards/data/studentRewardSchema";
import { Skills } from "@/components/rewards/skills/data/schema";
import { addSkillRewards } from "@/server/rewards/actions";
import { postRewards } from "@/server/rewards/actions";

import { getStudentRewardByCourse } from "@/server/rewards/actions";
import { getRewardsById } from "@/server/rewards/actions";
import { Icons } from "@/components/ui/icons";
import { resetReward } from "@/server/rewards/actions";
import { getBranches } from "@/server/branch/actions";

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
  TAssignedLessonsSchema,
} from "@/schemas";

interface IFormSchema {
  branchName: string;
  campusName: string;
  deptName: string;
  gradeName: string;
  secName: string;
  lessonName: string;
}
const Rewards = () => {
  const { data: session, status } = useSession();

  const [lessons, setLessons] = useState<TAssignedLessonsSchema[]>([]);
  const [isRewardingSkills, setIsRewardingSkills] = useState(false);

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [courseRewards, setCourseRewards] = useState<Reward[]>([]);
  const [allSkills, setAllSkills] = useState<Skills[]>([]);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [studentSkills, setStudentSkills] = useState<{
    [key: string]: Skills[];
  }>({});
  const [rewardAvatars, setRewardAvatars] = useState<{ [id: number]: string }>(
    {}
  );
  type AvatarMap = { [id: number]: string };
  const [avatarsInitialized, setAvatarsInitialized] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [isLoadingLessons, setIsLoadingLessons] = useState(true);
  const [isLoadingRewards, setIsLoadingRewards] = useState(true);
  const [assignedSkills, setAssignedSkills] = useState<Skills[]>([]);

  const [selectedLesson, setSelectedLesson] =
    useState<TAssignedLessonsSchema | null>(null);

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

  const [loading, setLoading] = useState(false);

  const confirmSection = async () => {
    setIsLoadingLessons(true);
    try {
      const fetchedLessons = await getSelectedLessonsBySection(
        selectedSection?.id
      );
      setLessons(fetchedLessons || []);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      setLessons([]);
    } finally {
      setIsStudentLoading(false);
    }
  };
  useEffect(() => {
    const fetchAssignedSkills = async () => {
      try {
        if (selectedReward) {
          const assignedSkills = await getSkillsByReward(selectedReward.id);
          setAssignedSkills(assignedSkills);
        }
      } catch (error) {
        console.error("Error fetching assigned skills:", error);
      }
    };

    fetchAssignedSkills();
  }, [selectedReward]);
  const handleRewardSelection = async (reward: Reward) => {
    setSelectedReward(reward);
    try {
      const assignedSkills = await getSkillsByReward(reward.id);
      setAssignedSkills(assignedSkills);
    } catch (error) {
      console.error("Error fetching assigned skills:", error);
    }
  };

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const fetchedBranches = await getBranches();
      setBranches(fetchedBranches);
      console.log("fetchedBranches", fetchedBranches);
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

  const handleLessonSelect = (lessonName: string) => {
    const selectedLesson = lessons.find(
      (lesson) => lesson.course.title === lessonName
    );
    setSelectedLesson(selectedLesson || null);

    console.log("selected lesson", selectedLesson);
  };

  const fetchRewards = async () => {
    try {
      if (selectedLesson) {
        console.log("Fetching rewards for course ID:", selectedLesson?.id);
        const rewards = await getStudentRewardByCourse(selectedLesson?.id);
        console.log("Fetched rewards:", rewards);
        setCourseRewards(rewards);
        const fetchedSkills = await getSkills();
        setAllSkills(fetchedSkills);
      } else {
        setCourseRewards([]);
      }
    } catch (error) {
      console.error("Error fetching rewards:", error);
    } finally {
      setIsLoadingRewards(false); // Set loading state to false when done
    }
  };

  useEffect(() => {
    if (courseRewards.length > 0) {
      const avatars: AvatarMap = {};
      courseRewards.forEach((reward: Reward) => {
        avatars[reward.id] = getAvatarSrc(); // Assign a random avatar
      });
      setRewardAvatars(avatars);
    }
  }, [courseRewards]);

  const [isLoading, setIsLoading] = useState(true);

  const getAvatarSrc = () => {
    const avatarImages = [
      "/pngwing.png",
      "/icon2.png",
      "/icon3.png",
      "/icon4.png",
      "/newAvatar.png",
    ];
    return avatarImages[Math.floor(Math.random() * avatarImages.length)];
  };

  const toggleSkillSelection = (skill: Skills) => {
    if (selectedReward) {
      const rewardId = selectedReward.id.toString();
      setStudentSkills((prevSkills) => {
        const currentSkills = prevSkills[rewardId] || [];
        if (currentSkills.some((s) => s.name === skill.name)) {
          return {
            ...prevSkills,
            [rewardId]: currentSkills.filter((s) => s.name !== skill.name),
          };
        } else {
          return { ...prevSkills, [rewardId]: [...currentSkills, skill] };
        }
      });
    }
  };
  const [loadingRewardId, setLoadingRewardId] = useState<number | null>(null); // State to track the ID of the reward being updated

  const rewardSkills = async () => {
    if (!selectedReward || !session || !session.user || !session.user.id) {
      toast.error("No reward selected or user session is invalid.");
      return;
    }

    const skillIds =
      studentSkills[selectedReward.id.toString()]?.map((skill) => skill.id) ||
      [];

    if (skillIds.length === 0) {
      toast.error("No skills selected.");
      return;
    }

    try {
      let postData = {
        // Assuming your backend expects this payload structure
        student: selectedReward.id,
        rewardedBy: Number(session.user.id),
        course: selectedLesson?.id,
        skills: skillIds,
      };

      let updatedReward;
      if (selectedReward.reward_id === null) {
        // If there's no existing reward ID, assume creating a new reward
        updatedReward = await postRewards(postData);
        toast.success("Skill rewarded successfully");
      } else {
        // If a reward ID exists, update the existing reward
        updatedReward = await addSkillRewards({
          reward: selectedReward.reward_id,
          skills: skillIds,
        });
        toast.success("Skill rewarded successfully");
      }

      // Assuming fetchRewards function is available and correctly fetches and updates the rewards list
      await fetchRewards(); // Trigger fetching of updated rewards list

      // End loading state after successful fetch

      // Optionally, perform any additional state updates here if necessary
    } catch (error) {
      console.error("Error rewarding skills:", error);
    }
  };

  const calculateTotalPoints = () => {
    let totalPoints = 0;
    courseRewards.forEach((reward) => {
      // Add the total points of each reward, treating null as 0
      totalPoints += reward.reward_data.total_points ?? 0;
    });
    return totalPoints;
  };
  const totalPoints = calculateTotalPoints();
  // if (isLoadingRewards) {
  //   return <BranchTableSkeleton />;
  // }
  const handleResetPoints = async () => {
    if (selectedLessonId) {
      const resetData = {
        course: selectedLessonId,
      };

      const result = await resetReward(resetData);
    } else {
      console.error("No course selected.");
    }
  };
  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm<IFormSchema>({
    defaultValues: {
      branchName: "",
      campusName: "",
      deptName: "",
      gradeName: "",
      secName: "",
    },
    mode: "onChange",
  });
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);

  const applyFilter = () => {
    setIsApplyingFilters(true);
    fetchRewards().finally(() => {
      setIsApplyingFilters(false);
    });
  };
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Rewards</h2>
            <p className="text-muted-foreground">
              These are students you have rewarded
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant={"default"}>
              <Link href="/admin/rewards/new-skill">Add new skills</Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex w-full border border-dashed border-primary p-2 rounded-md gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant={"secondary"}
                  className="w-[200px]"
                >
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
                                  <SelectItem
                                    key={branch.id}
                                    value={branch.name}
                                  >
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
                                    c.branch &&
                                    c.branch.id === selectedBranch?.id
                                ).length > 0 ? (
                                  campus
                                    .filter(
                                      (c) =>
                                        c.branch &&
                                        c.branch.id === selectedBranch?.id
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
                                (d) =>
                                  d.campus && d.campus.id === selectedCampus?.id
                              ).length > 0 ? (
                                department
                                  .filter(
                                    (d) =>
                                      d.campus &&
                                      d.campus.id === selectedCampus?.id
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
                                  This campus does not have any department,
                                  please create a department first
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
                name="lessonName"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Select
                    value={value}
                    onValueChange={(val) => {
                      onChange(val);
                      handleLessonSelect(val);
                    }}
                    disabled={lessons.length === 0}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue
                        placeholder={
                          lessons.length > 0
                            ? "Select a lesson"
                            : "No lessons available"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                        <SelectLabel>Lessons</SelectLabel>
                        {lessons.map((lesson) => (
                          <SelectItem
                            key={lesson.course.id}
                            value={lesson.course.title}
                          >
                            {lesson.course.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-row gap-3">
              <div>
                <Button
                  type="button"
                  variant={"secondary"}
                  onClick={applyFilter}
                >
                  Apply Filter
                </Button>
              </div>
            </div>
          </div>
          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="link" disabled={totalPoints === 0}>
                  Reset points
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to reset points for this lesson
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently reset
                    all reward points for the whole class.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetPoints}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {/* <Button type="button" variant={"link"} onClick={handleResetPoints}>
              Reset points
            </Button> */}
          </div>
        </div>
        {isApplyingFilters ? (
          <BranchTableSkeleton />
        ) : (
          <div className="grid grid-cols-5 gap-2">
            <div className="border rounded-lg p-5 flex-col gap-2 flex items-center justify-center shadow-lg relative">
              <div className="flex items-center justify-center cursor-pointer relative">
                <div className="absolute -right-2 -top-2 z-10 flex items-center justify-center h-6 w-6 bg-green-500 rounded-full text-white text-xs">
                  {calculateTotalPoints()}
                </div>

                <Image
                  alt="Whole class"
                  src={"/wholeClass2.png"}
                  width={140}
                  height={140}
                />
              </div>

              <p>Whole Class</p>
              {/* <p>{reward.skill.points}</p> */}
            </div>
            {courseRewards.map((reward) => (
              <Dialog key={reward.id}>
                <DialogTrigger asChild>
                  {loadingRewardId === reward.id ? (
                    <div>Loading...</div> // Replace with a spinner or loading component
                  ) : (
                    <div
                      key={reward.id}
                      onClick={() => handleRewardSelection(reward)}
                      className="border rounded-md p-5 flex-col gap-2 flex items-center justify-center shadow-lg relative"
                    >
                      <div className="flex items-center justify-center cursor-pointer rounded-full h-[100px] w-[100px] bg-slate-200 relative">
                        <div className="absolute -right-2 -top-2 z-10 flex items-center justify-center h-6 w-6 bg-green-500 rounded-full text-white text-xs">
                          {reward.reward_data.total_points === null
                            ? 0
                            : reward.reward_data.total_points}
                        </div>
                        <Image
                          src={rewardAvatars[reward.id] || "/defaultAvatar.png"}
                          alt="Avatar"
                          width={60}
                          height={60}
                        />
                      </div>

                      <p>
                        {reward.student_first_name_arabic}
                        {reward.student_last_name_english}
                      </p>
                    </div>
                  )}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[825px] h-[500px] overflow-scroll no-scrollbar">
                  <DialogHeader>
                    <DialogTitle>
                      Reward information of {reward.student_first_name_english}
                      {reward.student_last_name_english}
                    </DialogTitle>
                    <DialogDescription>
                      Here you can reward more skills to the student or view
                      information about the rewarded skills
                    </DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="skillsList" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="skillsList" className="w-[50%]">
                        Assign Skills
                      </TabsTrigger>
                      <TabsTrigger value="assignedSkills" className="w-[50%]">
                        Assigned Skills
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent
                      value="skillsList"
                      className="min-h-[250px] overflow-scroll no-scrollbar"
                    >
                      <div className="flex flex-col gap-5">
                        <Label>Assign more skills</Label>
                        <SkillsList
                          allSkills={allSkills}
                          selectedSkills={
                            studentSkills[reward.id.toString()] || []
                          }
                          toggleSkillSelection={toggleSkillSelection}
                        />
                        <DialogClose asChild>
                          <div>
                            <Button
                              type="button"
                              onClick={() => rewardSkills()}
                            >
                              Reward skill
                            </Button>
                          </div>
                        </DialogClose>
                      </div>
                    </TabsContent>
                    <TabsContent
                      value="assignedSkills"
                      className="min-h-[250px] overflow-scroll no-scrollbar"
                    >
                      <div>
                        <Label>
                          Skills assigned to{" "}
                          {selectedReward?.student_first_name_english}{" "}
                          {selectedReward?.student_last_name_english}
                        </Label>
                        {selectedReward &&
                        selectedReward.reward_data.skill.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Skill</TableHead>
                                <TableHead>Points</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedReward.reward_data.skill.map((skill) => (
                                <TableRow key={skill.id}>
                                  <TableCell>{skill.name}</TableCell>
                                  <TableCell>{skill.points}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <p>No skills assigned to this reward.</p> // Show this message if no skills are assigned
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                  <div className="flex flex-col gap-5 mb-[120px]">
                    {" "}
                    {/* <Label>Assign more skills</Label>
                  <SkillsList
                    allSkills={allSkills}
                    selectedSkills={studentSkills[reward.id.toString()] || []}
                    toggleSkillSelection={toggleSkillSelection}
                  />
                  <DialogClose asChild>
                    <div>
                      <Button type="button" onClick={() => rewardSkills()}>
                        Reward skill
                      </Button>
                    </div>
                  </DialogClose> */}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Rewards;
