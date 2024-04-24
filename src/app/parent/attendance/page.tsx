import React, { Suspense } from "react";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import AttendanceTable from "@/ParentComponent/attendance/attendance-table"; // Adjust import path as necessary

const AttendanceView = () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Attendance</h2>
            <p className="text-muted-foreground">
              Here you can view the attendance of your child.
            </p>
          </div>
        </div>

        <Suspense fallback={<BranchTableSkeleton />}>
          <AttendanceTable />
        </Suspense>
      </div>
    </>
  );
};

export default AttendanceView;
