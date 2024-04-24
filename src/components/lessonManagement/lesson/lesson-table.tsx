import { getLessons } from "@/server/lessonManagement/lesson/action";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const LessonTable = async () => {
  const lessonList = await getLessons();
  return <DataTable data={lessonList} columns={columns} />;
};

export default LessonTable;
