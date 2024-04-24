// import React, { useEffect, useState } from "react";
// import { columns } from "./columns";
// import { DataTable } from "./data-table";
// import { getSection } from "@/server/section/actions";
// import { Section } from "./data/schema";

// const SectionTable = async () => {
//   const sectionList: Section[] = await getSection();
//   return <DataTable data={sectionList} columns={columns} />;
// };

// export default SectionTable;

"use client";
import React, { useState, useEffect, Suspense } from "react";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import { Grade, Section } from "@/schemas";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getSection, getSectionByGrade } from "@/server/section/actions";
import { useStore } from "@/GlobalStore/gradeStore";
interface SectionTableProps {
  selectedGrade: Grade | null;
}

const SectionTable: React.FC<SectionTableProps> = ({ selectedGrade }) => {
  const [sectionList, setSectionList] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
    const fetchTrigger = useStore((state) => state.fetchTrigger);
  const fetchSections = async () => {
    setIsLoading(true)
    try {
      if (selectedGrade?.id) {
        const sections = await getSectionByGrade(selectedGrade.id);
        if (sections) {
          setSectionList(sections);
          setIsLoading(false)
        }
      } else {
        const sections = await getSection(); // Assume this fetches all sections without pagination
        setSectionList(sections);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch sections:", error);
      setSectionList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [selectedGrade, fetchTrigger]);

  if (isLoading) {
    return <BranchTableSkeleton />;
  }
  return (
    <Suspense fallback={<BranchTableSkeleton />}>
      <DataTable columns={columns} data={sectionList}  />
    </Suspense>
  );
};

export default SectionTable;

// "use client";
// import React, { useState, useEffect, Suspense } from "react";
// import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
// import { Grade, Section } from "@/schemas";
// import { columns } from "./columns";
// import { DataTable } from "./data-table";
// import {
//   getPaginatedSection,
//   getSectionWithoutGrade,
// } from "@/server/section/actions";
// import { useStore } from "@/GlobalStore/gradeStore";

// interface SectionTableProps {
//   selectedGrade: Grade | null;
// }

// const SectionTable: React.FC<SectionTableProps> = ({ selectedGrade }) => {
// const [sectionList, setSectionList] = useState<Section[]>([]);
// const [isLoading, setIsLoading] = useState(true);
//   const [pageCount, setPageCount] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(15);
  // const fetchTrigger = useStore((state) => state.fetchTrigger);

// const fetchSections = async () => {
//   try {
//     if (selectedGrade?.id) {
//       const sections = await getPaginatedSection(
//         currentPage,
//         pageSize,
//         selectedGrade.id
//       );
//       if (sections) {
//         setSectionList(sections.results);
//         setPageCount(Math.ceil(sections.count / pageSize));
//       }
//     } else {
//       const sections = await getSectionWithoutGrade(currentPage, pageSize); // Assume this fetches all sections without pagination
//       setSectionList(sections);
//       setPageCount(1); // Since no pagination, set page count to 1
//     }
//   } catch (error) {
//     console.error("Failed to fetch sections:", error);
//     setSectionList([]);
//     setPageCount(0);
//   } finally {
//     setIsLoading(false);
//   }
// };

// useEffect(() => {
//   fetchSections();
// }, [currentPage, pageSize, selectedGrade, fetchTrigger]);

// if (isLoading) {
//   return <BranchTableSkeleton />;
// }

// return (
//   <Suspense fallback={<BranchTableSkeleton />}>
//     <DataTable
//       columns={columns}
//       data={sectionList}
//       fetchSections={fetchSections}
//       pageCount={pageCount}
//       currentPage={currentPage}
//       setCurrentPage={setCurrentPage}
//       pageSize={pageSize}
//       setPageSize={setPageSize}
//     />
//   </Suspense>
// );
// };

// export default SectionTable;
