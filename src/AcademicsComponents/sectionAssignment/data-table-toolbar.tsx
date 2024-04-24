"use client";
import { useEffect, useState } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getGrade } from "@/serverAcademics/grade/actions";
import { application_status } from "./data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Grade } from "../gradeSetup/data/schema";
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    async function fetchGrades() {
      try {
        const gradesResponse = await getGrade();
        console.log("API Response:", gradesResponse);

        setGrades(gradesResponse);
      } catch (error) {
        console.error("Error fetching grades:", error);
        setGrades([]);
      }
    }

    fetchGrades();
  }, []);

  useEffect(() => {
    console.log("grades on render:", grades);
  }, [grades]);
  const isFiltered = table.getState().columnFilters.length > 0;
  const applicantNameFilter =
    (table.getColumn("applicant_name")?.getFilterValue() as string) ?? "";

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter application name..."
          value={applicantNameFilter}
          onChange={(event) =>
            table
              .getColumn("applicant_name")
              ?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {grades.length > 0 && (
          <DataTableFacetedFilter
            column={table.getColumn("grade_name")} // Update with the correct column name
            title="Filter by grade"
            options={Array.from(new Set(grades.map((grade) => grade.name))).map(
              (gradeName) => ({
                label: gradeName as string,
                value: gradeName as string,
              })
            )}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
