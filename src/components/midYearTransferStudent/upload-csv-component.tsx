"use client";
import { Button } from "@/components/ui/button";
import { Pencil, FileSpreadsheet } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TStudentTransferSchema } from "@/schemas";
import DropZoneComponentForTransfer from "./drop-zone-component-for-transfer";

interface FormData {
  csvFile: FileList;
}

const UploadCsvComponent = ({
  setOpen,
  open,
  bulkStudentData,
  setBulkStudentData,
  isFileSelected,
  setIsFileSelected,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  bulkStudentData: TStudentTransferSchema[];
  setBulkStudentData: React.Dispatch<
    React.SetStateAction<TStudentTransferSchema[]>
  >;
  isFileSelected: boolean;
  open: boolean;
  setIsFileSelected: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // const [array, setArray] = useState<any[]>([]);

  // //form logic
  // const form = useForm<FormData>({
  //   mode: "onChange",
  // });

  // const {
  //   reset,
  //   register,
  //   handleSubmit,
  //   control,
  //   formState: { isSubmitting, isLoading, errors },
  // } = form;

  // const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setArray([]);
  //   const file = e.target.files && e.target.files[0];
  //   if (file) {
  //     const fileReader = new FileReader();
  //     fileReader.onload = function (event) {
  //       if (event && event.target) {
  //         const text = event.target.result as string;
  //         const dataArray = csvFileToArray(text);
  //         setArray(dataArray);
  //       }
  //     };
  //     fileReader.readAsText(file);
  //   }
  // };

  // const handleOnSubmit = handleSubmit((data) => {
  //   const file = data.csvFile[0];
  //   if (file) {
  //     const fileReader = new FileReader();
  //     fileReader.onload = function (event) {
  //       if (event && event.target) {
  //         const text = event.target.result as string;
  //         const dataArray = csvFileToArray(text);
  //         setArray(dataArray);
  //       }
  //     };
  //     fileReader.readAsText(file);
  //   }
  //   console.log(array);
  // });

  // const csvFileToArray = (text: string): any[] => {
  //   const rows = text.split("\n");
  //   const headers = rows[0].split(",");
  //   const result = [];
  //   for (let i = 1; i < Math.min(rows.length, 201); i++) {
  //     const obj: any = {};
  //     const currentRow = rows[i].split(",");
  //     if (currentRow.length === headers.length) {
  //       for (let j = 0; j < headers.length; j++) {
  //         obj[headers[j].trim()] = currentRow[j].trim();
  //       }
  //       result.push(obj);
  //     }
  //   }
  //   return result;
  // };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={isFileSelected ? "secondary" : "outline"}
          className={cn(
            "w-[200px] border-dashed border-primary flex justify-start items-center gap-2 font-normal truncate ...",
            !isFileSelected && "text-muted-foreground"
          )}
        >
          {isFileSelected ? (
            <Pencil height={15} width={15} />
          ) : (
            <FileSpreadsheet height={15} width={15} />
          )}
          {isFileSelected ? <p>random file</p> : <p>Select file</p>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px]">
        {/* <form onSubmit={handleOnSubmit}>
          <Input
            type="file"
            id="csvFileInput"
            accept=".csv"
            placeholder="Please upload the file"
            // onChange={handleOnChange}
            {...register("csvFile", {
              required: {
                value: true,
                message: "file is required",
              },
            })}
            disabled={isLoading || isSubmitting}
          />

          {errors.csvFile && <span>This field is required</span>}
          <button type="submit">IMPORT CSV</button>
        </form> */}
        <DropZoneComponentForTransfer
          setOpen={setOpen}
          bulkStudentData={bulkStudentData}
          setBulkStudentData={setBulkStudentData}
          setIsFileSelected={setIsFileSelected}
        />
      </PopoverContent>
    </Popover>
  );
};

export default UploadCsvComponent;
