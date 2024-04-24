import React from "react";
import { Suspense } from "react";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import StudentTable from "@/components/student/Student-Table";
const Students = () => {
  return (
    <>
      <div className="hidden h-full w-full flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Student Information
            </h2>
          </div>
        </div>
        <Suspense fallback={<BranchTableSkeleton />}>
          <div>
            <StudentTable />
          </div>
        </Suspense>
      </div>
    </>
  );
};

export default Students;
