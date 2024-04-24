"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { postUser } from "@/server/user/action";
import { toast } from "sonner";
import { UserFormSchema } from "@/schemas";
import { useRef, useTransition } from "react";

const UserForm = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const userRef = useRef<HTMLFormElement>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<UserFormSchema>({
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const onSubmit = async (values: UserFormSchema) => {
    startTransition(() => {
      postUser(values).then((data) => {
        if (data.success) {
          console.log(data);
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
      <div className="grid grid-cols-1 gap-8 mt-8">
        <div className="grid gap-3">
          <Label htmlFor="first_name">First Name</Label>
          <div className="flex flex-col gap-2">
            <Input
              id="first_name"
              placeholder=""
              type="text"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              {...register("first_name", {
                required: { value: true, message: "First name is required" },
                pattern: {
                  value: /^[A-Za-z ]+$/,
                  message: "Only alphabets are allowed",
                },
                validate: {
                  notOnlySpaces: (value) =>
                    value.trim() !== "" || "First name cannot be only spaces",
                },
              })}
              disabled={isLoading || isSubmitting}
            />
            {errors.first_name && (
              <small className="text-red-500 font-bold">
                {errors.first_name?.message}
              </small>
            )}
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="last_name">Last Name</Label>
          <div className="flex flex-col gap-2">
            <Input
              id="last_name"
              placeholder=""
              type="text"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              {...register("last_name", {
                required: { value: true, message: "Last name is required" },
                pattern: {
                  value: /^[A-Za-z ]+$/,
                  message: "Only alphabets are allowed",
                },
                validate: {
                  notOnlySpaces: (value) =>
                    value.trim() !== "" || "Last name cannot be only spaces",
                },
              })}
              disabled={isLoading || isSubmitting}
            />
            {errors.last_name && (
              <small className="text-red-500 font-bold">
                {errors.last_name?.message}
              </small>
            )}
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="national_id">National ID</Label>
          <div className="flex flex-col gap-2">
            <Input
              id="national_id"
              placeholder=""
              type="text"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              {...register("national_id", {
                required: { value: true, message: "National ID is required" },
              })}
              disabled={isLoading || isSubmitting}
            />
            {errors.national_id && (
              <small className="text-red-500 font-bold">
                {errors.national_id?.message}
              </small>
            )}
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <div className="flex flex-col gap-2">
            <Input
              id="email"
              placeholder=""
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
              disabled={isLoading || isSubmitting}
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
        <Button
          disabled={isLoading || isSubmitting || isPending}
          type="submit"
          onClick={() => {
            if (userRef.current) {
              userRef.current.dispatchEvent(
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
          Create
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
