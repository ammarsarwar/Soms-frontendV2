"use client";

import { Row } from "@tanstack/react-table";
import { ReportsSchema } from "./data/schema";

interface DataTableRowActionsProps {
  row: Row<ReportsSchema>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const progressRow = row.original as ReportsSchema;

  const getBgColorClass = (points: number) => {
    switch (points) {
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-amber-500";
      case 3:
        return "bg-green-500";
      default:
        return "bg-slate-200";
    }
  };

  return (
    <>
      <div className="flex flex-row gap-1 items-center">
        {progressRow.report_data.map((report) => (
          <div
            key={report.id}
            className="flex flex-col items-center gap-1 font-medium"
          >
            {report.progress_type}
            <div
              className={`p-4 w-32 border rounded-sm ${getBgColorClass(
                report.points
              )}`}
            ></div>
          </div>
        ))}
      </div>
    </>
  );
}
