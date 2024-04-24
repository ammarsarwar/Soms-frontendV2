import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; // Assuming this is DayPicker or similar
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface DatePickerProps {
  onDateSelect: (date: Date | undefined) => void; // Adjusted to Date | undefined
}

export function DatePicker({ onDateSelect }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date} // Date | undefined is acceptable
            onSelect={(newDate) => {
              setDate(newDate); // newDate is Date | undefined
              onDateSelect(newDate); // Pass Date | undefined upwards
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
