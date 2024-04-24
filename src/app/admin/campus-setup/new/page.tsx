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

const NewCampusPage = ({}) => {
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
    const res = await postCampus(refinedData);
    if (res === undefined) {
      alert("error creating a new Campus");
    } else {
      alert("New Campus has been created");
    }

    reset();
  };

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Create new campus
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s you can create a new campus in the selected branch
          </p>
        </div>
      </div>
      <Separator />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" flex justify-center">
          <div className="flex flex-col gap-8 p-5 w-[800px]">
            <div className="grid gap-3">
              <Label htmlFor="branchName">
                Select branch you want to add campus in
              </Label>
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
                        placeholder={loading ? "Loading..." : "Select a branch"}
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
              <Label htmlFor="campusName">Campus name</Label>
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
              <Label htmlFor="campusFor">Campus for</Label>
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
                      <SelectValue placeholder="Select campus type" />
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
              <Label htmlFor="email">Email address</Label>

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

                {/* {errors.emailAddress && (
                <small className="text-red-500 font-bold">
                  {errors.emailAddress?.message}
                </small>
              )} */}
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="number">Contact number</Label>
              <div className="flex flex-col gap-2">
                <Input
                  id="contactNumber"
                  placeholder="Enter email address "
                  type="text"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  {...register("contactNumber", {
                    required: "Contact number is required",
                    pattern: {
                      value: /^[0-9\s()+-]+$/,
                      message: "Only numbers, symbols, and spaces are allowed",
                    },
                  })}
                  disabled={isLoading || isSubmitting}
                />

                {errors.contactNumber && (
                  <small className="text-red-500 font-bold">
                    {errors.contactNumber?.message}
                  </small>
                )}

                {errors.contactNumber?.type === "pattern" && (
                  <small className="text-red-500 font-bold">
                    {errors.contactNumber.message}
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
    </div>
  );
};

export default NewCampusPage;
