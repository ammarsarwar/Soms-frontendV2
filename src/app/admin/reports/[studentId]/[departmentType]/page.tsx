import GradeReportPage from "@/components/reports/grade-report-page";
import KgReportPage from "@/components/reports/kg-report-page";
import { getStudentReportDataForKg } from "@/server/reports/actions";
import { Suspense } from "react";

const IndividualReportPage = async ({
  params,
}: {
  params: { studentId: number; departmentType: string };
}) => {
  if (params.departmentType === "KG") {
    const { error, data: student } = await getStudentReportDataForKg(
      params.studentId
    );
    if (error) {
      return (
        <div>
          <p>{error}</p>
        </div>
      );
    }
    if (student)
      return (
        <Suspense
          fallback={
            <div>Please wait while we are gathering student information...</div>
          }
        >
          <KgReportPage student={student} studentId={params.studentId} />
        </Suspense>
      );
  }

  if (params.departmentType !== "KG") {
    return (
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Student Transcript
            </h2>
          </div>
        </div>
        <div className="mb-12">
          <GradeReportPage />
        </div>
      </div>
    );
  }
};

export default IndividualReportPage;
