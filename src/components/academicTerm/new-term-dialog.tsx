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
import NewTermForm from "./new-term-form";

const NewTermDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Academic Term</DialogTitle>
        </DialogHeader>
        <NewTermForm setOpen={setOpen} />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewTermDialog;
