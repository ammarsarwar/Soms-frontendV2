import { Button, buttonVariants } from "@/components/ui/button";
import { Suspense } from "react";
import Link from "next/link";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import AttendenceTable from "@/components/attendence/attendence-table";
import { cn } from "@/lib/utils";
import ProgressTable from "@/components/progress/progress-table";

const ProgressPage = async () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Progress tracking
            </h2>
            <p className="text-muted-foreground">
              Here you can mark progress for students on weekly{" "}
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

export default ProgressPage;
