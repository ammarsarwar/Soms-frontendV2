"use server";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getStudentByStatus } from "@/serverAcademics/student_profile/actions";
import { StudentProfile } from "./data/schema";

const SectionAssignmentTable = async () => {
  const enrolledApplicantsList: StudentProfile[] = await getStudentByStatus();

  return <DataTable data={enrolledApplicantsList} columns={columns} />;
};

export default SectionAssignmentTable;
