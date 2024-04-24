import { Button } from "@/components/ui/button";
import { FC, Suspense } from "react";
import Link from "next/link";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import DismissalStudentList from "@/TeacherComponents/dismissalSetup/dismissal-student-list";

interface pageProps {}

const DismissalPage: FC<pageProps> = () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Dismissal request management
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of dismissal requests associated with the
              students, You can approve or reject the request!
            </p>
          </div>
        </div>
        <Suspense fallback={<BranchTableSkeleton />}>
          <DismissalStudentList />
        </Suspense>
      </div>
    </>
  );
};

export default DismissalPage;
