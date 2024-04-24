import React from "react";


interface StepThreeProps {
  testType: string | null; // Use the appropriate type
  slot: string | null; // Use the appropriate type
}
const StepThree: React.FC<StepThreeProps> = ({ testType, slot }) => {
  return (
    <div className="flex flex-col gap-4">
      <div>Selected Test Type: {testType}</div>
      <div>Selected Slot: {slot}</div>
    </div>
  );
};

export default StepThree;
