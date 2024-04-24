"use server";

import { getAcademicTerms } from "@/server/school-calender-server/academicterm/actions";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const AcademicTermTable = async ({}) => {
  const academicTermList = await getAcademicTerms();
  return <DataTable data={academicTermList} columns={columns} />;
};

export default AcademicTermTable;
