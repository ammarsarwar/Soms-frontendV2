"use server";

import { getAcademicYears } from "@/server/school-calender-server/academicyear/actions";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const AcademicYearTable = async ({}) => {
  const academicYearList = await getAcademicYears();
  return <DataTable data={academicYearList} columns={columns} />;
};

export default AcademicYearTable;
