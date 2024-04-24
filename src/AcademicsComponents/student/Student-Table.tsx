"use server";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getStudents } from "@/serverAcademics/student_profile/actions";
import { StudentProfile } from "./data/schema";

const StudentTable = async () => {
  const studentsList: StudentProfile[] = await getStudents();

  return <DataTable data={studentsList} columns={columns} />;
};

export default StudentTable;
