"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { searchUserDetails } from "@/server/user/action";
import { Search } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useState } from "react";
import { TUserSchema } from "@/schemas";

interface IFormSchema {
  email: string;
}

const SearchUserForm = ({
  setSelectedUser,
}: {
  setSelectedUser: React.Dispatch<React.SetStateAction<TUserSchema | null>>;
}) => {
  const [users, setUsers] = useState<TUserSchema[]>([]);
  const [isCardOpen, setIsCardOpen] = useState(false);

  const form = useForm<IFormSchema>({
    defaultValues: {
      email: "",
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
    setIsCardOpen(true);
    const res: TUserSchema[] = await searchUserDetails(values);
    setUsers(res);
  };

  const handleCardSelection = (data: TUserSchema) => {
    setIsCardOpen(false);
    setSelectedUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-8 w-full">
        <div className="grid gap-3">
          <Label htmlFor="email">Search user</Label>
          <div className="flex flex-col gap-2">
            <HoverCard defaultOpen={false} open={isCardOpen}>
              <HoverCardTrigger>
                <Input
                  id="email"
                  placeholder="Enter the email"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  width={75}
                  {...register("email", {
                    required: {
                      value: true,
                      message: "This field is required",
                    },
                    pattern: {
                      value:
                        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$|^[a-zA-Z]+$/, // Updated regex to allow both emails and alphabets
                      message: "Invalid input format",
                    },
                  })}
                  disabled={isLoading || isSubmitting}
                />
              </HoverCardTrigger>
              <HoverCardContent>
                {users.length < 1 && <p>No user found</p>}
                {users.map((user, index) => {
                  return (
                    <div
                      key={index}
                      className="hover:bg-slate-200 p-2 rounded cursor-pointer"
                      onClick={() => handleCardSelection(user)}
                    >
                      <p className="text-sm text-primary">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  );
                })}
              </HoverCardContent>
            </HoverCard>

            <div>
              <Button
                disabled={isLoading || isSubmitting}
                type="submit"
                variant={"default"}
                className="flex gap-2"
              >
                {isLoading ||
                  (isSubmitting && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ))}
                {isLoading ||
                  (isSubmitting ? null : <Search width={16} height={16} />)}
                Search user
              </Button>
            </div>
            {/* </div> */}
            <small className="text-sm text-muted-foreground">
              {" "}
              Search a user by its first name or email.
            </small>
            {errors.email && (
              <small className="text-red-500 font-bold">
                {errors.email?.message}
              </small>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchUserForm;
