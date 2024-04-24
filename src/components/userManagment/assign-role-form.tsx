"use client";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "../ui/icons";
import { getBranches } from "@/server/branch/actions";
import { useEffect, useRef, useState, useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { getSelectedCamForUser } from "@/server/campus/actions";
import { postAssignProfile } from "@/server/user/action";
import {
  Branch,
  Campus,
  ProfileDataSchema,
  TProfileDataSchema,
  TUserSchema,
} from "@/schemas";
import { toast } from "sonner";

const AssignRoleForm = ({ user }: { user: TUserSchema }) => {
  //states
  const [branches, setBranches] = useState<Branch[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [isBranchLoading, setIsBranchLoading] = useState(false);
  const [isCampusLoading, setIsCampusLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isMounted = useRef(true);

  //form
  const form = useForm<TProfileDataSchema>({
    resolver: zodResolver(ProfileDataSchema),
    mode: "onChange",
  });

  const {
    reset,
    register,
    handleSubmit,
    getValues,
    watch,
    control,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const branchId = watch("branch");

  //fetch branches when we have the user array
  useEffect(() => {
    const listOfBranches = async () => {
      try {
        setIsBranchLoading(true);
        const res = await getBranches();
        setBranches(res);
        setIsBranchLoading(false);
      } catch (error) {
        console.error("error", error);
        alert("error fetching branches");
        setIsBranchLoading(false);
      } finally {
        setIsBranchLoading(false);
      }
    };

    listOfBranches();
  }, []);

  //fetch campuses when we have the branch
  useEffect(() => {
    if (
      !isMounted.current &&
      branches.length > 0 &&
      getValues("branch") != ""
    ) {
      const listOfCampuses = async () => {
        try {
          setIsCampusLoading(true);
          const res = await getSelectedCamForUser(branchId);
          setCampuses(res);
          setIsCampusLoading(false);
        } catch (error) {
          console.error("error", error);
          alert("error fetching branches");
          setIsCampusLoading(false);
        } finally {
          setIsCampusLoading(false);
        }
      };

      listOfCampuses();
    }
    isMounted.current = false;
  }, [branchId]);

  const onSubmit: SubmitHandler<TProfileDataSchema> = async (values) => {
    startTransition(() => {
      postAssignProfile(values, user).then((data) => {
        if (data.success) {
          toast.success(data.success);
          reset();
        } else {
          toast.error(data.error);
        }
      });
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-8 mt-4 max-w-[600px]">
          <div className="grid gap-2">
            <Label htmlFor="userRole">Select Role</Label>
            <div className="flex flex-col gap-2">
              <Controller
                name="userRole"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading || isSubmitting}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                        <SelectLabel>roles</SelectLabel>
                        <SelectItem value="TE">Teacher</SelectItem>
                        <SelectItem value="NU">Nurse</SelectItem>
                        <SelectItem value="PR">Principal</SelectItem>
                        <SelectItem value="AC">Academics</SelectItem>
                        <SelectItem value="AD">Admissions Team</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.userRole && (
                <small className="text-red-500 font-bold">
                  {errors.userRole.message}
                </small>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="userRole">Select Branch</Label>
            <div className="flex flex-col gap-2">
              <Controller
                name="branch"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={
                      isLoading ||
                      isSubmitting ||
                      isPending ||
                      isBranchLoading ||
                      branches?.length < 1
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          isBranchLoading
                            ? "Loading branches"
                            : branches?.length < 1
                            ? "No branches found"
                            : "Select a branch"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                        <SelectLabel>branches</SelectLabel>
                        {branches?.length === 0 && <span>No branch found</span>}
                        {branches?.map((branch, index) => {
                          return (
                            <SelectItem key={index} value={`${branch.id}`}>
                              {branch.name}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.userRole && (
                <small className="text-red-500 font-bold">
                  {errors.userRole.message}
                </small>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="userRole">Select Campus</Label>
            <div className="flex flex-col gap-2">
              <Controller
                name="campus"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={
                      isLoading ||
                      isSubmitting ||
                      isCampusLoading ||
                      isPending ||
                      campuses?.length < 1
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          isCampusLoading
                            ? "Loading campuses"
                            : campuses?.length < 1
                            ? "No campus found"
                            : "Select a campus"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                        <SelectLabel>campuses</SelectLabel>
                        {campuses?.length === 0 && <span>No campus found</span>}
                        {campuses?.map((campus, index) => {
                          return (
                            <SelectItem key={index} value={`${campus.id}`}>
                              {campus.name}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.campus && (
                <small className="text-red-500 font-bold">
                  {errors.campus.message}
                </small>
              )}
            </div>
          </div>
          <div className="w-full flex justify-end mt-3">
            <Button disabled={isLoading || isSubmitting} type="submit">
              {isLoading ||
                isPending ||
                (isSubmitting && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ))}
              Add
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AssignRoleForm;
