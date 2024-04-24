import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getIncidents } from "@/serverNurse/incidents/actions";
import { IncidentData } from "./data/schema";

const IncidentTable = async () => {
  const incidentList: IncidentData[] = await getIncidents();
  return <DataTable data={incidentList} columns={columns} />;
};

export default IncidentTable;
