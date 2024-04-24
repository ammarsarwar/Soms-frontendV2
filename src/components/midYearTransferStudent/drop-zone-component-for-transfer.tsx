"use client";
import { cn } from "@/lib/utils";
import { postBulkCreateUsers } from "@/server/user/action";
import { useState, useTransition } from "react";
import Dropzone from "react-dropzone";
import Papa from "papaparse";
import { toast } from "sonner";
import { FileCheck } from "lucide-react";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";
import { TStudentTransferSchema, ZTUserFormSchema } from "@/schemas";

const DropZoneComponentForTransfer = ({
  setOpen,
  bulkStudentData,
  setBulkStudentData,
  setIsFileSelected,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  bulkStudentData: TStudentTransferSchema[];
  setBulkStudentData: React.Dispatch<
    React.SetStateAction<TStudentTransferSchema[]>
  >;
  setIsFileSelected: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isPending, startTransition] = useTransition();

  //max file size 20MB
  const maxSize = 20971520;

  const parseCsv = (fileData: any) => {
    Papa.parse<TStudentTransferSchema>(fileData, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsedData: TStudentTransferSchema[] = result.data.map(
          (row: TStudentTransferSchema) => {
            console.log(row);
            // Ensure that each object in parsedData conforms to ZTUserFormSchema
            return {
              student_first_name_english: row.student_first_name_english,
              student_middle_name_english: row.student_middle_name_english,
              student_last_name_english: row.student_last_name_english,
              student_first_name_arabic: row.student_first_name_arabic,
              student_middle_name_arabic: row.student_middle_name_arabic,
              student_last_name_arabic: row.student_last_name_arabic,
              student_gender: row.student_gender,
              student_national_id: row.student_national_id.toString(),
              student_date_of_birth: row.student_date_of_birth,
              parent_name_english: row.parent_name_english,
              parent_name_arabic: row.parent_name_arabic,
              parent_email: row.parent_email,
              relation_to_child: row.relation_to_child,
              parent_phone_number: row.parent_phone_number.toString(),
              emergency_phone_number: row.emergency_phone_number.toString(),
            };
          }
        );
        console.log("parsedData", parsedData);
        setBulkStudentData(parsedData);
        setOpen(false);
      },
      error: (error) => {
        console.error("Error uploading the file", error);
        toast.error("There is an error uploading the file");
      },
    });
  };

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.abort = () => toast.error("Opps, file upload aborted!");
      reader.onerror = () =>
        toast.error("Opps, couldn't read through the file!");
      reader.onload = () => {
        const fileData = reader.result;
        parseCsv(fileData);
      };
      reader.readAsText(file);
    });
  };

  return (
    <Dropzone
      minSize={0}
      maxSize={maxSize}
      onDrop={(acceptedFiles) => onDrop(acceptedFiles)}
      maxFiles={1}
      disabled={isPending}
    >
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        fileRejections,
        acceptedFiles,
      }) => {
        const isFileTooLarge =
          fileRejections.length > 0 && fileRejections[0].file.size > maxSize;
        const acceptedFileItems = acceptedFiles.map((file) => (
          <li key={file.name} className="list-none">
            {file.name}
          </li>
        ));
        return (
          <section className="">
            <div
              {...getRootProps()}
              className={cn(
                "w-full h-52 flex justify-center items-center cursor-pointer border border-dashed border-primary rounded-lg text-center",
                isDragActive
                  ? "bg-primary text-white animate-pulse"
                  : "bg-slate-100/50 text-slate-400"
              )}
            >
              <input {...getInputProps()} />
              {!isDragActive && "Click here or drop a file to upload!"}
              {isDragActive && !isDragReject && "Drop to upload this file!"}
              {isDragReject &&
                "File type not accepted. Only CSV files are allowed."}
              {isFileTooLarge && (
                <div className="text-red-500 mt-2">File is too large.</div>
              )}
            </div>
            <>
              {acceptedFileItems.length === 0 ? null : (
                <div className="flex items-center justify-between mt-3">
                  <div className="text-primary flex items-center gap-2">
                    <FileCheck />
                    <div className="text-md text-muted-foreground truncate ...">
                      {acceptedFileItems}
                    </div>
                  </div>
                  {/* <Button
                    onClick={uploadPost}
                    disabled={isPending}
                    type="submit"
                    size={"sm"}
                  >
                    {isPending && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Upload
                  </Button> */}
                </div>
              )}
            </>
          </section>
        );
      }}
    </Dropzone>
  );
};

export default DropZoneComponentForTransfer;
