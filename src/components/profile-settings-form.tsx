"use client";

import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { ChangePasswordSchema } from "@/schemas";
import { postChangePassword } from "@/server/profile/action";

const ProfileSettingsForm = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const profileRef = useRef<HTMLFormElement>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChangePasswordSchema>({
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const password = watch("new_password");

  const onSubmit = (values: ChangePasswordSchema) => {
    startTransition(() => {
      postChangePassword(values).then((data) => {
        if (data.success) {
          toast.success(data.success);
          setOpen(false);
          reset();
        } else {
          toast.error(data.error);
        }
      });
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4 mb-8 ">
        <div className="grid gap-3">
          <Label htmlFor="old-password">Old password</Label>
          <div className="flex flex-col gap-2">
            <Input
              id="old-password"
              placeholder="Enter your old password"
              type="password"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              {...register("old_password", {
                required: {
                  value: true,
                  message: "Old password is required",
                },
              })}
              disabled={isLoading || isSubmitting || isPending}
            />
            {errors.old_password && (
              <small className="text-red-500 font-bold">
                {errors.old_password?.message}
              </small>
            )}
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="new-password">New password</Label>
          <div className="flex flex-col gap-2">
            <Input
              id="new-password"
              placeholder="Enter your new password"
              type="password"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              {...register("new_password", {
                required: {
                  value: true,
                  message: "New password is required",
                },
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value: /^(?=.*\d)(?=.*[A-Z]).{6,}$/,
                  message:
                    "Password must contain at least one number and one uppercase letter",
                },
              })}
              disabled={isLoading || isSubmitting || isPending}
            />
            {errors.new_password && (
              <small className="text-red-500 font-bold">
                {errors.new_password?.message}
              </small>
            )}
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="confirm-new-password">Confirm new password</Label>
          <div className="flex flex-col gap-2">
            <Input
              id="confirm-new-password"
              placeholder="Enter your new password again"
              type="password"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              {...register("confirm_new_password", {
                required: {
                  value: true,
                  message: "New password is required",
                },
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              disabled={isLoading || isSubmitting || isPending}
            />
            {errors.confirm_new_password && (
              <small className="text-red-500 font-bold">
                {errors.confirm_new_password?.message}
              </small>
            )}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <Button
          disabled={isLoading || isSubmitting || isPending}
          type="submit"
          onClick={() => {
            if (profileRef.current) {
              profileRef.current.dispatchEvent(
                new Event("submit", { bubbles: true })
              );
            }
          }}
        >
          {isLoading ||
            isSubmitting ||
            (isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ))}
          Save changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileSettingsForm;
