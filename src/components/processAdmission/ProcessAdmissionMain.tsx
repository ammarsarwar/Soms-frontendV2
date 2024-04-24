// ProcessAdmissionMain.tsx
"use client";
import React, { useState } from "react";
import AdmissionSteps from "./AdmissionSteps";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";
import { Calendar } from "@/components/ui/calendar";
const ProcessAdmissionMain: React.FC = () => {
  // const [currentStep, setCurrentStep] = useState(1);
  // const [testType, setTestType] = useState<string | null>(null);
  // const [slot, setSlot] = useState<string | null>(null);

  // const handleNextStep = () => {
  //   if (currentStep < 3) {
  //     setCurrentStep(currentStep + 1);
  //   }
  // };

  // const handlePreviousStep = () => {
  //   if (currentStep > 1) {
  //     setCurrentStep(currentStep - 1);
  //   }
  // };
  // const renderStep = () => {
  //   switch (currentStep) {
  //     case 1:
  //       return <StepOne onTestTypeChange={setTestType} />;
  //     case 2:
  //       return <StepTwo onSlotChange={setSlot} />;
  //     case 3:
  //       return <StepThree testType={testType} slot={slot} />;
  //     default:
  //       return null;
  //   }
  // };
  const [selectedTestType, setSelectedTestType] = useState<string | null>(null);
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <>
      <div className="h-[450px] w-full   overflow-scroll no-scrollbar  px-5 py-5 flex flex-col ">
        {/* <div>
          <AdmissionSteps currentStep={currentStep} />
        </div>
        <div className="pt-[20px]">{renderStep()}</div>
        <div className="flex justify-between pt-[220px]">
          <Button onClick={handlePreviousStep} disabled={currentStep === 1}>
            Back
          </Button>
          <Button onClick={handleNextStep}>
            {currentStep < 3 ? "Next" : "Send"}
          </Button>
        </div> */}
        <Tabs defaultValue="testType" className="w-full ">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="testType">Test type</TabsTrigger>
            <TabsTrigger value="testResult">Test result</TabsTrigger>
            <TabsTrigger value="registration">Registration</TabsTrigger>
          </TabsList>
          <TabsContent value="testType">
            <Card className="overflow-scroll no-scrollbar">
              <CardHeader>
                <CardTitle>Test type</CardTitle>
                <CardDescription>
                  Based on the type of selected test, the available slots will
                  appear
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-col items-center pt-5">
                  <div>
                    <Label>Select the type of test</Label>
                    <Select
                      onValueChange={(value) => setSelectedTestType(value)}
                    >
                      <SelectTrigger className="w-[600px]">
                        <SelectValue placeholder="Select a Test" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Tests</SelectLabel>
                          <SelectItem value="single">
                            Face to face meeting
                          </SelectItem>
                          <SelectItem value="group">Group test</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="pt-10">
                    <Label>Below are the available slots for group test</Label>
                    {selectedTestType && (
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="w-[300px]"
                      />
                    )}
                  </div>
                </div>
                {/* <div>
                  <AdmissionSteps currentStep={currentStep} />
                </div>
                <div className="pt-[20px]">{renderStep()}</div>
                <div className="flex justify-between pt-[220px]">
                  <Button
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1}
                  >
                    Back
                  </Button>
                  <Button onClick={handleNextStep}>
                    {currentStep < 3 ? "Next" : "Send"}
                  </Button>
                </div> */}
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="testResult">
            <Card>
              <CardHeader>
                <CardTitle>Test result</CardTitle>
                <CardDescription>
                  Here you can mark the student pass or fail
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 h-[100px]">
                <div className="flex flex-col gap-5">
                  <div>
                    <Select>
                      <SelectTrigger className="w-[600px]">
                        <SelectValue placeholder="Passed" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Results</SelectLabel>
                          <SelectItem value="Passed">Passed</SelectItem>
                          <SelectItem value="Failed">Failed</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save result</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="registration">
            <Card>
              <CardHeader>
                <CardTitle>Registeration </CardTitle>
                <CardDescription>
                  Here you can register the student
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-col gap-5 pl-40">
                  <div className="grid grid-cols-2">
                    <div className="flex flex-col gap-3">
                      <div className="text-2xl font-bold underline">
                        Student information
                      </div>
                      <p className="font-bold ">Student name</p>
                      <p className="font-bold ">Gender</p>
                      <p className="font-bold ">Date of birth</p>
                      <p className="font-bold ">Enrollment Grade</p>
                      <p className="font-bold ">Campus</p>
                      <p className="font-bold ">Branch</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <p>John</p>
                      <p>Male</p>
                      <p>12-25-2005</p>
                      <p>Grade 7</p>
                      <p>Boys</p>
                      <p>Madinah Branch</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="flex flex-col gap-3">
                      <div className="text-2xl font-bold underline">
                        Parent information
                      </div>
                      <p className="font-bold ">Parent name</p>
                      <p className="font-bold ">Email</p>
                      <p className="font-bold ">Contact number</p>
                      <p className="font-bold ">Address</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <p>Arthur</p>
                      <p>example@example.com</p>
                      <p>+43 5565 9883</p>
                      <p>example street, townsville</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-10">
                <Button>Register</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ProcessAdmissionMain;
