import React from "react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import GradeRollOver from "@/components/RollOver/GradeRollOver";

const page = () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Roll over</h2>
            <p className="text-muted-foreground">
              Here&apos;you can roll over courses and grades along with their
              sections to next academic year
            </p>
          </div>
        </div>
        <div className=" ">
          <div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Grade Roll-over</AccordionTrigger>
                <AccordionContent>
                  <div>
                    <GradeRollOver />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
