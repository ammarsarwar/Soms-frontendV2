import React from "react";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Define the categories as a union of string literals
type ProgressCategory = "Homework" | "Punctuality" | "Behavior" | "Attendance";

export type ProgressState = {
  Homework: { points: number };
  Punctuality: { points: number };
  Behavior: { points: number };
  Attendance: { points: number };
};

const ProgressTypes: React.FC<{
  progress: ProgressState;
  setProgress: React.Dispatch<React.SetStateAction<ProgressState>>;
}> = ({ progress, setProgress }) => {
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
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="font-bold">Homework</TableCell>
          <TableCell className="font-bold">
            {renderRadioGroup("Homework")}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Punctuality</TableCell>
          <TableCell className="font-bold">
            {renderRadioGroup("Punctuality")}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Behavior</TableCell>
          <TableCell className="font-bold">
            {renderRadioGroup("Behavior")}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Attendance</TableCell>
          <TableCell className="font-bold">
            {renderRadioGroup("Attendance")}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default ProgressTypes;
