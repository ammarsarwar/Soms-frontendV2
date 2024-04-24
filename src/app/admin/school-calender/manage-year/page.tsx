import { Suspense } from "react";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import AcademicYearTable from "@/components/academicYear/academic-year-table";
import NewSchoolYearDialog from "@/components/academicYear/new-school-year-dialog";

const ManageYearPage = async () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Academic Year</h2>
          </div>
          <div className="flex items-center space-x-2">
            <NewSchoolYearDialog />
          </div>
        </div>
        <Suspense fallback={<BranchTableSkeleton />}>
          <AcademicYearTable />
        </Suspense>
      </div>
    </>
  );
};

export default ManageYearPage;
