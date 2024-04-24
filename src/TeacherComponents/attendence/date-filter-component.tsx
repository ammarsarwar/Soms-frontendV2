// "use client";

// import * as React from "react";
// import { format } from "date-fns";
// import { Calendar as CalendarIcon } from "lucide-react";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// interface DateFilterComponentProps {
//   date: Date | undefined;
//   setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
// }

// const DateFilterComponent: React.FC<DateFilterComponentProps> = ({
//   date,
//   setDate,
// }) => {
//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button
//           variant={"outline"}
//           className={cn(
//             "w-[200px] justify-start text-left font-normal border-dashed border-primary",
//             !date && "text-muted-foreground"
//           )}
//         >
//           <CalendarIcon className="mr-2 h-4 w-4" />
//           {date ? format(date, "PPP") : <span>Pick a date</span>}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-auto p-0">
//         <Calendar
//           mode="single"
//           selected={date}
//           onSelect={setDate}
//           disabled={(date) =>
//             date > new Date() || date.getDate() === 5 || date.getDate() === 6
//           }
//           initialFocus
//         />
//       </PopoverContent>
//     </Popover>
//   );
// };

// export default DateFilterComponent;

import * as React from "react";
import { format, isAfter, startOfDay } from "date-fns"; // Import isAfter and startOfDay from date-fns
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateFilterComponentProps {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

const DateFilterComponent: React.FC<DateFilterComponentProps> = ({
  date,
  setDate,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[200px] justify-start text-left font-normal border-dashed border-primary",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={(date) =>
            isAfter(startOfDay(date), startOfDay(new Date())) || // Disable future dates
            date.getDate() === 5 ||
            date.getDate() === 6
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateFilterComponent;