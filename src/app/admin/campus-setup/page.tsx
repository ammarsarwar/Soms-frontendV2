import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import Link from "next/link";
import CampusTable from "@/components/campusSetup/campus-table";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import NewCampus from "@/components/campusSetup/NewCampus";

const CampusSetupPage = async () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {" "}
              Campus Management
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            {/* <UserNav /> */} <NewCampus />
            {/* <Button variant={"default"}>
              <Link href="/admin/campus-setup/new">Add new</Link>
            </Button> */}
          </div>
        </div>
        <Suspense fallback={<BranchTableSkeleton />}>
          <CampusTable />
        </Suspense>
      </div>
    </>
  );
};

export default CampusSetupPage;
