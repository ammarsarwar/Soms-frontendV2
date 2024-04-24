import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StudentProgress from "@/TeacherComponents/progress/progress-table";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import { Suspense } from "react";
const ViewProgress = () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Progress tracking
            </h2>
            <p className="text-muted-foreground">
              Here you can see reports of progress
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant={"default"}>
              <Link href="/teacher/progress/new">Add new</Link>
            </Button>
          </div>
        </div>

        <div>
          <Suspense fallback={<BranchTableSkeleton />}>
            <StudentProgress />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default ViewProgress;
