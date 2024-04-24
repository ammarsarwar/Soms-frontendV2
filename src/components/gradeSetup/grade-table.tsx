// "use client";
// import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
// import { useState, useEffect } from "react";
// import { Grade } from "@/schemas";
// import { columns } from "./columns";
// import { DataTable } from "./data-table";
// import { getPaginatedGrade } from "@/server/grade/actions";

// import { Suspense } from "react";
// const GradeTable = () => {
//   const [pageCount, setPageCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(15);
//   const [grade, setGrade] = useState<Grade[]>([]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const data = await getPaginatedGrade(currentPage, pageSize);
//       if (data) {
//         setGrade(data.results);
//         const totalPageCount = Math.ceil(data.count / pageSize);
//         setPageCount(totalPageCount);
//       } else {
//         // Handle error or no data case
//         setGrade([]);
//         setPageCount(0);
//       }
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//       setGrade([]);
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
//     <>
//       <Suspense fallback={<BranchTableSkeleton />}>
//         <DataTable
//           columns={columns}
//           data={grade}
//           fetchData={fetchData}
//           pageCount={pageCount}
//           currentPage={currentPage}
//           setCurrentPage={setCurrentPage}
//           pageSize={pageSize}
//           setPageSize={setPageSize}
//         />
//       </Suspense>
//     </>
//   );
// };

// export default GradeTable;

import { Grade } from "@/schemas";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getGrade } from "@/server/grade/actions";

const GradeTable = async () => {
  const gradeList: Grade[] = await getGrade();
  return <DataTable data={gradeList} columns={columns} />;
};

export default GradeTable;
