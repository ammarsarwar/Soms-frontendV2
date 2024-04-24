"use client";

import React, { useState, useRef, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Calendar } from "@/components/ui/calendar";
import { getTimeSlots } from "@/server/timeslot/actions";
import { postTimeSlot } from "@/server/timeslot/actions";


import { getDept } from "@/serverAcademics/department/actions";
import { User } from "@/components/TeacherSchema/schema";
import { Icons } from "@/components/ui/icons";
import { getTeacherUsers } from "@/serverAcademics/user/action";
import { getCalendar } from "@/server/admissions_calendar/actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Department, TAdmissionCalenderSchema } from "@/schemas";

interface Event {
  deptName?: string;
  available: boolean;
  branchName?: string;
  campusName?: string;
  numberOfStudents: number;
  teacherName: string;
  start: string; // Use string to represent date and time for form inputs
  end: string;
  selectedDate: Date;
  selectedEndDate: Date;
  calendarName: string;
  isRecurring: boolean;
  selectedDays: string[];
  id?: string; // Optional, use if necessary
  department?: string; // Optional, use if necessary
  allDay: boolean;
}
import { TEventSchema } from "@/components/timeSlots/schema";
const TestSlot: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [tempEvent, setTempEvent] = useState<Event | null>(null);

  const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null);

  const [numberOfStudents, setNumberOfStudents] = useState(0);

  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);

  const [hasFetchedTeachers, setHasFetchedTeachers] = useState(false);
  const [teachers, setTeachers] = useState<User[]>([]);

  const [selectedDays, setSelectedDays] = useState<Array<string>>([]);
  const [calendar, setCalendar] = useState<TAdmissionCalenderSchema[]>([]);

  const [department, setDepartment] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [hasFetchedAdm, setHasFetchedAdm] = useState(false);
  const [selectedCalendar, setSelectedCalendar] =
    useState<TAdmissionCalenderSchema | null>(null);

  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  useEffect(() => {
    console.log("Updated Teachers State:", teachers);
  }, [teachers]);

  const form = useForm<Event>({
    defaultValues: {
      branchName: "",
      campusName: "",
      deptName: "",
      numberOfStudents: 0,
      calendarName: "",
      teacherName: "",
      start: "",
      end: "",
      selectedDate: new Date(),
      selectedEndDate: new Date(),
      isRecurring: false,
      selectedDays: [],
      id: "", // Only if you need it in the form, otherwise you can omit it
      department: "", // Optional based on your form structure
    },
    mode: "onChange",
  });

  const fetchCalendar = async () => {
    setLoading(true);
    try {
      const fetchedCalendar = await getCalendar();
      setCalendar(fetchedCalendar);
      console.log("fetchedCalendar", fetchedCalendar);
      setError(null);
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to fetch calendars");
    } finally {
      setLoading(false);
    }
  };

  const handleAdmissionSelect = () => {
    if (!hasFetchedAdm) {
      fetchCalendar();
      setHasFetchedAdm(true);
    }
  };

  const handleCalendarChange = (calendarName: any) => {
    const calendars =
      calendar.find((b) => b.start_date + b.end_date === calendarName) || null;
    console.log("Selected calendar:", calendars?.id);
    setSelectedCalendar(calendars);
  };

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const departments = await getDept();
      console.log("Fetched departments:", departments);
      setDepartment(departments || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDeptChange = (deptName: any) => {
    const selected = department.find((d: any) => d.name === deptName) || null;
    setSelectedDepartment(selected);
    if (selected) {
      console.log("Selected campus ID:", selected.id);
    }
  };
  const handleSelectFocus = () => {
    if (!hasFetched) {
      fetchDepartments();
      setHasFetched(true);
    }
  };

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const fetchedTeachers = await getTeacherUsers();
      console.log("Fetched Teachers:", fetchedTeachers); // Check the fetched data

      setTeachers(fetchedTeachers || []);
      console.log(" Teachers:", teachers);
    } catch (error: any) {
      console.error("Error fetching teachers:", error);
      setError(error.message || "Failed to fetch teachers");
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherFocus = () => {
    if (!hasFetchedTeachers) {
      fetchTeachers();
      setHasFetchedTeachers(true);
    }
  };
  const calendarRef = useRef<FullCalendar>(null);

  const handleTeacherChange = (teacherName: string) => {
    const selectedTeacher = teachers.find(
      (teacher) =>
        `${teacher.user.first_name} ${teacher.user.last_name}` === teacherName
    );
    setSelectedTeacher(selectedTeacher ?? null);
  };
  const {
    reset,
    register,
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const isRecurringChecked = watch("isRecurring");

  const onSubmit = async (values: any) => {
    console.log(values);
    try {
      // Parse and combine date and time for startDateTime and endDateTime
      const selectedDate = new Date(values.selectedDate);
      const startDateTime = new Date(selectedDate.getTime());
      startDateTime.setHours(
        parseInt(values.start.split(":")[0]),
        parseInt(values.start.split(":")[1])
      );

      const endDateTime = new Date(selectedDate.getTime());
      endDateTime.setHours(
        parseInt(values.end.split(":")[0]),
        parseInt(values.end.split(":")[1])
      );
      // Check if the selected teacher is already assigned to another event at the same time
      const isTeacherAlreadyAssigned = allEvents.some((event) => {
        if (event.teacherName !== values.teacherName) return false;

        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        return startDateTime < eventEnd && endDateTime > eventStart;
      });

      if (isTeacherAlreadyAssigned) {
        alert(
          "This teacher is already assigned to another event at the same time. Please choose a different teacher."
        );
        return;
      }

      let postData: {
        date: string;
        start_time: string;
        end_time: string;
        max_students: number;
        is_recurring: boolean;
        teacher: number | undefined;
        admission_calendar: number | undefined;
        department: number | undefined;
        end_date?: string;
        recurring_days?: string[];
      } = {
        date: format(selectedDate, "yyyy-MM-dd"),
        start_time: format(startDateTime, "HH:mm:ss"),
        end_time: format(endDateTime, "HH:mm:ss"),
        max_students: Number(values.numberOfStudents),
        is_recurring: values.isRecurring,
        teacher: selectedTeacher?.id,
        admission_calendar: selectedCalendar?.id,
        department: selectedDepartment?.id,
      };
      if (values.isRecurring) {
        postData["end_date"] = format(
          new Date(values.selectedEndDate),
          "yyyy-MM-dd"
        );
        postData["recurring_days"] = values.selectedDays;
      }

      console.log("postData payload", postData);

      const response = await postTimeSlot(postData);
      console.log("Post response:", response);
      if (response !== undefined) {
        alert("Event created successfully.");
      } else {
        alert("Error: Event was not created successfully. Please try again.");
      }

      // resetFormFields();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        "Error: Failed to create the event. Please check your network and try again."
      );
    }
  };

  const resetFormFields = () => {
    setDepartment([]);
    setNumberOfStudents(0);

    setEventStartTime("");
    setEventEndTime("");
    setIsRecurring(false);
    setSelectedDays([]);
  };
  async function fetchEvents() {
    setLoading(true);
    try {
      const fetchedEvents = await getTimeSlots();
      console.log("Fetched Events:", fetchedEvents); // Assume this function is imported from actions.ts
      const transformedEvents: Event[] = fetchedEvents.map(
        (event: TEventSchema) => {
          // Assuming the 'date' field contains the date in 'YYYY-MM-DD' format
          const startDate = new Date(`${event.date}T${event.start_time}`);
          const endDate = new Date(`${event.date}T${event.end_time}`);

          return {
            // Assuming department is a string as per your Event interface
            branchName: "Some branch name", // You need to provide a string here, not an object
            campusName: "Some campus name", // You need to provide a string here, not an object
            numberOfStudents: event.max_students,
            teacherName: `${event.teacher.first_name} ${event.teacher.last_name}`,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            selectedDate: startDate,
            selectedEndDate: endDate,
            calendarName: event.admission_calendar
              ? `${event.admission_calendar.start_date} to ${event.admission_calendar.end_date}`
              : "",
            isRecurring: false, // You need to determine this based on your data
            selectedDays: [], // You need to determine this based on your data
            id: event.id.toString(),
            department: event.department, // Assuming this is a string
            allDay: false, // Assuming this is correct as per your data
            available: event.available,
          };
        }
      );

      setAllEvents(transformedEvents);
      console.log("All Events State Updated:", allEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
    setLoading(false);
  }
  useEffect(() => {
    fetchEvents();
  }, []);

  const renderEventContent = (eventInfo: any) => {
    const startTime = new Date(eventInfo.event.start).toLocaleTimeString([], {
      timeStyle: "short",
    });
    const endTime = new Date(eventInfo.event.end).toLocaleTimeString([], {
      timeStyle: "short",
    });
    return (
      <>
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex flex-col gap-1 p-1 m-2">
              <div className=" text-xs font-bold">{`${startTime} - ${endTime}`}</div>
              <div className="text-xs font-bold">
                {eventInfo.event.extendedProps.department}
              </div>
              {/* <div className="font-bold">
            {eventInfo.event.extendedProps.department}
          </div>
          <div className="font-bold">
            {eventInfo.event.extendedProps.numberOfStudents}
          </div>
          <div className="font-bold">
            {eventInfo.event.extendedProps.teacherName}
          </div> */}
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[750px] h-[600px] overflow-scroll no-scrollbar">
            <DialogHeader>
              <DialogTitle>Test slot</DialogTitle>
              <DialogDescription>
                Here you can view test slot information
              </DialogDescription>
            </DialogHeader>
            <div className="mt-3 flex flex-col gap-5 sm:mt-5">
              <div className="grid gap-3">
                <Label htmlFor="calendarName"> Admission calendar</Label>
                <Input
                  value={eventInfo.event.extendedProps.calendarName}
                  readOnly
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="selectedDate"> Date</Label>
                <Input
                  value={eventInfo.event.extendedProps.selectedDate}
                  readOnly
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="department">Start and end time</Label>
                <Input value={startTime + "-" + endTime} readOnly />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="department">Department</Label>
                <Input
                  value={eventInfo.event.extendedProps.department}
                  readOnly
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="teacherName">Teacher name</Label>
                <Input
                  value={eventInfo.event.extendedProps.teacherName}
                  readOnly
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="numberOfStudents">Number of vacancies</Label>
                <Input
                  value={eventInfo.event.extendedProps.numberOfStudents}
                  readOnly
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="available">Still available for booking?</Label>
                {eventInfo.event.extendedProps.available === true ? (
                  <>
                    <Input value={"Yes"} readOnly />
                  </>
                ) : (
                  <Input value={"No"} readOnly />
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  };

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Time slot Management
          </h2>
          <p className="text-muted-foreground">
            Here you can create and view the test time slots
          </p>
        </div>
        <div className="flex flex-row gap-3 justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[750px] h-[600px] overflow-scroll no-scrollbar">
              <DialogHeader>
                <DialogTitle>Test slot</DialogTitle>
                <DialogDescription>
                  Here you can create test slots for admission calendar
                </DialogDescription>
              </DialogHeader>
              <div className="p-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mt-3 flex flex-col gap-5 sm:mt-5">
                    <div className="grid gap-3">
                      <Label htmlFor="calendarName">
                        Select Admission calendar
                      </Label>

                      <Controller
                        name="calendarName"
                        control={control}
                        rules={{
                          required: "calendar selection is required",
                        }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <Select
                            value={value}
                            onValueChange={(val) => {
                              onChange(val);
                              handleCalendarChange(val);
                            }}
                            onOpenChange={handleAdmissionSelect}
                            disabled={loading}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  loading ? "Loading..." : "Select a calendar"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                                <SelectLabel>Calendar</SelectLabel>
                                {calendar.map((calendars) => (
                                  <SelectItem
                                    key={calendars.id}
                                    value={
                                      calendars.start_date + calendars.end_date
                                    }
                                  >
                                    {calendars.start_date}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.calendarName && (
                        <small className="text-red-500 font-bold">
                          {errors.calendarName.message}
                        </small>
                      )}
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="deptName">Select Department</Label>
                      <Controller
                        name="deptName"
                        control={control}
                        rules={{
                          required: "Department selection is required",
                        }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <Select
                            value={value}
                            onValueChange={(val) => {
                              onChange(val);
                              handleDeptChange(val);
                            }}
                            onOpenChange={handleSelectFocus}
                            disabled={loading}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  loading ? "Loading..." : "Select a department"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup className="h-36 overflow-scroll no-scrollbar">
                                <SelectLabel>Department</SelectLabel>
                                {department.length > 0 ? (
                                  department.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.name}>
                                      {dept.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectLabel>
                                    This campus does not have any department,
                                    please create a department first
                                  </SelectLabel>
                                )}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />

                      {errors.deptName && (
                        <small className="text-red-500 font-bold">
                          {errors.deptName.message}
                        </small>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="level">Number of vacancies</Label>
                      <Input
                        id="vacancies"
                        placeholder="Enter Number of vacancies"
                        type="number"
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect="off"
                        {...register("numberOfStudents", {
                          required: {
                            value: true,
                            message: "Number of vacancies is required",
                          },
                        })}
                        disabled={isLoading || isSubmitting}
                      />

                      {errors.numberOfStudents && (
                        <small className="text-red-500 font-bold">
                          {errors.numberOfStudents?.message}
                        </small>
                      )}
                    </div>
                    <div>
                      <Controller
                        name="teacherName"
                        control={control}
                        rules={{
                          required: "Teacher selection is required",
                        }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <Select
                            value={value}
                            onValueChange={(val) => {
                              onChange(val);
                              handleTeacherChange(val);
                            }}
                            onOpenChange={handleTeacherFocus}
                            disabled={loading}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a Teacher" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {teachers.map((teacher) => (
                                  <SelectItem
                                    key={teacher.id}
                                    value={
                                      teacher.user.first_name +
                                      " " +
                                      teacher.user.last_name
                                    }
                                  >
                                    {teacher.user.first_name +
                                      " " +
                                      teacher.user.last_name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />

                      {errors.teacherName && (
                        <small className="text-red-500 font-bold">
                          {errors.teacherName.message}
                        </small>
                      )}
                    </div>
                    <div>
                      <Controller
                        name="selectedDate"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <div>
                            <Label>Select Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {value ? (
                                    format(value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={value}
                                  onSelect={(date) => {
                                    if (date) onChange(date);
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        )}
                      />
                    </div>

                    <div className="mt-2">
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                        {...register("start")}
                      />
                    </div>
                    <div className="mt-2">
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                        {...register("end")}
                      />
                    </div>
                    <div className="mt-4">
                      <div className="flex flex-row gap-1 items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          {...register("isRecurring")}
                        />
                        <Label>Is this event recurring?</Label>
                      </div>
                    </div>
                    {isRecurringChecked && (
                      <>
                        <div>
                          <Controller
                            name="selectedEndDate"
                            control={control}
                            rules={{
                              required: isRecurring
                                ? "End date is required for recurring events"
                                : false,
                            }}
                            render={({ field: { onChange, value } }) => (
                              <div>
                                <Label>Select End date</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full justify-start text-left font-normal"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {value ? (
                                        format(value, "PPP")
                                      ) : (
                                        <span>Pick an end date</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={value}
                                      onSelect={(date) => {
                                        if (date) onChange(date);
                                      }}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                            )}
                          />
                        </div>
                        <div>
                          <Label>Select Recurring Days</Label>
                          <div className="flex flex-wrap">
                            {[
                              "Sunday",
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                            ].map((day) => (
                              <div
                                key={day}
                                className="flex items-center mr-4 mb-2"
                              >
                                <input
                                  type="checkbox"
                                  id={day}
                                  {...register("selectedDays")}
                                  value={day}
                                  checked={selectedDays.includes(day)}
                                  onChange={(e) => {
                                    const updatedDays = e.target.checked
                                      ? [...selectedDays, day]
                                      : selectedDays.filter((d) => d !== day);
                                    setSelectedDays(updatedDays);

                                    form.setValue("selectedDays", updatedDays);
                                  }}
                                  className="form-checkbox"
                                />
                                <Label htmlFor={day} className="ml-2 text-sm">
                                  {day}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <DialogFooter>
                    {" "}
                    <div className="mt-5 sm:mt-6">
                      <Button
                        disabled={isLoading || isSubmitting}
                        type="submit"
                      >
                        {isLoading ||
                          (isSubmitting && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          ))}
                        Create
                      </Button>
                    </div>
                  </DialogFooter>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <main className="flex flex-col p-5">
          <div className="my-custom-calendar">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridWeek"
              events={allEvents}
              eventContent={renderEventContent}
              nowIndicator={true}
              editable={false}
              selectable={false}
              headerToolbar={{
                left: "",
                center: "title",
                right: "prev,today,next",
              }}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default TestSlot;
