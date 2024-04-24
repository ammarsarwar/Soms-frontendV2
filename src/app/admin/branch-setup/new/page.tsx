"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { toast } from "sonner";
import { postBranch } from "@/server/branch/actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IFormSchema {
  school: number | null;
  name: string;
  branch_license: string;
  curriculum: string;
  location: string;
}

const NewBranchPage = ({}) => {
  //toast

  const form = useForm<IFormSchema>({
    defaultValues: {
      school: null,
      name: "",
      branch_license: "",
      curriculum: "",
      location: "",
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
    // i'm adding the school id mannually for now, we need to change this
    const refinedData = {
      ...values,
    };
    console.log("ref data:", refinedData);
    const res = await postBranch(refinedData);
    if (res === undefined) {
      toast.error("error creating a new branch");
    } else {
      toast.success("New branch has been created");
    }
    reset();
  };

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Create new branch
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s you can create a new branch in your school
          </p>
        </div>
      </div>
      <Separator />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" flex justify-center">
          <div className="flex flex-col gap-8 p-5 w-[800px]">
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
                      value: /^[A-Za-z 0-9]+$/,
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
                      value: /^\d{3}-\d{4}$/,
                      message:
                        "Enter the license number in the format: xxx-xxxx",
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
            {/* <div className="grid gap-3">
            <Label htmlFor="curriculum">Branch curriculum</Label>
            <div className="flex flex-col gap-2">
              <Input
                id="curriculum"
                placeholder="Enter your curriculum"
                type="text"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                {...register("curriculum", {
                  required: "curriculum is required",
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
              {errors.curriculum && (
                <small className="text-red-500 font-bold">
                  {errors.curriculum?.message}
                </small>
              )}
            </div>
          </div> */}
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

export default NewBranchPage;
