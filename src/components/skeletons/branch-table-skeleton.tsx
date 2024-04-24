import { Skeleton } from "../ui/skeleton";

function BranchTableSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex gap-3 mb-8">
        <Skeleton className="h-6 w-1/5" />
        <Skeleton className="h-6 w-16" />
      </div>
      {/* Skeleton for the table header */}
      <div className="flex justify-between items-center px-4 py-2">
        <Skeleton className="h-6 w-1/5" />
        <Skeleton className="h-6 w-1/5" />
        <Skeleton className="h-6 w-1/5" />
        <Skeleton className="h-6 w-1/5" />
        <Skeleton className="h-6 w-1/12" />
      </div>

      {/* Multiple rows to represent skeleton rows in the table */}
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex justify-between items-center px-4 py-2"
        >
          <Skeleton className="h-6 w-1/5" />
          <Skeleton className="h-6 w-1/5" />
          <Skeleton className="h-6 w-1/5" />
          <Skeleton className="h-6 w-1/5" />
          <Skeleton className="h-6 w-1/12" />
        </div>
      ))}
    </div>
  );
}

export default BranchTableSkeleton;
