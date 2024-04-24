import Image from "next/image";
import { Skills } from "./data/schema";

type SkillsListProps = {
  allSkills: Skills[];
  selectedSkills: Skills[];
  toggleSkillSelection: (skill: Skills) => void;
};

const SkillsList: React.FC<SkillsListProps> = ({
  allSkills,
  selectedSkills,
  toggleSkillSelection,
}) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {allSkills.map((skill, index) => (
        <div
          key={index}
          className={`flex flex-col w-[170px] gap-1 items-center relative border ${
            selectedSkills.find((s) => s.name === skill.name)
              ? "border-1 border-blue-700"
              : "border-gray-200"
          } rounded-md p-2 cursor-pointer bg-slate-100`}
          onClick={() => toggleSkillSelection(skill)}
        >
          <div className="absolute -right-2 -top-2 z-10 flex items-center justify-center h-6 w-6 bg-green-500 rounded-full text-white text-xs">
            {skill.points}
          </div>
          {skill.icon && typeof skill.icon === "string" ? (
            <Image src={skill.icon} alt={skill.name} width={50} height={50} />
          ) : (
            <div className="fallback-image">No Icon</div>
          )}
          <p className="text-center text-sm mt-2">{skill.name}</p>
        </div>
      ))}
    </div>
  );
};

export default SkillsList;
