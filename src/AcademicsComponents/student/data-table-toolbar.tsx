"use client";
import { useEffect, useState } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getGrade } from "@/server/grade/actions";
import { application_status } from "./data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

import { getSection } from "@/server/section/actions";
import { Grade, Section } from "@/schemas";
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  useEffect(() => {
    async function fetchSections() {
      try {
        const sectionsResponse = await getSection();
        console.log("API Response:", sectionsResponse);

        setSections(sectionsResponse);
      } catch (error) {
        console.error("Error fetching grades:", error);
        setSections([]);
      }
    }

    fetchSections();
  }, []);
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
    (table.getColumn("student_id")?.getFilterValue() as string) ?? "";
  const gradeFilter =
    (table.getColumn("grade_name")?.getFilterValue() as string) ?? "";

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by student ID..."
          value={applicantNameFilter}
          type="text"
          onChange={(event) =>
            table.getColumn("student_id")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

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

        <DataTableFacetedFilter
          column={table.getColumn("section_name")} // Update with the correct column name
          title="Filter by section"
          options={Array.from(
            new Set(sections.map((section) => section.name))
          ).map((sectionName) => ({
            label: sectionName as string,
            value: sectionName as string,
          }))}
        />

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
