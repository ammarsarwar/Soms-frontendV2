import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

const ParentDashboard = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  return (
    <>
      <div>This is the parent dashboard</div>
    </>
  );
};

export default ParentDashboard;
