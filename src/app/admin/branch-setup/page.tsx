import { Suspense } from "react";
import BranchTable from "@/components/branchSetup/branch-table";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";

import NewBranch from "@/components/branchSetup/NewBranch";

const BranchSetupPage = async () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Branch Management
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <NewBranch />
            {/* <Button variant={"default"}>
              <Link href="/admin/branch-setup/new">Add new</Link>
            </Button> */}
          </div>
        </div>
        <Suspense fallback={<BranchTableSkeleton />}>
          <BranchTable />
        </Suspense>
      </div>
    </>
  );
};

export default BranchSetupPage;
