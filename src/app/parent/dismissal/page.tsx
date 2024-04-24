// import { FC, Suspense } from "react";

// import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";

// import DismissalTable from "@/ParentComponent/dismissalSetup/dismissal-table";
// import DismissalCreate from "@/ParentComponent/dismissalSetup/dismissalCreate";

// interface pageProps {}

// const DismissalPage: FC<pageProps> = () => {
//   return (
//     <>
//       <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
//         <div className="flex items-center justify-between space-y-2">
//           <div>
//             <h2 className="text-2xl font-bold tracking-tight">
//               Dismissal request management
//             </h2>
//             <p className="text-muted-foreground">
//               Here&apos;s a list of dismissal requests and you can create one as
//               well
//             </p>
//           </div>
//           <div className="flex items-center space-x-2">
//             <DismissalCreate />
//           </div>
//         </div>
//         <Suspense fallback={<BranchTableSkeleton />}>
//           <DismissalTable />
//         </Suspense>
//       </div>
//     </>
//   );
// };

// export default DismissalPage;

"use client";
import { FC, Suspense, useState } from "react";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import DismissalTable from "@/ParentComponent/dismissalSetup/dismissal-table";
import DismissalCreate from "@/ParentComponent/dismissalSetup/dismissalCreate";
import { DatePicker } from "@/ParentComponent/dismissalSetup/DatePicker";

interface pageProps {}

const DismissalPage: FC<pageProps> = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Dismissal request management
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of dismissal requests and you can create one as
              well
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <DismissalCreate />
            {/* Add DatePicker and pass setSelectedDate as the callback */}
          </div>
        </div>
        <DatePicker onDateSelect={setSelectedDate} />
        <Suspense fallback={<BranchTableSkeleton />}>
          {/* Pass the selectedDate to DismissalTable */}
          <DismissalTable selectedDate={selectedDate} />
        </Suspense>
      </div>
    </>
  );
};

export default DismissalPage;
