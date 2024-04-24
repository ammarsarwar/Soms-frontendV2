import { Suspense } from "react";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import GradingTable from "@/components/grading/grading-table";

const ViewGradesPage = async () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Grading</h2>
            <p className="text-muted-foreground">
              Here you can mark, view and edit student grades.
            </p>
          </div>
        </div>
        <Suspense fallback={<BranchTableSkeleton />}>
          <GradingTable />
        </Suspense>
      </div>
    </>
  );
};

export default ViewGradesPage;
