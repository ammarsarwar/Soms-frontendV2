import React from "react";

import { Suspense } from "react";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import AdmissionTable from "@/components/admissionSetup/admissions-table";

const ViewAdmission = () => {
  return (
    <>
      <div className="hidden h-full w-full flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Admissions</h2>
          </div>
        </div>
        <Suspense fallback={<BranchTableSkeleton />}>
          <div>
            <AdmissionTable />
          </div>
        </Suspense>
      </div>
    </>
  );
};

export default ViewAdmission;
