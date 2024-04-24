import React, { Suspense } from "react";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import ProgressTable from "@/ParentComponent/progressComponents/progress-table";
const ProgressView = () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Progress tracking
            </h2>
            <p className="text-muted-foreground">
              Here you can track the progress of your child
            </p>
          </div>
        </div>

        <Suspense fallback={<BranchTableSkeleton />}>
          <ProgressTable />
        </Suspense>
      </div>
    </>
  );
};

export default ProgressView;
