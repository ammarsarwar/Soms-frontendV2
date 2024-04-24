"use client";
import { useSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { UserProfile } from "@/lib/types";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { useUserProfileStore } from "@/GlobalStore/profile";

export default function PersonaSelect() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { setUserProfile } = useUserProfileStore();

  //handle selection
  const handleSelection = (data: UserProfile) => {
    setUserProfile(data);
    const user = data.userRole;
    if (user === "SA") {
      router.push("/admin/dashboard");
    } else if (user === "TE") {
      router.push("/teacher/dashboard");
    } else if (user === "AC") {
      router.push("/academics/dashboard");
    } else if (user == "NU") {
      router.push("/nurse/dashboard");
    } else if (user == "AD") {
      router.push("/admissionsTeam/dashboard");
    } else if (user == "PA") {
      router.push("/parent/dashboard");
    }
  };

  if (session?.user.userProfiles?.length === 0)
    return (
      <div className="flex flex-col justify-center items-center">
        <p>You have no role assigned please contact the admin</p>
        <Button
          className="flex items-center gap-2 mt-8"
          onClick={() => signOut()}
        >
          <LogOut />
          Logout
        </Button>
      </div>
    );

  return (
    <>
      <div>
        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {session?.user.userProfiles?.length === 0
            ? "Hey there,"
            : "Please select a profile"}
        </h1>
      </div>
      <div className="w-full items-center justify-center flex">
        <RadioGroup defaultValue="card" className="flex gap-4">
          {status === "loading" ? (
            <div className="flex items-center space-x-4">
              <Skeleton className="h-[180px] w-[180px]" />
              <Skeleton className="h-[180px] w-[180px]" />
              <Skeleton className="h-[180px] w-[180px]" />
            </div>
          ) : session?.user.userType === "Staff" ? (
            session?.user?.userProfiles?.map((profile) => (
              <div
                key={profile.profile_id}
                onClick={() => handleSelection(profile)}
              >
                <RadioGroupItem
                  value={profile.profile_id.toString()}
                  id={`profile-${profile.profile_id}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`profile-${profile.profile_id}`}
                  className="flex flex-col items-center gap-4 justify-between rounded-md border-2 border-muted bg-popover cursor-pointer hover:border-primary p-8 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div>
                    <Avatar className="h-[100px] w-[100px]">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {profile.userRole.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  {profile.userRole === "TE"
                    ? "Teacher"
                    : profile.userRole === "SA"
                    ? "School Admin"
                    : profile.userRole === "SU"
                    ? "Super Admin"
                    : profile.userRole === "NU"
                    ? " Nurse"
                    : profile.userRole === "AD"
                    ? " Admission team"
                    : profile.userRole === "AC"
                    ? "Academics"
                    : profile.userRole === "PR"
                    ? "Principal"
                    : profile.userRole === "PA"
                    ? "Parent"
                    : "Other"}
                </Label>
              </div>
            ))
          ) : (
            <div
              key={session?.user.profile_id}
              onClick={() =>
                handleSelection({
                  profile_id: session?.user.profile_id,
                  userRole: "PA",
                })
              }
            >
              <RadioGroupItem
                value={
                  session?.user.profile_id
                    ? session.user.profile_id.toString()
                    : ""
                }
                id={`profile-${session?.user.profile_id}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`profile-${session?.user.profile_id}`}
                className="flex flex-col items-center gap-4 justify-between rounded-md border-2 border-muted bg-popover cursor-pointer hover:border-primary p-8 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div>
                  <Avatar className="h-[100px] w-[100px]">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {session?.user.userRole?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                Parent
              </Label>
            </div>
          )}
        </RadioGroup>
      </div>
    </>
  );
}
