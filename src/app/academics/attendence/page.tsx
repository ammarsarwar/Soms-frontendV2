import { Button, buttonVariants } from "@/components/ui/button";
import { Suspense } from "react";
import Link from "next/link";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import AttendenceTable from "@/AcademicsComponents/attendence/attendence-table";
import { cn } from "@/lib/utils";

const AttendencePage = async () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Attendance</h2>
            <p className="text-muted-foreground">
              Here you can mark, view and edit student attendance.
            </p>
          </div>
          {/* <div className="flex items-center space-x-2">
            <Button variant={"default"}>
              <Link href="/admin/attendence/new">Mark attendence</Link>
            </Button>
          </div> */}
        </div>
        <Suspense fallback={<BranchTableSkeleton />}>
          <AttendenceTable />
        </Suspense>
      </div>
    </>
  );
};

export default AttendencePage;
