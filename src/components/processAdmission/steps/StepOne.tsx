import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface StepOneProps {
  onTestTypeChange: (value: string) => void; // Adjust the type based on what you expect
}
const StepOne: React.FC<StepOneProps> = ({ onTestTypeChange }) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Label>Select the type of test</Label>
        <Select onValueChange={(value) => onTestTypeChange(value)}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a Test" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tests</SelectLabel>
              <SelectItem value="single">Face to face meeting</SelectItem>
              <SelectItem value="group">Group test</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default StepOne;
