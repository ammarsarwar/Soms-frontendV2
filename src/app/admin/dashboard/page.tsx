import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminDashboard = async () => {
  const user = await getCurrentUser();
  console.log("my user", user);
  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  return (
    <div className="flex flex-col gap-3">
      <Alert className="border border-primary border-dashed animate-pulse">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          The application is currently in active development, Please report any
          bug and issue you may encounter during testing.
        </AlertDescription>
      </Alert>
      <div>You are logged in as {user?.first_name}</div>
    </div>
  );
};

export default AdminDashboard;
