import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import Link from "next/link";
import DepartmentTable from "@/AcademicsComponents/departmentSetup/department-table";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";

const DepartmentSetupPage = async () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {" "}
              Department Management
            </h2>
          </div>
        </div>
        <Suspense fallback={<BranchTableSkeleton />}>
          <DepartmentTable />
        </Suspense>
      </div>
    </>
  );
};

export default DepartmentSetupPage;
