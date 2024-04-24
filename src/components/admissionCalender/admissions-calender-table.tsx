"use server";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getAdmissionCalenders } from "@/server/school-calender-server/admissionCalender/actions";
import { TAdmissionCalenderSchema } from "@/schemas";
const AdmissionsCalenderTable = async ({}) => {
  const admissionCalenderList: TAdmissionCalenderSchema[] =
    await getAdmissionCalenders();
  return <DataTable data={admissionCalenderList} columns={columns} />;
};

export default AdmissionsCalenderTable;
