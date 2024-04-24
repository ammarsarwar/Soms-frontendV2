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
import { ZTUserFormSchema } from "@/schemas";

const DropZoneComponent = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [bulkUsersData, setBulkUsersData] = useState<ZTUserFormSchema[]>([]);
  const [isPending, startTransition] = useTransition();

  //max file size 20MB
  const maxSize = 20971520;

  const parseCsv = (fileData: any) => {
    Papa.parse<ZTUserFormSchema>(fileData, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true, // Skip empty lines in the CSV file
      complete: (result) => {
        const parsedData: ZTUserFormSchema[] = result.data.map((row: any) => {
          // Ensure that each object in parsedData conforms to ZTUserFormSchema
          return {
            first_name: row.first_name.trim(),
            last_name: row.last_name.trim(),
            email: row.email.trim(),
            national_id: row.national_id.trim(),
          };
        });
        console.log("parsedData", parsedData);
        setBulkUsersData(parsedData);
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

  const uploadPost = async () => {
    startTransition(() => {
      postBulkCreateUsers(bulkUsersData).then((data) => {
        if (data.success) {
          toast.success(data.success);
          setOpen(false);
        } else {
          toast.error(data.error);
        }
      });
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
                    <div className="text-md text-muted-foreground">
                      {acceptedFileItems}
                    </div>
                  </div>
                  <Button
                    onClick={uploadPost}
                    disabled={isPending}
                    type="submit"
                    size={"sm"}
                  >
                    {isPending && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Upload
                  </Button>
                </div>
              )}
            </>
          </section>
        );
      }}
    </Dropzone>
  );
};

export default DropZoneComponent;
