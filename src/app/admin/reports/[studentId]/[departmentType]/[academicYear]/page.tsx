import GradeReportPage from "@/components/reports/grade-report-page";
import KgReportPage from "@/components/reports/kg-report-page";
import { getStudentReportDataForKg } from "@/server/reports/actions";
import { Suspense } from "react";

const IndividualYearPage = async ({
  params,
}: {
  params: { studentId: number; departmentType: string; academicYear: number };
}) => {
  return <div>this is year page and id is {params.academicYear}</div>;
};

export default IndividualYearPage;
