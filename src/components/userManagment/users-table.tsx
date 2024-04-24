import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getUsers } from "@/server/user/action";

const UserTable = async () => {
  const userList = await getUsers();
  return <DataTable data={userList} columns={columns} />;
};

export default UserTable;
