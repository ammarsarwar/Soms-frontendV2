import { Suspense } from "react";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import LessonTable from "@/components/lessonManagement/lesson/lesson-table";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import AssignLessonTable from "@/components/lessonManagement/assignLessons/assign-lesson-table";
import NewAssignedLessonDialog from "@/components/lessonManagement/assignLessons/new-assigned-lesson-dialog";

const LessonPage = async () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Assigned Lessons
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of lessons assigned to teachers and sections,
              You can add, view and assign new lessons here!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <NewAssignedLessonDialog />
          </div>
        </div>
        <Suspense fallback={<BranchTableSkeleton />}>
          <AssignLessonTable />
        </Suspense>
      </div>
    </>
  );
};

export default LessonPage;
