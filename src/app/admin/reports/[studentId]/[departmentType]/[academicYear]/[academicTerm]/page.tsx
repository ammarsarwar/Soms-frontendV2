import GradeReportPage from "@/components/reports/grade-report-page";
import KgReportPage from "@/components/reports/kg-report-page";
import { getStudentReportDataForKg } from "@/server/reports/actions";
import { Suspense } from "react";

const IndividualTermPage = async ({
  params,
}: {
  params: {
    studentId: number;
    departmentType: string;
    academicYear: number;
    academicTerm: number;
  };
}) => {
  return (
    <div>
      this is term page and id is {params.academicTerm} and year is{" "}
      {params.academicYear}
    </div>
  );
};

export default IndividualTermPage;
