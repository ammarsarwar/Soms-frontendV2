"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { Badge } from "../ui/badge";
import AssignRoleForm from "./assign-role-form";
import { TUserSchema } from "@/schemas";
import EditUserForm from "./edit-user-form";
import EditRoleForm from "./edit-role-form";
import { useState } from "react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const user = row.original as TUserSchema;
  const userProfile = user.user_profiles;

  //onMouseEnter={() => setOpenDropdown(true)}
  const [openDropdown, setOpenDropdown] = useState(false);

  // Utility function to capitalize the first letter of a string, safely handling null or undefined values.
const capitalizeFirstLetter = (str: string | null | undefined) => {
  if (!str) return "N/A"; // Returns "N/A" if the input is null or undefined.

  return str
    .split(" ") // Splits the string into an array of words.
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalizes the first letter of each word and converts the rest to lowercase.
    .join(" ");
};

  return (
    <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <Dialog>
          <DialogTrigger asChild>
            <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded cursor-pointer w-full flex justify-start">
              View
            </p>
          </DialogTrigger>
          <DialogContent className="max-w-[800px]">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">First Name</p>
                  <p className="text-sm text-muted-foreground">
                    {capitalizeFirstLetter(user.first_name)}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Last Name</p>
                  <p className="text-sm text-muted-foreground">
                    {capitalizeFirstLetter(user.last_name)}
                  </p>
                </div>
              </div>

              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2  transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2  transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">User Role</p>
                  <div className="mt-5 mb-5">
                    {userProfile.map((profile, index) => (
                      <Badge variant={"outline"} key={index}>
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
                          : "Other"}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Assigned Branch
                  </p>
                  <p className="text-sm text-muted-foreground flex flex-col">
                    {userProfile.map((profile, index) => (
                      <span key={index}>
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
                        in {profile.branch?.name}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Assigned Campus
                  </p>
                  <p className="text-sm text-muted-foreground flex flex-col">
                    {userProfile.map((profile, index) => (
                      <span key={index}>
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
                        in {profile.campus?.name}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Created at</p>
                  <p className="text-sm text-muted-foreground flex flex-col">
                    {userProfile.map((profile, index) => (
                      <span key={index}>
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
                        at {profile.created_at}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Created by</p>
                  <p className="text-sm text-muted-foreground flex flex-col">
                    {userProfile.map((profile, index) => (
                      <span key={index}>
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
                        is created by {profile?.created_by?.email}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <p className="text-sm p-2 hover:bg-[#f1f5f9] cursor-pointer rounded w-full flex justify-start">
              Edit User
            </p>
          </DialogTrigger>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>Edit User Information</DialogTitle>
            </DialogHeader>
            <EditUserForm user={user} />
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full cursor-pointer flex justify-start">
              Manage Role
            </p>
          </DialogTrigger>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>
                Assign Roles to{" "}
                {capitalizeFirstLetter(user.first_name) +
                  " " +
                  capitalizeFirstLetter(user.last_name)}
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="account">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="assignRole">Assign Roles</TabsTrigger>
                <TabsTrigger value="editRole">Edit Roles</TabsTrigger>
              </TabsList>
              <TabsContent value="assignRole">
                <AssignRoleForm user={user} />
              </TabsContent>
              <TabsContent value="editRole">
                <EditRoleForm user={user} />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
