import React from "react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import Link from "next/link";
import SectionTable from "@/AcademicsComponents/sectionSetup/section-table";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
const page = () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {" "}
              Section management
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of classes associated with their grades, You
              can edit or view the grades!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* <UserNav /> */}{" "}
            {/* <Button variant={"default"}>
              <Link href="/admin/section-setup/new">Add new</Link>
            </Button> */}
          </div>
        </div>
        <Suspense fallback={<BranchTableSkeleton />}>
          <SectionTable />
        </Suspense>
      </div>
    </>
  );
};

export default page;
