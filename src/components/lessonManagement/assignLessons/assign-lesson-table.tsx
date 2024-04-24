import {
  getAssignedLessons,
  getLessons,
} from "@/server/lessonManagement/lesson/action";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const AssignLessonTable = async () => {
  const assignedLessonList = await getAssignedLessons();
  return <DataTable data={assignedLessonList} columns={columns} />;
};

export default AssignLessonTable;
