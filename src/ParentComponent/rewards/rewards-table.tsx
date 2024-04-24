"use client";
import React, { useState, useEffect } from "react";
import StudentSelector from "@/ParentComponent/studentSelect/StudentSelector";
import Image from "next/image";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import { StudentProfile } from "@/components/student/data/schema";
import { AlertTriangle, BookCheck, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRewards } from "@/serverParent/rewards/actions";
import { RewardSimple } from "./data/schema";
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
import { Label } from "@/components/ui/label";
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
type AvatarMap = { [id: number]: string };
const RewardsDisplay = () => {
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
    null
  );
  const [rewardAvatars, setRewardAvatars] = useState<{ [id: number]: string }>(
    {}
  );
  const [rewardList, setRewardList] = useState<RewardSimple[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleStudentSelect = (student: StudentProfile | null) => {
    setSelectedStudent(student);
  };
  useEffect(() => {
    console.log(
      "Updated selectedStudent in parent component:",
      selectedStudent
    );
  }, [selectedStudent]);

  const fetchRewards = async () => {
    if (selectedStudent) {
      setIsLoading(true);

      const data = await getRewards(selectedStudent.id);
      setRewardList(data);
      setIsLoading(false);
      console.log("This is rewards data", rewardList);
    }
  };
  useEffect(() => {
    if (rewardList.length > 0) {
      const avatars: AvatarMap = {};
      rewardList.forEach((reward: RewardSimple) => {
        avatars[reward.id] = getAvatarSrc(); // Assign a random avatar
      });
      setRewardAvatars(avatars);
    }
  }, [rewardList]);
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
  return (
    <>
      <div className="flex w-full border border-dashed border-primary p-2 rounded-md gap-3">
        <div className="hidden space-x-3 lg:flex">
          <StudentSelector onStudentSelect={handleStudentSelect} />

          <Button
            type="button"
            variant="secondary"
            disabled={!selectedStudent}
            onClick={fetchRewards}
          >
            Apply filters
          </Button>
        </div>
      </div>
      <div>
        {isLoading ? (
          <BranchTableSkeleton />
        ) : !selectedStudent ? (
          <div className="w-full flex justify-center items-center mt-36 gap-3">
            <AlertTriangle size={24} />
            Please select a student view its rewards.
          </div>
        ) : rewardList.length > 0 ? (
          <>
            <div className="grid grid-cols-5 gap-2">
              {rewardList.map((reward) => (
                <>
                  <Dialog key={reward.id}>
                    <DialogTrigger asChild>
                      <div className="border rounded-md p-5 flex-col gap-2 flex items-center justify-center shadow-lg relative">
                        <div className="flex items-center justify-center cursor-pointer rounded-full h-[100px] w-[100px] bg-slate-200 relative">
                          <div className="absolute -right-2 -top-2 z-10 flex items-center justify-center h-6 w-6 bg-green-500 rounded-full text-white text-xs">
                            {reward.total_points === null
                              ? 0
                              : reward.total_points}
                          </div>
                          <Image
                            src={
                              rewardAvatars[reward.id] || "/defaultAvatar.png"
                            }
                            alt="Avatar"
                            width={60}
                            height={60}
                          />
                        </div>

                        <p className="font-bold text-lg">
                          {" "}
                          {reward.course.course.title}
                        </p>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] h-[350px] overflow-scroll no-scrollbar">
                      <DialogHeader>
                        <DialogTitle>
                          Reward information of{" "}
                          {reward.student.student_first_name_english}{" "}
                          {reward.student.student_last_name_english}
                        </DialogTitle>
                        <DialogDescription>
                          Below are the skills that were rewarded to this
                          student
                        </DialogDescription>
                      </DialogHeader>
                      <div className="">
                        {reward && reward.skill.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Skill</TableHead>
                                <TableHead>Points</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {reward.skill.map((skill) => (
                                <TableRow key={skill.id}>
                                  <TableCell className="font-bold">
                                    {skill.name}
                                  </TableCell>
                                  <TableCell className="font-bold">
                                    {skill.points}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <p>No skills assigned to this reward.</p> // Show this message if no skills are assigned
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              ))}
            </div>
          </>
        ) : (
          <div className="w-full flex justify-center items-center mt-36 gap-3">
            <AlertTriangle size={24} />
            No reward marked against this student.
          </div>
        )}
      </div>
    </>
  );
};

export default RewardsDisplay;
