import { columns } from "./columns";
import { getTicket } from "@/serverTeacher/tickets/actions";
import { DataTable } from "./data-table";
import { Ticket } from "./data/schema";
const TicketTable = async () => {
  const ticketList: Ticket[] = await getTicket();
  return <DataTable data={ticketList} columns={columns} />;
};

export default TicketTable;
