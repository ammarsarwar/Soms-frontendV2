"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

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
import { useForm, Controller } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Icons } from "../ui/icons";
import { editBranch, updateBranch } from "@/server/branch/actions";
import { Branch } from "@/schemas";
import { toast } from "sonner";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

interface IFormSchema {
  branchId: number;
  name: string;
  branch_license: string;
  curriculum: string;
  location: string;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  // const task = branchSchema.parse(row.original);
  const branchRow = row.original as Branch;

  // console.log(branchRow);

  const form = useForm<IFormSchema>({
    defaultValues: {
      branchId: branchRow.id,
      name: branchRow.name,
      branch_license: branchRow.branch_license,
      curriculum: branchRow.curriculum,
      location: branchRow.location,
    },
    mode: "onChange",
  });

  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const onSubmit = async (values: IFormSchema) => {
    const { branchId, ...updatedValues } = values;
    const res = await editBranch(updatedValues, branchId);
    if (res === undefined) {
      toast.error("error updating the branch");
    } else {
      toast.success("Your branch has been updated");
    }
    // reset();
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
              <DialogTitle>Branch details</DialogTitle>
              <DialogDescription>
                View your branch information here. Click okay when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    School Name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {branchRow.school?.name}
                  </p>
                </div>
              </div>

              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2  transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Branch Name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {branchRow.name}
                  </p>
                </div>
              </div>

              <div className="-mx-2 flex items-start space-x-4 rounded-md  p-2 hover:bg-accent hover:text-accent-foreground transition-all">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {branchRow.location}
                  </p>
                </div>
              </div>

              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Curriculum</p>
                  <p className="text-sm text-muted-foreground">
                    {branchRow.curriculum}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-all">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Email Address
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {branchRow.email_address || "N/A"}
                  </p>
                </div>
              </div>

              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Branch License
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {branchRow.branch_license || "N/A"}
                  </p>
                </div>
              </div>

              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-all">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Status</p>
                  <p className="text-sm text-muted-foreground">
                    {branchRow.status}
                  </p>
                </div>
              </div>

              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {branchRow.created}
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Branch details</DialogTitle>
              <DialogDescription>
                Edit your branch information here. Click update when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-8">
                <div className="grid gap-3">
                  <Label htmlFor="name">Branch Name</Label>
                  <div className="flex flex-col gap-2">
                    <Input
                      id="name"
                      placeholder="Enter your branch name"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect="off"
                      {...register("name", {
                        required: {
                          value: true,
                          message: "Branch name is required",
                        },
                        pattern: {
                          value: /^[A-Za-z ]+$/,
                          message: "Only alphabets are allowed",
                        },
                      })}
                      disabled={isLoading || isSubmitting}
                    />
                    {errors.name && (
                      <small className="text-red-500 font-bold">
                        {errors.name?.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="branch_license">License #</Label>
                  <div className="flex flex-col gap-2">
                    <Input
                      id="branch_license"
                      placeholder="Enter the branch license number"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect="off"
                      {...register("branch_license", {
                        required: "License # is required",
                        pattern: {
                          value: /^\d{3}-\d{3}$/,
                          message:
                            "Enter the license number in the format: xxx-xxx",
                        },
                      })}
                      disabled={isLoading || isSubmitting}
                    />
                    {errors.branch_license && (
                      <small className="text-red-500 font-bold">
                        {errors.branch_license?.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="city">Branch city</Label>
                  <div className="flex flex-col gap-2">
                    <Input
                      id="city"
                      placeholder="Enter branch city"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect="off"
                      {...register("location", {
                        required: {
                          value: true,
                          message: "Branch city is required",
                        },
                        pattern: {
                          value: /^[A-Za-z ]+$/,
                          message: "Only alphabets are allowed",
                        },
                        maxLength: {
                          value: 35,
                          message: "city must be at most 35 characters long",
                        },
                      })}
                      disabled={isLoading || isSubmitting}
                    />
                    {errors.location && (
                      <small className="text-red-500 font-bold">
                        {errors.location?.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="userRole">Curriculum</Label>
                  <div className="flex flex-col gap-2">
                    <Controller
                      name="curriculum"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading || isSubmitting}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a curriculum" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                              <SelectLabel>Curriculums</SelectLabel>
                              <SelectItem value="Arabic">Arabic</SelectItem>
                              <SelectItem value="French">French</SelectItem>
                              <SelectItem value="British">British</SelectItem>
                              <SelectItem value="American">American</SelectItem>
                              <SelectItem value="Local">Local</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.curriculum && (
                      <small className="text-red-500 font-bold">
                        {errors.curriculum.message}
                      </small>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <Button disabled={isLoading || isSubmitting} type="submit">
                  {isLoading ||
                    (isSubmitting && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ))}
                  Update
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
