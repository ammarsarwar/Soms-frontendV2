import { Branch } from "@/schemas";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getBranches } from "@/server/branch/actions";

const BranchTable = async () => {
  const branchList: Branch[] = await getBranches();
  return <DataTable data={branchList} columns={columns} />;
};

export default BranchTable;
