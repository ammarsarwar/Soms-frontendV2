import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Row } from "@tanstack/react-table";

// Define the progress state type
export type ProgressState = {
  Homework: { points: number };
  Punctuality: { points: number };
  Behavior: { points: number };
  Attendance: { points: number };
};

type ProgressCategory = "Homework" | "Punctuality" | "Behavior" | "Attendance";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [progress, setProgress] = useState<ProgressState>({
    Homework: { points: 0 },
    Punctuality: { points: 0 },
    Behavior: { points: 0 },
    Attendance: { points: 0 },
  });

  const handleRadioChange = (category: ProgressCategory, value: string) => {
    const numericValue = parseInt(value, 10);
    const updatedProgress = {
      ...progress,
      [category]: { points: numericValue },
    };
    setProgress(updatedProgress);
  };

  const renderRadioGroup = (category: ProgressCategory) => {
    const currentValue = progress[category].points.toString();

    return (
      <RadioGroup
        value={currentValue}
        onValueChange={(value) => handleRadioChange(category, value)}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="4"
            id={`${category}-track`}
            className="text-green-500"
          />
          <Label htmlFor={`${category}-track`} className="text-green-500">
            On track
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="3"
            id={`${category}-improvment`}
            className=" text-amber-300"
          />
          <Label htmlFor={`${category}-improvment`} className="text-amber-300">
            Room for improvement
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="2"
            id={`${category}-concern`}
            className="text-red-500"
          />
          <Label htmlFor={`${category}-concern`} className="text-red-500">
            Cause for Concern
          </Label>
        </div>
      </RadioGroup>
    );
  };

  return (
    <div className="flex flex-row justify-center gap-5 p-2">
      {(
        [
          "Homework",
          "Punctuality",
          "Behavior",
          "Attendance",
        ] as ProgressCategory[]
      ).map((category) => (
        <div key={category} className="flex flex-col gap-3  ">
          <Label className="font-bold">{category}:</Label>
          {renderRadioGroup(category)}
        </div>
      ))}
    </div>
  );
}
