import React, { useEffect } from "react";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DataTableGradeHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableGradeHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableGradeHeaderProps<TData, TValue>) {
  useEffect(() => {
    column.toggleSorting(false); // Set sorting to ascending when component renders
  }, [column]);

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
      >
        <span>{title}</span>
        <ArrowUpIcon className="ml-2 h-4 w-4" />{" "}
        {/* Always show arrow up icon */}
      </Button>
    </div>
  );
}
