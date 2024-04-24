import { Ticket } from "@/TeacherComponents/support/data/schema";
import { getOneticket } from "@/serverTeacher/tickets/actions";
import ViewTicketDetail from "@/TeacherComponents/support/viewTicket";

const TicketDetail = async ({ params }: { params: { slug: string } }) => {
  const ticketId = params.slug;

  console.log("asdasdasdasdsd", ticketId);
  const ticketList: Ticket = await getOneticket(ticketId);
  console.log("ticketList", ticketList);
  return <ViewTicketDetail ticketList={ticketList} />;
};

export default TicketDetail;
