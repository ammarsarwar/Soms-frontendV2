"use client";
import React, { Suspense, useState } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Controller, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { updateTicketStatus } from "@/serverTeacher/tickets/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Ticket } from "./data/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableRowActionsProps {
  row: Row<Ticket>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const {
    handleSubmit,
    control,
    formState: { errors, isLoading, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const task = row.original as Ticket;

  const onSubmit: SubmitHandler<any> = async (values) => {
    console.log("Form data:", values);
    try {
      const result = await updateTicketStatus(task.id, values.status);
      if (result) {
        alert("Ticket is closed. ");
      } else {
        alert("Error updating ticket status");
      }
    } catch {
      alert("Error updating ticket status");
    } finally {
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <Link href={`/admin/support/${row.original.id}`} target="_blank">
          <DropdownMenuItem asChild>
            <a>View</a>
          </DropdownMenuItem>
        </Link>
        {task.status === "Closed" || task.status === "Opened" ? null : (
          <Dialog>
            <DialogTrigger asChild>
              <p className="text-sm p-2 hover:bg-[#f1f5f9] rounded w-full flex justify-start">
                Change status
              </p>
            </DialogTrigger>
            <DialogContent className="max-w-[800px] overflow-scroll no-scrollbar h-[300px]">
              <DialogHeader>
                <DialogTitle>Application status</DialogTitle>
                <DialogDescription>
                  You can manually change the application status from here
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-8">
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading || isSubmitting}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                            <SelectLabel>Status</SelectLabel>

                            <SelectItem value="Closed">Closed</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">
                      {isLoading || isSubmitting ? "Updating" : "Update"}
                    </Button>
                  </DialogFooter>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
