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
import NewYearForm from "./new-year-form";
import { useState } from "react";

const NewSchoolYearDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Academic Year</DialogTitle>
        </DialogHeader>
        <NewYearForm setOpen={setOpen} />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewSchoolYearDialog;
