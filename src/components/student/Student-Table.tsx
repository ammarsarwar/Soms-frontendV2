import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getStudents } from "@/server/student_profile/actions";
import { StudentProfile } from "./data/schema";

const StudentTable = async () => {
  const studentsList: StudentProfile[] = await getStudents();

  return <DataTable data={studentsList} columns={columns} />;
};

export default StudentTable;

// "use client";
// import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
// import { useState, useEffect } from "react";
// import { columns } from "./columns";
// import { DataTable } from "./data-table";
// import { getAciveStudentsPaginated } from "@/server/student_profile/actions";
// import { StudentProfile } from "./data/schema";

// const StudentTable = async () => {
//   const [pageCount, setPageCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(15);
//   const [student, setStudent] = useState<StudentProfile[]>([]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const data = await getAciveStudentsPaginated(currentPage, pageSize);
//       if (data) {
//         setStudent(data.results);
//         const totalPageCount = Math.ceil(data.count / pageSize);
//         setPageCount(totalPageCount);
//       } else {
//         // Handle error or no data case
//         setStudent([]);
//         setPageCount(0);
//       }
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//       setStudent([]);
//       setPageCount(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     setLoading(true);
//     fetchData();
//     setLoading(false);
//   }, [currentPage, pageSize]);
//   if (loading) {
//     return <BranchTableSkeleton />;
//   }

//   return (
//     <DataTable
//       columns={columns}
//       data={student}
//       fetchData={fetchData}
//       pageCount={pageCount}
//       currentPage={currentPage}
//       setCurrentPage={setCurrentPage}
//       pageSize={pageSize}
//       setPageSize={setPageSize}
//     />
//   );
// };

// export default StudentTable;
