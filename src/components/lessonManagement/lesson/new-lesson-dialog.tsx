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
import NewLessonForm from "./new-lesson-form";
import { useState } from "react";

const NewLessonDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new lesson</DialogTitle>
          <DialogDescription>
            You can create new lessons here, Close the dialog when you are done.
          </DialogDescription>
        </DialogHeader>
        <NewLessonForm setOpen={setOpen} />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewLessonDialog;
