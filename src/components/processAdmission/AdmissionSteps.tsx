"use client";

// AdmissionSteps.tsx
import React from "react";
import { Progress } from "@/components/ui/progress";

interface AdmissionStepsProps {
  currentStep: number;
}

const AdmissionSteps: React.FC<AdmissionStepsProps> = ({ currentStep }) => {
  const steps = [
    { label: "Type of Test", step: 1 },
    { label: "Slot Selection", step: 2 },
    { label: "Review", step: 3 },
  ];

  const getProgressBarValue = (step: number) => {
    if (currentStep === step) return 50;
    if (currentStep > step) return 100;
    return 0;
  };

  return (
    <div className="flex w-full gap-4">
      {steps.map(({ label, step }) => (
        <div key={step} className="w-1/3">
          <Progress className="h-3" value={getProgressBarValue(step)} />
          <p className="text-center mt-2">{label}</p>
        </div>
      ))}
    </div>
  );
};

export default AdmissionSteps;
