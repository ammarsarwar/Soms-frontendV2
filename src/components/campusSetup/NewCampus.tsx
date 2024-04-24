"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";

import { Controller } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { getBranches } from "@/server/branch/actions";

import { postCampus } from "@/server/campus/actions";
import { Branch } from "@/schemas";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
interface IFormSchema {
  branchName: string;
  campusName: string;
  deptName: string;
  location: string;
  emailAddress: string;
  contactNumber: number | null;
  campus_for: string;
  branchID: number | null; // Add this line
  // ... other fields ...
}

const NewCampus = ({}) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  //toast

  const form = useForm<IFormSchema>({
    defaultValues: {
      campusName: "",
      branchName: "",
      campus_for: "",
      branchID: null,
      contactNumber: null,
      emailAddress: "",
      location: "",
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
      form.setValue("branchID", branch.id);
      setSelectedBranch(branch);
      console.log(branch.id);

      console.log(selectedBranch);
    } else {
      form.setValue("branchID", null); // Clear the branch ID if no branch is selected
      setSelectedBranch(null);
    }
  };
  const handleSelectFocus = () => {
    if (!hasFetched) {
      fetchBranches();
      setHasFetched(true);
    }
  };
  // useEffect(() => {
  //   const fetchBranches = async () => {
  //     setLoading(true);
  //     try {
  //       const fetchedBranches = await getBranches();
  //       if (fetchedBranches) {
  //         setBranches(fetchedBranches);
  //         setError(null);
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchBranches();
  // }, []);

  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const onSubmit = async (values: any) => {
    const refinedData = {
      branch: selectedBranch?.id,
      name: values.campusName,
      campus_for: values.campus_for,
      location: values.location,
      contact_number: Number(values.contactNumber),
      email_address: values.emailAddress,
    };

    console.log("refined data", refinedData);
    try {
      const res = await postCampus(refinedData);
      if (res === undefined) {
        toast.error("error creating a new Campus");
      } else {
        toast.success("New Campus has been created");
      }
    } catch (error: any) {
      toast.error(error);
      console.error(error);
    }

    reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"default"}>Add New</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] max-h-[600px] overflow-scroll no-scrollbar">
        <DialogHeader>
          <DialogTitle> Create Campus</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className=" flex justify-center">
            <div className="flex flex-col gap-8 p-5 w-full">
              <div className="grid gap-3">
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
                      disabled={loading}
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
                          {branches.map((branch: any) => (
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
              </div>
              <div className="grid gap-3">
                <div className="flex flex-col gap-2">
                  <Input
                    id="campusName"
                    placeholder="Enter your Campus name"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    {...register("campusName", {
                      required: {
                        value: true,
                        message: "Campus name is required",
                      },
                      pattern: {
                        value: /^[A-Za-z ]+$/,
                        message: "Only alphabets are allowed",
                      },
                    })}
                    disabled={isLoading || isSubmitting}
                  />

                  {errors.campusName && (
                    <small className="text-red-500 font-bold">
                      {errors.campusName?.message}
                    </small>
                  )}
                </div>
              </div>
              <div className="grid gap-3">
                <Controller
                  name="campus_for"
                  control={control}
                  rules={{ required: "Campus type selection is required" }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Campus for" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Boys">Boys</SelectItem>
                          <SelectItem value="Girls">Girls</SelectItem>
                          <SelectItem value="Co">Co</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.campus_for && (
                  <small className="text-red-500 font-bold">
                    {errors.campus_for.message}
                  </small>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Campus Email</Label>

                <div className="flex flex-col gap-2">
                  <Input
                    id="emailAddress"
                    placeholder="Enter email address "
                    type="email"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    {...register("emailAddress", {
                      required: {
                        value: true,
                        message: "Email address is required",
                      },
                    })}
                    disabled={isLoading || isSubmitting}
                  />

                  {errors.emailAddress && (
                    <small className="text-red-500 font-bold">
                      {errors.emailAddress?.message}
                    </small>
                  )}
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="number">Campus Contact Number</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    id="contactNumber"
                    placeholder="Enter Campus Contact Number"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    {...register("contactNumber", {
                      required: "Contact number is required",
                      pattern: {
                        value: /^[0-9\s()+-]+$/,
                        message:
                          "Only numbers, symbols, and spaces are allowed",
                      },
                    })}
                    disabled={isLoading || isSubmitting}
                  />

                  {errors.contactNumber && (
                    <small className="text-red-500 font-bold">
                      {errors.contactNumber?.message}
                    </small>
                  )}
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Location</Label>

                <div className="flex flex-col gap-2">
                  <Input
                    id="location"
                    placeholder="Enter Location "
                    type="text"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    {...register("location", {
                      required: {
                        value: true,
                        message: "Location is required",
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
              <div className="mt-5">
                <Button disabled={isLoading || isSubmitting} type="submit">
                  {isLoading ||
                    (isSubmitting && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ))}
                  Create
                </Button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewCampus;
