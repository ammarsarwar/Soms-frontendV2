import { useForm, Controller } from "react-hook-form";
import { Icons } from "@/components/ui/icons";
import { toast } from "sonner";
import { Branch, Campus, TProfileDataSchema, TUserSchema } from "@/schemas";
import { useEffect, useRef, useState, useTransition } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";

import { getBranches } from "@/server/branch/actions";
import { getSelectedCamForUser } from "@/server/campus/actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteUserRole, updateAssignProfile } from "@/server/user/action";
import { Trash } from "lucide-react";

const EditRoleForm = ({ user }: { user: TUserSchema }) => {
  const [editingProfileId, setEditingProfileId] = useState<number | null>(null);
  const userRef = useRef<HTMLFormElement>();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [isBranchLoading, setIsBranchLoading] = useState(false);
  const [isCampusLoading, setIsCampusLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isMounted = useRef(true);

  const handleEditClick = (profileId: number) => {
    setEditingProfileId(profileId);
  };

  const handleCancelEdit = () => {
    setEditingProfileId(null);
  };

  //form
  const form = useForm<TProfileDataSchema>({
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

  const onSubmit = async (data: TProfileDataSchema) => {
    startTransition(() => {
      updateAssignProfile(data, editingProfileId).then((data) => {
        if (data.success) {
          toast.success(data.success);
          handleCancelEdit();
          reset();
        } else {
          toast.error(data.error);
          handleCancelEdit();
        }
      });
    });
  };

  const deleteUserProfileRole = async (id: number) => {
    startTransition(() => {
      deleteUserRole(id).then((data) => {
        if (data.success) {
          toast.success(data.success);
        } else {
          toast.error(data.error);
        }
      });
    });
  };

  return (
    <ScrollArea className="h-[400px]">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {user.user_profiles.map((profile) => (
          <div
            key={profile.id}
            className="flex flex-col  gap-2 rounded-lg border border-dashed border-primary p-3 text-left text-sm transition-all"
          >
            {editingProfileId === profile.id ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex w-full flex-col gap-2">
                  <div className="flex items-center justify-end w-full gap-2">
                    <div
                      className="hover:bg-accent p-2 rounded-lg cursor-pointer border"
                      onClick={handleSubmit(onSubmit)}
                    >
                      {isLoading ||
                        isPending ||
                        (isSubmitting ? (
                          <Icons.spinner className="animate-spin" />
                        ) : (
                          <Icons.Check />
                        ))}
                    </div>
                    <div
                      className="hover:bg-accent p-2 rounded-lg cursor-pointer border "
                      onClick={handleCancelEdit}
                    >
                      <Icons.Cross />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="font-semibold">Assigned Branch</div>
                    <div className="flex flex-col gap-2">
                      {/* <Controller
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
                                <SelectLabel>Branches</SelectLabel>
                                {branches?.length === 0 && (
                                  <span>No branch found</span>
                                )}
                                {branches?.map((branch, index) => {
                                  return (
                                    <SelectItem
                                      key={index}
                                      value={`${branch.id}`}
                                    >
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
                      )} */}
                      {profile.branch ? profile.branch.name : "NA"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="font-semibold">Assigned Campus</div>
                    <div className="flex flex-col gap-2">
                      {/* <Controller
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
                                <SelectLabel>Campuses</SelectLabel>
                                {campuses?.length === 0 && (
                                  <span>No campus found</span>
                                )}
                                {campuses?.map((campus, index) => {
                                  return (
                                    <SelectItem
                                      key={index}
                                      value={`${campus.id}`}
                                    >
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
                      )} */}
                      {profile.campus ? profile.campus.name : "NA"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="font-semibold">Assigned Role</div>
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
                                <SelectItem value="AD">
                                  Admissions Team
                                </SelectItem>
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
                </div>
              </form>
            ) : (
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="font-semibold">Assigned branch</div>
                    <div>
                      <span className="text-muted-foreground text-xs">
                        {profile.branch ? profile.branch.name : "NA"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="font-semibold">Assigned campus</div>
                    <div>
                      <span className="text-muted-foreground text-xs">
                        {profile.campus ? profile.campus.name : "NA"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="font-semibold">Assigned role</div>
                    <div>
                      <Badge variant={"outline"}>
                        {profile.userRole === "TE"
                          ? "Teacher"
                          : profile.userRole === "PR"
                          ? "Principal"
                          : profile.userRole === "NU"
                          ? "Nurse"
                          : profile.userRole === "SA"
                          ? "IT Admin"
                          : profile.userRole === "AC"
                          ? "Academics"
                          : "Other"}{" "}
                      </Badge>
                    </div>
                  </div>
                  {/* {profile.userRole === "SA" ? null : ( */}
                  <div className="flex items-center gap-1">
                    <div
                      className="hover:bg-accent p-2 rounded-lg cursor-pointer border "
                      onClick={() => handleEditClick(profile.id)}
                    >
                      <Icons.edit />
                    </div>
                    <div
                      className="hover:bg-accent p-2 rounded-lg cursor-pointer border text-red-500"
                      onClick={() => deleteUserProfileRole(profile.id)}
                    >
                      {isPending ? (
                        <Icons.spinner className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash width={15} height={15} />
                      )}
                    </div>
                  </div>
                  {/* )} */}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default EditRoleForm;
