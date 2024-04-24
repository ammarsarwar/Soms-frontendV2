"use client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Button, buttonVariants } from "../ui/button";
import { LogOut, GitBranch, Settings, Bell, School } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState, useTransition } from "react";
import { getProfileDetails } from "@/server/user/action";
import { useUserProfileStore } from "@/GlobalStore/profile";
import { TProfileDetailsSchema } from "@/schemas";
import ProfileSettingsForm from "../profile-settings-form";

type ProfileProps = {
  profile_id: number;
  userRole: string;
};

function Navbar() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { data: session, status } = useSession();
  const { userProfile } = useUserProfileStore();
  const [profileData, setProfileData] = useState<TProfileDetailsSchema>();

  const handleSignout = () => {
    signOut();
  };

  useEffect(() => {
    getProfileInformation();
  }, [session]);

  const getProfileInformation = async () => {
    // const userProfileId = session?.user.userProfiles?.filter(
    //   (profile) => profile.profile_id === userProfile.profile_id
    // );
    // if (userProfileId) {
    //   startTransition(() => {
    //     getProfileDetails(userProfileId[0].profile_id).then((data) => {
    //       if (data.success) {
    //         setProfileData(data.data);
    //       } else {
    //         console.log(data.error);
    //       }
    //     });
    //   });
    // }
    return;
  };

  return (
    <div className="h-16 bg-white drop-shadow-sm flex items-center justify-end px-10">
      <div className="flex items-center gap-5">
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Change profile
        </Link>
        <Dialog open={open} onOpenChange={setOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Bell width={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Notifications
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    All notifications will show here
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <small>no available notifications</small>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar>
                  {/* <AvatarImage src="" alt="@aliirtaza" /> */}
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <Avatar>
                        <AvatarImage alt="@aliirtaza" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <div className="flex flex-col w-full">
                        <div className="flex items-center w-full justify-between">
                          <div>
                            <p className="text-md font-medium leading-none">
                              <span>
                                {profileData
                                  ? profileData.user.first_name
                                  : session?.user.first_name}{" "}
                              </span>
                              <span>
                                {profileData
                                  ? profileData.user.last_name
                                  : session?.user.last_name}
                              </span>
                            </p>
                          </div>
                          {/* <Badge variant="default">School Admin</Badge> */}
                        </div>
                        <div>
                          <p className="text-sm leading-none text-muted-foreground">
                            {profileData
                              ? profileData.user.email
                              : session?.user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full border border-primary p-3 rounded bg-[#ccfbf1]">
                    <School height={20} width={20} />
                    {profileData ? profileData.school.name : "My school"}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="h-12 text-md flex gap-2">
                  <DialogTrigger asChild>
                    <div className="flex gap-2 items-center">
                      <Settings width={18} height={18} />
                      <span>Change password</span>
                    </div>
                  </DialogTrigger>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="h-12 flex gap-2 text-md"
                onClick={handleSignout}
              >
                <LogOut height={18} width={18} />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when youre done.
              </DialogDescription>
            </DialogHeader>
            <ProfileSettingsForm setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Navbar;
