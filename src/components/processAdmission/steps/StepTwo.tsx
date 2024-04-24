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
interface StepTwoProps {
  onSlotChange: (value: string) => void; // Adjust the type based on what you expect
}
import { Calendar } from "@/components/ui/calendar";
const StepTwo: React.FC<StepTwoProps> = ({ onSlotChange }) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <>
      <div className="flex flex-col gap-2">
        {/* <Label>Select the available slots</Label>
        <Select onValueChange={(value) => onSlotChange(value)}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a slot" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Slots</SelectLabel>
              <SelectItem value=" Slot 1 - 25 DEC, 2024 - 12:45 PM">
                Slot 1 - 25 DEC, 2024 - 12:45 PM
              </SelectItem>
              <SelectItem value="Slot 2 - 25 DEC, 2024 - 2:45 PM">
                Slot 2 - 25 DEC, 2024 - 2:45 PM
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select> */}
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border shadow"
        />
      </div>
      <div className="pt-5">
        <p>Click here to create a new test slot</p>
      </div>
    </>
  );
};

export default StepTwo;
