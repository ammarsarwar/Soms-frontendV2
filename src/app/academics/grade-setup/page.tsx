import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import Link from "next/link";
import GradeTable from "@/AcademicsComponents/gradeSetup/grade-table";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";

const GradeSetupPage = async () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Grade management
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of grades associated with their department(es),
              You can edit or view the grades!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* <Button variant={"default"}>
              <Link href="/academics/grade-setup/new">Add new</Link>
            </Button> */}
          </div>
        </div>
        <Suspense fallback={<BranchTableSkeleton />}>
          <GradeTable />
        </Suspense>
      </div>
    </>
  );
};

export default GradeSetupPage;
