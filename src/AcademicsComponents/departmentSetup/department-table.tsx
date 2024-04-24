import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getDept } from "@/serverAcademics/department/actions";
import { Department } from "./data/schema";

const DepartmentTable = async () => {
  const deptList: Department[] = await getDept();
  return <DataTable data={deptList} columns={columns} />;
};

export default DepartmentTable;
