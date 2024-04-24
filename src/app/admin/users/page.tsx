import { FC, Suspense } from "react";
import UserTable from "@/components/userManagment/users-table";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import NewUserDialog from "@/components/userManagment/new-user-dialog";

interface pageProps {}

const UserPage: FC<pageProps> = async ({}) => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Users List</h2>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <NewUserDialog />
            </div>
          </div>
        </div>
        <Suspense fallback={<BranchTableSkeleton />}>
          <UserTable />
        </Suspense>
      </div>
    </>
  );
};

export default UserPage;
