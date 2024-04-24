import { useForm } from "react-hook-form";
import { TUserSchema, UserFormSchema } from "@/schemas";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";
import { updateUser, updateUserStatusChange } from "@/server/user/action";
import { toast } from "sonner";
import { useTransition } from "react";
import { Switch } from "../ui/switch";

const EditUserForm = ({ user }: { user: TUserSchema }) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UserFormSchema>({
    defaultValues: {
      first_name: user.first_name !== null ? user.first_name : "",
      last_name: user.last_name !== null ? user.last_name : "",
      email: user.email,
    },
    mode: "onChange",
  });

  const handleUserStatus = async (status: string) => {
    let updatedStatus = `${status === "Active" ? "Inactive" : "Active"}`;
    const refinedData = {
      status: updatedStatus,
      user_id: user.id,
    };
    startTransition(() => {
      updateUserStatusChange(refinedData).then((data) => {
        if (data.success) {
          toast.success(data.success);
          reset();
        } else {
          toast.error(data.error);
        }
      });
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const onSubmit = async (values: UserFormSchema) => {
    startTransition(() => {
      updateUser(values, user).then((data) => {
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
    <>
      <div className="flex border border-dashed border-primary rounded-sm p-3 mt-3">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="functional" className="flex flex-col space-y-1">
            <span>Deactivate User</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Deactivating an account will disable user from logging into the
              system
            </span>
          </Label>
          {isPending && <Icons.spinner className="h-10 w-10 animate-spin" />}
          <Switch
            id="status"
            checked={user.status === "Active" ? true : false}
            onCheckedChange={() => handleUserStatus(user.status)}
          />
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-8 mt-3">
          <div className="grid gap-2">
            <Label htmlFor="first_name">First Name</Label>
            <div className="flex flex-col gap-2">
              <Input
                id="first_name"
                placeholder="Enter your first name"
                type="text"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                {...register("first_name", {
                  required: {
                    value: true,
                    message: "Fisrt name is required",
                  },
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "Only alphabets are allowed",
                  },
                })}
                disabled={isLoading || isSubmitting || isPending}
              />
              {errors.first_name && (
                <small className="text-red-500 font-bold">
                  {errors.first_name?.message}
                </small>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="last_name">Last Name</Label>
            <div className="flex flex-col gap-2">
              <Input
                id="last_name"
                placeholder="Enter the last name"
                type="text"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                {...register("last_name", {
                  required: {
                    value: true,
                    message: "Last name is required",
                  },
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "Only alphabets are allowed",
                  },
                })}
                disabled={isLoading || isSubmitting || isPending}
              />
              {errors.last_name && (
                <small className="text-red-500 font-bold">
                  {errors.last_name?.message}
                </small>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex flex-col gap-2">
              <Input
                id="email"
                placeholder="Enter the email"
                type="email"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                  pattern: {
                    value:
                      /^([a-zA-Z0-9_+\-.]+)@([a-zA-Z0-9_+\-.]+)\.([a-zA-Z]{2,5})$/,
                    message: "Invalid email format",
                  },
                })}
                disabled={isLoading || isSubmitting || isPending}
              />
              {errors.email && (
                <small className="text-red-500 font-bold">
                  {errors.email?.message}
                </small>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end mt-8">
          <Button disabled={isLoading || isSubmitting} type="submit">
            {isLoading ||
              isPending ||
              (isSubmitting && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ))}
            Update
          </Button>
        </div>
      </form>
    </>
  );
};

export default EditUserForm;
