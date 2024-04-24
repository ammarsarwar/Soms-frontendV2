import { Button } from "@/components/ui/button";
import { Suspense } from "react";

import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import RewardsDisplay from "@/ParentComponent/rewards/rewards-table";

const RewardsView = async () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Rewards</h2>
            <p className="text-muted-foreground">
              Here you can see a list of rewards for different courses
            </p>
          </div>
        </div>
        <Suspense fallback={<BranchTableSkeleton />}>
          <RewardsDisplay />
        </Suspense>
      </div>
    </>
  );
};

export default RewardsView;
