"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EyeNoneIcon } from "@radix-ui/react-icons";
import { BellIcon, PersonStandingIcon } from "lucide-react";

const PostsRightSidebar = ({}) => {
  return (
    <div className="p-2 flex flex-col gap-3">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Filter posts</CardTitle>
          <CardDescription>
            Want to see posts from a specific department?
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="area">Department</Label>
              <Select defaultValue="billing">
                <SelectTrigger id="area">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team">Elementry</SelectItem>
                  <SelectItem value="billing">KG</SelectItem>
                  <SelectItem value="account">MIddle</SelectItem>
                  <SelectItem value="deployments">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="area">Section</Label>
              <Select defaultValue="billing">
                <SelectTrigger id="area">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team">S1: Mercy</SelectItem>
                  <SelectItem value="billing">S1: patience</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end space-x-2">
          {/* <Button variant="ghost">Cancel</Button> */}
          <Button>Filter</Button>
        </CardFooter>
      </Card>
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Choose what you want to be notified about.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-1">
          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
            <BellIcon className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Everything</p>
              <p className="text-sm text-muted-foreground">
                Every posts, mentions & all activity.
              </p>
            </div>
          </div>
          <div className="-mx-2 flex items-start space-x-4 rounded-md bg-accent p-2 text-accent-foreground transition-all">
            <PersonStandingIcon className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Available</p>
              <p className="text-sm text-muted-foreground">
                Only post by admins and teachers.
              </p>
            </div>
          </div>
          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
            <EyeNoneIcon className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Ignoring</p>
              <p className="text-sm text-muted-foreground">
                Turn off all notifications.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostsRightSidebar;
