// import { TDismissalSchema } from "@/ParentComponent/schemas";

// import { getDismissalRequests } from "@/serverParent/dismissal/actions";
// import DismissalView from "./DismissalView";

// const DismissalTable = async () => {
//   const dismissalList: TDismissalSchema[] = await getDismissalRequests();
//   return <DismissalView dismissalList={dismissalList} />;
// };

// export default DismissalTable;

"use client";
import React, { useEffect, useState } from "react";
import { TDismissalSchema } from "@/ParentComponent/schemas";
import { getDismissalRequests } from "@/serverParent/dismissal/actions";
import DismissalView from "./DismissalView";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton"; // Import the skeleton
import { format } from "date-fns";
interface DismissalTableProps {
  selectedDate: Date | undefined;
}

const DismissalTable: React.FC<DismissalTableProps> = ({ selectedDate }) => {
  const [dismissalList, setDismissalList] = useState<TDismissalSchema[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      if (selectedDate) {
        const formattedDate = format(selectedDate, "yyyy-MM-dd"); // Assuming you're using date-fns
        try {
          const data = await getDismissalRequests(formattedDate);
          setDismissalList(data);
        } catch (error) {
          console.error("Error fetching dismissal requests:", error);
          // Handle error (e.g., set an error state, show a message)
        }
      }
      setIsLoading(false); // End loading
    };

    fetchData();
  }, [selectedDate]); // Dependency array, refetch when selectedDate changes

  // Conditionally render BranchTableSkeleton or DismissalView
  return isLoading ? (
    <BranchTableSkeleton />
  ) : (
    <DismissalView dismissalList={dismissalList} />
  );
};

export default DismissalTable;
