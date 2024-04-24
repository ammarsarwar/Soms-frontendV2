import MidYearComponent from "@/components/midYearTransferStudent/mid-year-component";
import StudentTemplateButton from "@/components/midYearTransferStudent/student-tempate-button";
import { Button } from "@/components/ui/button";
import React from "react";

const MidYearStudentTransferPage = () => {
  return (
    <>
      <div className="hidden h-full w-full flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Import Students
            </h2>
            <p className="text-muted-foreground">Ensure file format is CSV</p>
          </div>
          <StudentTemplateButton />
        </div>
        <div>
          <MidYearComponent />
        </div>
      </div>
    </>
  );
};

export default MidYearStudentTransferPage;
