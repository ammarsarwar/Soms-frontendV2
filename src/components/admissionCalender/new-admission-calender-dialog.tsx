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
import NewCalenderForm from "./new-calender-form";
import { useState } from "react";

const NewAdmissionCalenderDialog = ({}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add New</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Admission Calendar</DialogTitle>
        </DialogHeader>
        <NewCalenderForm setOpen={setOpen} />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewAdmissionCalenderDialog;
