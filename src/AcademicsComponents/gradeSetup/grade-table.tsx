import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getGrade } from "@/serverAcademics/grade/actions";
import { Grade } from "./data/schema";

const GradeTable = async () => {
  const gradeList: Grade[] = await getGrade();
  return <DataTable data={gradeList} columns={columns} />;
};

export default GradeTable;
