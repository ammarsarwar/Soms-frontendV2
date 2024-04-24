"use client";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";

import { toast } from "sonner";
import { postBranch } from "@/server/branch/actions";
interface IFormSchema {
  school: number | null;
  name: string;
  branch_license: string;
  curriculum: string;
  location: string;
}
const NewBranch = () => {
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
    try {
      // Since this action is async, ensure it's called in response to user actions (e.g., form submission)
      const response = await postBranch(values);
      if (response === undefined) {
        toast.error("Error creating a new branch");
      } else {
        toast.success("New branch has been created");
        reset();
      }
    } catch (error) {
      console.error("Failed to create branch", error);
      toast.error("Error creating a new branch");
    }
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"default"}>Add New</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle> Create Branch</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className=" flex justify-center">
              <div className="flex flex-col gap-8 p-5 w-full">
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
                  <Label htmlFor="branch_license">License Number</Label>
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
                  <Label htmlFor="city">Branch City</Label>
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
    </div>
  );
};

export default NewBranch;
