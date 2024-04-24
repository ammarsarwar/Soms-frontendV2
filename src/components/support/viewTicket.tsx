"use client";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Icons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/components/support/data/schema";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { postResponse } from "@/server/tickets/actions";
import { useSession } from "next-auth/react";
import { Controller, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { assignTicket } from "@/server/tickets/actions";
import { Shapes, UserCheck, BookA, Activity, Clock10 } from "lucide-react";
import { getUsers } from "@/server/user/action";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TUserSchema } from "@/schemas";
interface ViewTicketDetailProps {
  ticketList: Ticket;
}

interface FormData {
  userName: string;
}

const ViewTicketDetail: React.FC<ViewTicketDetailProps> = ({ ticketList }) => {
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors, isLoading, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const { data: session, status } = useSession();

  const [activeTab, setActiveTab] = useState("Activity");

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

    if (session && session.user && session.user.id) {
      const userId = session.user.id;
      const payload = {
        ticket: ticketList.id,
        generated_by_staff: Number(userId),
        response: editorContent,
      };

      console.log(payload);

      const res = await postResponse(payload);

      if (res === undefined) {
        alert("Error posting a comment");
      } else {
        alert("Comment posted");
      }
    } else {
      console.error("User session is null");
    }
  };
  const onStatusSubmit: SubmitHandler<any> = async (values) => {
    if (ticketList.category === "Other") {
      const payload = {
        assigned_to: selectedUser?.id,
      };
      console.log(payload);
      try {
        const res = await assignTicket(payload, ticketList.id);
        if (res === undefined) {
          alert("Error assigning this ticket to this person");
        } else {
          alert("Ticket assigned");
        }
      } catch (error: any) {
        console.log(error);
      }
    } else if (session && session.user && session.user.id) {
      const userId = session.user.id;
      const payload = {
        assigned_to: userId,
      };
      console.log(payload);
      const res = await assignTicket(payload, ticketList.id);

      if (res === undefined) {
        alert("Error assigning this ticket to myself");
      } else {
        alert("Ticket assigned to my self");
      }
    }
  };
  const [showIssue, setShowIssue] = useState(false);
  const handleIssueClick = () => {
    setShowIssue(true);
  };

  const [users, setUsers] = useState<TUserSchema[]>([]);
  const [selectedUser, setSelectedUser] = useState<TUserSchema | null>(null);

  const allUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers(); // Ensure this function is implemented correctly
      setUsers(response); // Assuming response is an array of User objects
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (ticketList.category === "Other") {
      allUsers();
    }
  }, [ticketList.category]); // Only re-run if ticketList.category changes

  const handleUserChange = (userName: string) => {
    const user = users.find(
      (u) => `${u.first_name} ${u.last_name}` === userName
    );
    if (user) {
      setSelectedUser(user);
      console.log("User id is", user.id);
    } else {
      setSelectedUser(null);
      console.log("No user id found");
    }
  };

  return (
    <>
      <div className="flex flex-row gap-2 text-md text-3xl">
        Ticket ID
        <p className=" font-bold">{ticketList.id}</p>
      </div>
      <div className="border mt-7  min-h-[200px] w-full  rounded-md shadow-md">
        <div className="bg-slate-100 min-h-[150px] ">
          <div className="text-3xl pl-10 pt-9"> {ticketList?.title}</div>
          <div className="mt-6 pl-10">
            {showIssue === false ? (
              <div className="pt-2 text-blue-800 cursor-pointer">
                <p onClick={handleIssueClick}>Show more</p>
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
            <UserCheck size={30} />
            <div className="flex flex-col text-md">
              <Label className="font-bold"> Assigned to</Label>
              {ticketList?.assigned_to?.id === undefined ? (
                <p className="text-sm">Not assigned</p>
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
          <div className="flex flex-row">
            <Clock10 size={30} />
            <div className="flex flex-col text-md">
              <Label className="font-bold">Opened</Label>
              <p className="text-sm">
                {format(new Date(ticketList?.created), "PPpp")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
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
        {/* {ticketList?.assigned_to?.id !== undefined ||
        ticketList.category !== "Technical" ? null : (
          <>
            <form onSubmit={handleSubmit(onStatusSubmit)}>
              <div className="mt-5">
                <Button type="submit">
                  {isLoading || isSubmitting ? "Assigning" : "Assign to myself"}
                </Button>
              </div>
            </form>
          </>
        )} */}
        {ticketList?.assigned_to?.id !==
        undefined ? null : ticketList?.category === "Technical" ? (
          <>
            <form onSubmit={handleSubmit(onStatusSubmit)}>
              <div className="mt-5">
                <Button type="submit">
                  {isLoading || isSubmitting ? "Assigning" : "Assign to myself"}
                </Button>
              </div>
            </form>
          </>
        ) : (
          ticketList?.category === "Other" && (
            <>
              <form onSubmit={handleSubmit(onStatusSubmit)}>
                <div className="mt-5 flex flex-row gap-1">
                  {selectedUser ? (
                    <>
                      <Button
                        disabled={isLoading || isSubmitting}
                        variant={"link"}
                        type="submit"
                      >
                        {isLoading ||
                          (isSubmitting && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          ))}
                        Assign ticket
                      </Button>
                    </>
                  ) : null}
                  <Controller
                    name="userName"
                    control={control}
                    rules={{ required: "User selection is required" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Select
                        value={value}
                        onValueChange={(val) => {
                          onChange(val); // This updates the form value
                          handleUserChange(val); // This sets the selected user
                        }}
                        disabled={loading}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue
                            placeholder={
                              loading ? "Loading..." : "Select a User"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>User</SelectLabel>
                            {users.map((user) => (
                              <SelectItem
                                key={user.id}
                                value={user.first_name + " " + user.last_name}
                              >
                                {`${user.first_name} ${
                                  user.last_name
                                } (${user.user_profiles
                                  .map((profile) => profile.userRole)
                                  .join(", ")})`}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </form>
            </>
          )
        )}
      </div>

      {activeTab === "Activity" && (
        <>
          <div className="px-16 mt-14">
            <Separator className="mt-12" />
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-row gap-3 mt-3">
                {ticketList.status === "Closed" ||
                ticketList?.assigned_to?.id === null ? null : (
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
