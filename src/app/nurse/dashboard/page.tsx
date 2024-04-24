import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
const NurseDashboard = async () => {
  const user = await getCurrentUser();
  // console.log("my user", user);
  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  return (
    <>
      <div>
        This is the Nurse dashboard You are logged in as {user?.first_name}
      </div>
    </>
  );
};

export default NurseDashboard;
