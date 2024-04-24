import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getSection } from "@/serverAcademics/section/actions";
import { Section } from "./data/schema";

const SectionTable = async () => {
  const sectionList: Section[] = await getSection();
  return <DataTable data={sectionList} columns={columns} />;
};

export default SectionTable;
