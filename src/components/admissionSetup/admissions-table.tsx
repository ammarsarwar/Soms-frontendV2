"use server";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getAdmissions } from "@/server/admissions/actions";
import { Admission } from "./data/schema";

const AdmissionTable = async () => {
  const admissionList: Admission[] = await getAdmissions();

  return <DataTable data={admissionList} columns={columns} />;
};

export default AdmissionTable;

// "use client";
// import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
// import { useState, useEffect } from "react";
// import { columns } from "./columns";
// import { DataTable } from "./data-table";
// import { getPaginatedAdmissions,getAdmissions } from "@/server/admissions/actions";
// import { Admission } from "./data/schema";

// const AdmissionTable = async () => {
//   const [pageCount, setPageCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(15);
//   const [admission, setAdmission] = useState<Admission[]>([]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const data = await getPaginatedAdmissions(currentPage, pageSize);
//       if (data) {
//         setAdmission(data.results);
//         const totalPageCount = Math.ceil(data.count / pageSize);
//         setPageCount(totalPageCount);
//       } else {
//         // Handle error or no data case
//         setAdmission([]);
//         setPageCount(0);
//       }
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//       setAdmission([]);
//       setPageCount(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [currentPage, pageSize]);
//   if (loading) {
//     return <BranchTableSkeleton />;
//   }

//   return (
//     <DataTable
//       columns={columns}
//       data={admission}
//       fetchData={fetchData}
//       pageCount={pageCount}
//       currentPage={currentPage}
//       setCurrentPage={setCurrentPage}
//       pageSize={pageSize}
//       setPageSize={setPageSize}
//     />
//   );
// };

// export default AdmissionTable;
