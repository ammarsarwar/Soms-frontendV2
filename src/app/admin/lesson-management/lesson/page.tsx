import { Suspense } from "react";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import LessonTable from "@/components/lessonManagement/lesson/lesson-table";
import NewLessonDialog from "@/components/lessonManagement/lesson/new-lesson-dialog";

const LessonPage = async () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Lessons</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of lessons associated witha grade, You can add,
              view and update new lessons!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <NewLessonDialog />
          </div>
        </div>
        <Suspense fallback={<BranchTableSkeleton />}>
          <LessonTable />
        </Suspense>
      </div>
    </>
  );
};

export default LessonPage;
