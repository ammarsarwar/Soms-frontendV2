import { FC } from "react";
import DismissalFrom from "@/components/dismissalSetup/dismissal-form";

interface pageProps {}

const DismissalFormPage: FC<pageProps> = () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Dismissal form
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s you can create a new dismissal request!
            </p>
          </div>
        </div>
        <div className="w-full">
          <DismissalFrom />
        </div>
      </div>
    </>
  );
};

export default DismissalFormPage;
