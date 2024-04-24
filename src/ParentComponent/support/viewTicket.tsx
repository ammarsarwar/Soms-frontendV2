"use client";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";

import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/components/support/data/schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Controller, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Icons } from "@/components/ui/icons";
import { postResponse } from "@/serverParent/tickets/actions";
import { Shapes, User, BookA, Activity } from "lucide-react";
interface ViewTicketDetailProps {
  ticketList: Ticket;
}

const ViewTicketDetail: React.FC<ViewTicketDetailProps> = ({ ticketList }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isLoading, isSubmitting },
  } = useForm({
    mode: "onChange",
  });
  const [activeTab, setActiveTab] = useState("Details");

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };
  const [editorContent, setEditorContent] = useState("");
  const handleMessageChange = (event: any) => {
    setEditorContent(event.target.value);
  };
  const onSubmit: SubmitHandler<any> = async (values) => {
    console.log(editorContent);
    setEditorContent("");
    const payload = {
      ticket: ticketList.id,

      generated_by_parent: ticketList.opened_by.id,
      response: editorContent,
    };
    console.log(payload);
    const res = await postResponse(payload);
    if (res === undefined) {
      alert("Error posting a comment");
    } else {
      alert("Comment posted");
    }
  };
  const [showIssue, setShowIssue] = useState(false);
  const handleIssueClick = () => {
    setShowIssue(true);
  };
  return (
    <>
      <div className="flex flex-row gap-2 text-md">
        <p> Ticket id</p>
        <p className=" font-bold">{ticketList.id}</p>
      </div>
      <div className="border mt-7  min-h-[200px] w-full  rounded-md shadow-md">
        <div className="bg-slate-100 min-h-[150px] ">
          <div className="text-3xl pl-10 pt-9"> {ticketList?.title}</div>
          <div className="mt-6 pl-10">
            {showIssue === false ? (
              <div
                className="pt-2 text-blue-800 cursor-pointer"
                onClick={handleIssueClick}
              >
                Show more
              </div>
            ) : (
              showIssue && (
                <div className="pt-4 font-bold">{ticketList.issue}</div>
              )
            )}
          </div>
        </div>
        <div className="flex flex-row space-x-20 p-5 pt-2 pl-10">
          <div className="flex flex-row">
            <Shapes size={30} />
            <div className="flex flex-col text-md">
              <Label className="font-bold"> Category </Label>
              <p className="text-sm">{ticketList?.category}</p>
            </div>
          </div>

          <div className="flex flex-row">
            <User size={30} />
            <div className="flex flex-col text-md">
              <Label className="font-bold"> Assigned to</Label>
              {ticketList?.assigned_to?.id === undefined ? (
                <>Not assigned</>
              ) : (
                <p className="text-sm">
                  {ticketList?.assigned_to?.first_name}{" "}
                  {ticketList?.assigned_to?.last_name}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-row">
            <BookA size={30} />
            <div className="flex flex-col text-md">
              <Label className="font-bold"> Student name</Label>
              <p className="text-sm">
                {ticketList?.student.student_first_name_english}
              </p>
            </div>
          </div>

          <div className="flex flex-row">
            <Activity size={30} />
            <div className="flex flex-col text-md">
              <Label className="font-bold">Status</Label>
              <p className="text-sm">{ticketList?.status}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-5 mt-10 pl-10">
        <Button
          variant={"secondary"}
          onClick={() => handleTabChange("Activity")}
          className={
            activeTab === "Activity"
              ? " border-blue-500 w-28 rounded-none border-b-4"
              : " w-28 rounded-none"
          }
        >
          Activity
        </Button>
        <Button
          variant={"secondary"}
          onClick={() => handleTabChange("Details")}
          className={
            activeTab === "Details"
              ? " border-blue-500 w-28 rounded-none border-b-4"
              : " w-28 rounded-none"
          }
        >
          Details
        </Button>
      </div>
      {activeTab === "Activity" && (
        <>
          <div className="px-16 mt-14">
            <Separator className="mt-12" />
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-row gap-3 mt-3">
                {ticketList.status === "Closed" ||
                ticketList.category !== "Technical" ? null : (
                  <>
                    <p className="font-bold">Add Comments</p>
                    <div className="w-full flex flex-col gap-12">
                      <Textarea
                        className="resize-none font-bold border bg-slate-100"
                        value={editorContent}
                        onChange={handleMessageChange}
                        placeholder="Enter your message here..."
                      />
                      <div className="flex justify-end ">
                        <Button type="submit">
                          {isLoading || isSubmitting ? (
                            <>
                              <div className="flex flex-row  items-center">
                                <Icons.spinner className="mr-2 h-6 w-4 animate-spin " />
                                Posting
                              </div>
                            </>
                          ) : (
                            "Post comment"
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </form>
            <div className="mt-5">
              <div className="mt-10 overflow-scroll no-scrollbar">
                {ticketList.ticket_responses.length === 0 ? (
                  <div className="flex justify-center">
                    No response against this ticket
                  </div>
                ) : (
                  ticketList.ticket_responses
                    .sort((a, b) => {
                      const dateA = new Date(a.created).getTime();
                      const dateB = new Date(b.created).getTime();

                      return dateB - dateA;
                    })
                    .map((response) => (
                      <div
                        key={response.id}
                        className="border p-4 mb-2 shadow-lg bg-slate-50"
                      >
                        <div className="font-bold">
                          {response.generated_by_staff
                            ? response.generated_by_staff.first_name
                            : response.generated_by_parent
                            ? response.generated_by_parent.parent_name_english
                            : "Unknown"}
                        </div>
                        <div>{response.response}</div>
                        <div className="text-right text-sm">
                          {format(new Date(response.created), "PPpp")}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {activeTab === "Details" && (
        <>
          <div className="grid grid-cols-2 gap-4 px-16 mt-14">
            <div className="grid grid-cols-3 gap-2 items-center">
              <p className="font-bold truncate">Ticket id</p>

              <Input
                value={ticketList?.id}
                readOnly
                className="bg-slate-100 w-[240px] font-bold"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 items-center">
              <p className="font-bold truncate">Opened</p>

              <Input
                value={format(new Date(ticketList?.created), "PPpp")}
                readOnly
                className="bg-slate-100 w-[240px] font-bold"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 items-center">
              <p className="font-bold truncate">Category</p>

              <Input
                value={ticketList?.category}
                readOnly
                className="bg-slate-100 w-[240px] font-bold"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 items-center">
              <p className="font-bold truncate">Opened by</p>

              <Input
                value={ticketList?.opened_by.parent_name_english}
                readOnly
                className="bg-slate-100 w-[240px] font-bold"
              />
            </div>
            {ticketList?.sub_category === null ? null : (
              <div className="grid grid-cols-3 gap-2 items-center">
                <p className="font-bold truncate">Sub category</p>

                <Input
                  value={ticketList?.sub_category}
                  readOnly
                  className="bg-slate-100 w-[240px] font-bold"
                />
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 items-center">
              <p className="font-bold truncate">Student name</p>

              <Input
                value={
                  ticketList?.student.student_first_name_english +
                  " " +
                  ticketList?.student.student_middle_name_english +
                  " " +
                  ticketList?.student.student_last_name_english
                }
                readOnly
                className="bg-slate-100 w-[240px] font-bold"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 items-center">
              <p className="font-bold truncate">Status</p>

              <Input
                value={ticketList?.status}
                readOnly
                className="bg-slate-100 w-[240px] font-bold"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 items-center">
              <p className="font-bold truncate">Assigned to</p>
              {ticketList?.assigned_to?.id === undefined ? (
                <Input
                  placeholder="Not assigned"
                  readOnly
                  className="bg-slate-100 w-[240px] font-bold"
                />
              ) : (
                <Input
                  value={
                    ticketList?.assigned_to?.first_name +
                    " " +
                    ticketList?.assigned_to?.last_name
                  }
                  readOnly
                  className="bg-slate-100 w-[240px] font-bold"
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ViewTicketDetail;
