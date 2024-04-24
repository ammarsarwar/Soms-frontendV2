import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getDept } from "@/server/department/actions";
import { Department } from "@/schemas";

const DepartmentTable = async () => {
  const deptList: Department[] = await getDept();
  return <DataTable data={deptList} columns={columns} />;
};

export default DepartmentTable;

// "use client";
// import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
// import { useState, useEffect } from "react";
// import { Department } from "@/schemas";
// import { columns } from "./columns";
// import { DataTable } from "./data-table";
// import { getPaginatedDept } from "@/server/department/actions";

// import { Suspense } from "react";
// const DepartmentTable = () => {
//   const [pageCount, setPageCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(15);
//   const [dept, setdept] = useState<Department[]>([]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const data = await getPaginatedDept(currentPage, pageSize);
//       if (data) {
//         setdept(data.results);
//         const totalPageCount = Math.ceil(data.count / pageSize);
//         setPageCount(totalPageCount);
//       } else {
//         // Handle error or no data case
//         setdept([]);
//         setPageCount(0);
//       }
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//       setdept([]);
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
//           data={dept}
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

// export default DepartmentTable;
