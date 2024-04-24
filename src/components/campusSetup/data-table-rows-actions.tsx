"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Icons } from "../ui/icons";
import { updateCampus } from "@/server/campus/actions";
import { getBranches } from "@/server/branch/actions";
import { Branch, Campus } from "@/schemas";
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
interface IFormSchema {
  campusId: number;
  name: string;
  location: string;
  branch: number;
  branchName: string;
}
export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  console.log(row.original);
  // const task = branchSchema.parse(row.original);
  const campusRow = row.original as Campus;

  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<number>();

  // const handletask = (data: any) => {
  //   console.log(data);
  // };
  const form = useForm<IFormSchema>({
    defaultValues: {
      name: campusRow.name,
      campusId: campusRow.id,
      location: campusRow.location,
      branchName: campusRow.branch?.name,
      branch: campusRow.branch?.id,
    },
    mode: "onChange",
  });

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const fetchedBranches = await getBranches();
      setBranches(fetchedBranches);
      setError(null); // Reset error on successful fetch
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  };
  const handleBranchChange = (branchName: any) => {
    const branch = branches.find((b) => b.name === branchName);
    if (branch) {
      form.setValue("branch", branch.id); // Set the branch ID as a number
      setSelectedBranch(branch?.id);
      console.log(branch.id);

      console.log(selectedBranch);
    }
  };
  const handleSelectFocus = () => {
    if (!hasFetched) {
      fetchBranches();
      setHasFetched(true);
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
    console.log("values", values);
    const refinedData = {
      ...values,
      branch: selectedBranch,
    };
    console.log("refinedData", refinedData);
    const { campusId, ...updatedValues } = refinedData; // Extract campusId and prepare the rest of the data for the payload

    console.log("Payload for update:", updatedValues);
    const res = await updateCampus(campusId, updatedValues); // Pass campusId and updatedValues separately to updateCampus
    if (res === undefined) {
      alert("Error updating the campus");
    } else {
      alert("Your campus has been updated");
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
              <DialogTitle>Campus Details</DialogTitle>
              <DialogDescription>
                View campus information below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Branch Name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {campusRow.branch?.name}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Campus Name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {campusRow?.name}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {campusRow?.location}
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
              <DialogTitle>Edit Campus</DialogTitle>
              <DialogDescription>
                Update the campus information here.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-8">
                {/* <div className="grid gap-3">
                  <Label htmlFor="campusId">Campus ID</Label>
                  <Input id="campusId" {...register("campusId")} disabled />
                </div> */}
                {/* <div className="grid gap-3">
                  <Label htmlFor="branchName">Branch name</Label>
                  <Controller
                    name="branchName"
                    control={control}
                    rules={{ required: "Branch selection is required" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Select
                        value={value}
                        onValueChange={(val) => {
                          onChange(val);
                          handleBranchChange(val);
                        }}
                        onOpenChange={handleSelectFocus}
                        disabled
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              loading ? "Loading..." : "Select a branch"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                            <SelectLabel>Branch</SelectLabel>
                            {branches.map((branch) => (
                              <SelectItem key={branch.id} value={branch.name}>
                                {branch.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.branchName && (
                    <small className="text-red-500 font-bold">
                      {errors.branchName.message}
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
                        value={campusRow.branch?.name}
                        disabled
                        id="branchName"
                      />
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="name">Campus Name</Label>
                  <Input id="name" {...register("name")} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" {...register("location")} />
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

        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
