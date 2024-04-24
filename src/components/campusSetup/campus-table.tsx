import { Campus } from "@/schemas";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getCampus } from "@/server/campus/actions";

const CampusTable = async () => {
  const campusList: Campus[] = await getCampus();
  return <DataTable data={campusList} columns={columns} />;
};

export default CampusTable;
