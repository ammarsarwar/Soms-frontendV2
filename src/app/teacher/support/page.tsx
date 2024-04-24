import React from "react";
import { Suspense } from "react";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import TicketTable from "@/TeacherComponents/support/ticket-table";
const ViewSupport = () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Support Ticket
            </h2>
            <p className="text-muted-foreground">
              Here you can open support ticket
            </p>
          </div>
        </div>
        <div>
          <Suspense fallback={<BranchTableSkeleton />}>
            <TicketTable />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default ViewSupport;
