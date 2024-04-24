import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import Link from "next/link";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import AcademicTermTable from "@/components/academicTerm/academic-term-table";
import NewTermDialog from "@/components/academicTerm/new-term-dialog";

const AcademicTermPage = async () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Academic Term</h2>
          </div>
          <div className="flex items-center space-x-2">
            <NewTermDialog />
          </div>
        </div>
        <Suspense fallback={<BranchTableSkeleton />}>
          <AcademicTermTable />
        </Suspense>
      </div>
    </>
  );
};

export default AcademicTermPage;
