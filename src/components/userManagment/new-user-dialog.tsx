"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import UserForm from "./user-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DropZoneComponent from "./drop-zone-component";
import TemplateButton from "./template-button";

const NewUserDialog = ({}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add New</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="account">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="userForm">Single User</TabsTrigger>
            <TabsTrigger value="importUser">Import Users</TabsTrigger>
          </TabsList>
          <TabsContent value="userForm">
            <UserForm setOpen={setOpen} />
          </TabsContent>
          <TabsContent value="importUser">
            <div className="flex flex-col gap-3 mt-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Upload CSV File</p>
                </div>
                <div className="flex items-center space-x-2">
                  <TemplateButton />
                </div>
              </div>
              <DropZoneComponent setOpen={setOpen} />
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewUserDialog;
