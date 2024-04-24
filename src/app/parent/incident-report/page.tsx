import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import Link from "next/link";

import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";

import IncidentTable from "@/ParentComponent/incidents/incident-table";
const IncidentPage = async () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Incident Reports
            </h2>
            <p className="text-muted-foreground">Here you can view incidents</p>
          </div>
        </div>
        <Suspense fallback={<BranchTableSkeleton />}>
          <IncidentTable />
        </Suspense>
      </div>
    </>
  );
};

export default IncidentPage;
