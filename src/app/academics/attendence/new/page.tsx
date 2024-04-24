import { Button, buttonVariants } from "@/components/ui/button";
import { Suspense } from "react";
import Link from "next/link";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import AttendenceTable from "@/components/attendence/attendence-table";
import { cn } from "@/lib/utils";
// import MarkAttendenceTable from "@/components/markAttendence/mark-attendence-table";

const NewAttendencePage = async () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Mark new attendence
            </h2>
            <p className="text-muted-foreground">
              Here you can mark new attendence.
            </p>
          </div>
        </div>
        <Suspense fallback={<BranchTableSkeleton />}>
          {/* <MarkAttendenceTable /> */}
        </Suspense>
      </div>
    </>
  );
};

export default NewAttendencePage;
