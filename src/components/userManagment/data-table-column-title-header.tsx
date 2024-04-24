import { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

interface DataTableColumnTitleHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnTitleHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnTitleHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <span>{title}</span>
    </div>
  );
}
