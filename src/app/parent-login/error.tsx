"use client";

import { Button } from "@/components/ui/button";

const error = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div>
      <p>{error.message}</p>
      <Button onClick={reset}>try again</Button>
    </div>
  );
};

export default error;
