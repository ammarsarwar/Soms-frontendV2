"use client";
import { useState, useEffect } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Icons } from "../ui/icons";
import { updateDept } from "@/server/department/actions";
import { getBranches } from "@/server/branch/actions";
import { getSelectedCam } from "@/server/campus/actions";
import { getCampus } from "@/server/campus/actions";
import { Branch, Campus, Department } from "@/schemas";
interface DataTableRowActionsProps {
  row: Row<Department>;
}

interface IFormSchema {
  name: string;
  department: number;
  campusName: string;
  campus: number; // Changed from campusName to campusId
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [campus, setCampus] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const [selectedCampus, setSelectedCampus] = useState<number>();

  const departments = row.original as Department;

  const form = useForm<IFormSchema>({
    defaultValues: {
      name: departments.name,
      department: departments.id,
      campusName: departments.campus?.name,
      campus: departments.campus?.id,
    },
    mode: "onChange",
  });

  const fetchCampuses = async () => {
    if (departments.campus?.branch?.id) {
      try {
        const campuses = await getSelectedCam(departments.campus?.branch?.id);
        setCampus(campuses || []);
      } catch (error) {
        console.error("Error fetching campuses:", error);
      }
    }
  };

  // const handleSelectFocus = () => {
  //   if (!hasFetched) {
  //     fetchCampuses();
  //     setHasFetched(true);
  //   }
  // };

  const handleCampusChange = (campusName: any) => {
    const selected = campus.find((c: any) => c.name === campusName);
    setSelectedCampus(selected?.id);
    if (selected) {
      console.log("Selected campus ID:", selected.id);
    }
  };

  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const onSubmit = async (values: IFormSchema) => {
    // const { department, ...updatedValues } = values; // Extract campusId and prepare the rest of the data for the payload
    console.log("values", values);
    const refinedData = {
      ...values,
      campus: selectedCampus,
    };
    console.log("refinedData", refinedData);
    const { department, ...updatedValues } = refinedData;
    //     console.log("Payload for update:", refinedData);
    const res = await updateDept(department, updatedValues); // Pass campusId and updatedValues separately to updateCampus
    if (res === undefined) {
      alert("Error updating the department");
    } else {
      alert("Your department has been updated");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <Dialog>
          <DialogTrigger asChild>
            <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start">
              View
            </p>
          </DialogTrigger>
          <DialogContent className="max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Department Details</DialogTitle>
              <DialogDescription>
                View department information below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Branch Name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {departments.campus?.branch?.name}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Campus Name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {departments.campus?.name}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Department name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {departments.name}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <DropdownMenuSeparator />
        <Dialog>
          <DialogTrigger asChild>
            <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start">
              Edit
            </p>
          </DialogTrigger>
          <DialogContent className="max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
              <DialogDescription>
                Update the department information here.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-8">
                {/* <div className="grid gap-3">
                  <Label htmlFor="campusName">
                    Select campus you want to add department in
                  </Label>

                  <Controller
                    name="campusName"
                    control={control}
                    rules={{ required: "Campus selection is required" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Select
                        value={value}
                        onValueChange={(val) => {
                          onChange(val);
                          handleCampusChange(val);
                        }}
                        onOpenChange={fetchCampuses} // Fetch campuses when the select is focused/opened
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a campus" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                            <SelectLabel>Campus</SelectLabel>
                            {campus.length > 0 ? (
                              campus.map((filteredCampus) => (
                                <SelectItem
                                  key={filteredCampus.id}
                                  value={filteredCampus.name}
                                >
                                  {filteredCampus.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectLabel>
                                No campuses available for this branch.
                              </SelectLabel>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.campusName && (
                    <small className="text-red-500 font-bold">
                      {errors.campusName.message}
                    </small>
                  )}
                </div> */}
                <div className="grid gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Branch Name
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <Input
                        value={departments.campus?.branch?.name}
                        disabled
                        id="branchName"
                      />
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Campus Name
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <Input
                        value={departments.campus?.name}
                        disabled
                        id="campusName"
                      />
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="name">Department Name</Label>
                  <Input id="name" {...register("name")} />
                </div>
              </div>

              <DialogFooter>
                <div className="mt-10">
                  <Button disabled={isLoading || isSubmitting} type="submit">
                    {isLoading ||
                      (isSubmitting && (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      ))}
                    Update
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
