import { Suspense } from "react";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import AdmissionsCalenderTable from "@/components/admissionCalender/admissions-calender-table";
import NewAdmissionCalenderDialog from "@/components/admissionCalender/new-admission-calender-dialog";

const AcademicTermPage = async () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Admission Calendar
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <NewAdmissionCalenderDialog />
          </div>
        </div>
        <Suspense fallback={<BranchTableSkeleton />}>
          <AdmissionsCalenderTable />
        </Suspense>
      </div>
    </>
  );
};

export default AcademicTermPage;
