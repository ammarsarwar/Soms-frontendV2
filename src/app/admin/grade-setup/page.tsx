import { Suspense } from "react";

import GradeTable from "@/components/gradeSetup/grade-table";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import NewGradeDialog from "@/components/gradeSetup/NewGradeDialog";


const GradeSetupPage = async () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {" "}
              Grade Management
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <NewGradeDialog />
          </div>
        </div>
        <Suspense fallback={<BranchTableSkeleton />}>
          <GradeTable />
        </Suspense>
      </div>
    </>
  );
};

export default GradeSetupPage;
