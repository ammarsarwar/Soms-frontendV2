"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getSkillsByReward } from "@/serverTeacher/rewards/actions";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAssignedLessons } from "@/serverTeacher/lessons/actions";
import SkillsList from "@/TeacherComponents/rewards/skills/SkillsList";
import { getSkills } from "@/serverTeacher/rewards/actions";
import { Reward } from "@/TeacherComponents/rewards/data/studentRewardSchema";
import { Skills } from "@/TeacherComponents/rewards/skills/data/schema";
import { addSkillRewards } from "@/serverTeacher/rewards/actions";
import { postRewards } from "@/serverTeacher/rewards/actions";

import { getStudentRewardByCourse } from "@/serverTeacher/rewards/actions";
import { resetReward } from "@/serverTeacher/rewards/actions";
import { useSession } from "next-auth/react";
import { TAssignedLessonsSchema } from "@/schemas";

const Rewards = () => {
  const { data: session, status } = useSession();

  const [lessons, setLessons] = useState<TAssignedLessonsSchema[]>([]);

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
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setIsLoadingLessons(true);
        const fetchedLessons = await getAssignedLessons();
        setLessons(fetchedLessons);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setIsLoadingLessons(false);
      }
    };

    fetchLessons();
  }, []);

  const handleLessonChange = (lessonId: any) => {
    console.log("Selected Lesson ID:", lessonId);
    setSelectedLessonId(lessonId);
  };

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        if (selectedLessonId) {
          console.log("Fetching rewards for course ID:", selectedLessonId);
          const rewards = await getStudentRewardByCourse(selectedLessonId);
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

    fetchRewards();
  }, [selectedLessonId]);
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
    if (!selectedReward) {
      console.error("No reward selected.");
      return;
    }

    const skillIds = studentSkills[selectedReward.id.toString()].map(
      (skill) => skill.id
    );

    if (skillIds.length === 0) {
      console.error("No skills selected.");
      return;
    }
    if (session && session.user && session.user.id) {
      const userId = session.user.id;
      try {
        let updatedReward: any;
        if (selectedReward.reward_id === null) {
          const refinedData = {
            student: selectedReward.id,
            rewarded_by: Number(userId),
            course: selectedLessonId,
            skill: skillIds,
          };
          updatedReward = await postRewards(refinedData);
          window.location.reload();
        } else {
          // If reward_id is not null, update the existing reward
          updatedReward = await addSkillRewards({
            reward: selectedReward.reward_id,
            skills: skillIds,
          });
          window.location.reload();
        }

        // Assuming you want to update the rewards state after the operation
        setRewards((prevRewards) =>
          prevRewards.map((reward) =>
            reward.id === selectedReward.id ? updatedReward : reward
          )
        );
      } catch (error) {
        console.error("Error processing reward:", error);
      }
    } else {
      console.error("User session is null");
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
  if (isLoadingLessons || isLoadingRewards) {
    return <BranchTableSkeleton />;
  }
  const handleResetPoints = async () => {
    if (selectedLessonId) {
      const resetData = {
        course: selectedLessonId,
      };

      const result = await resetReward(resetData);
      window.location.reload();
    } else {
      console.error("No course selected.");
    }
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
              <Link href="/teacher/rewards/new-skill">Add new skills</Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <div>
            <Select onValueChange={(value) => handleLessonChange(value)}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select lessons" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Lessons</SelectLabel>
                  {lessons.map((lesson) => (
                    <SelectItem key={lesson.id} value={lesson.id.toString()}>
                      {lesson.section.name} {lesson.course.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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
        <div className="grid grid-cols-5 gap-2">
          <div className="border rounded-full p-5 flex-col gap-2 flex items-center justify-center shadow-lg relative">
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
                          <Button type="button" onClick={() => rewardSkills()}>
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
      </div>
    </>
  );
};

export default Rewards;
