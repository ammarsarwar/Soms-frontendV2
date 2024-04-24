import { getDismissalRequests } from "@/serverAcademics/dismissal/actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { tasks } from "./data/tasks";

const DismissalTable = async () => {
  const dismissalRequests = await getDismissalRequests();
  return <DataTable data={dismissalRequests} columns={columns} />;
};

export default DismissalTable;
