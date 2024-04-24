"use client";
import { Button } from "../ui/button";
import { CSVLink } from "react-csv";

const StudentTemplateButton = ({}) => {
  const headers = [
    { label: "student_first_name_english", key: "student_first_name_english" },
    {
      label: "student_middle_name_english",
      key: "student_middle_name_english",
    },
    { label: "student_last_name_english", key: "student_last_name_english" },
    { label: "student_first_name_arabic", key: "student_first_name_arabic" },
    { label: "student_middle_name_arabic", key: "student_middle_name_arabic" },
    { label: "student_last_name_arabic", key: "student_last_name_arabic" },
    { label: "student_gender", key: "student_gender" },
    { label: "student_date_of_birth", key: "student_date_of_birth" },
    { label: "student_national_id", key: "student_national_id" },
    { label: "parent_name_english", key: "parent_name_english" },
    { label: "parent_name_arabic", key: "parent_name_arabic" },
    { label: "parent_email", key: "parent_email" },
    { label: "relation_to_child", key: "relation_to_child" },
    { label: "parent_phone_number", key: "parent_phone_number" },
    { label: "emergency_phone_number", key: "emergency_phone_number" },
  ];

  const data = [
    {
      student_first_name_english: "",
      student_middle_name_english: "",
      student_last_name_english: "",
      student_first_name_arabic: "",
      student_middle_name_arabic: "",
      student_last_name_arabic: "",
      student_gender: "",
      student_date_of_birth: "",
      student_national_id: "",
      parent_name_english: "",
      parent_name_arabic: "",
      parent_email: "",
      relation_to_child: "",
      parent_phone_number: "",
      emergency_phone_number: "",
    },
  ];

  return (
    <CSVLink
      target="_blank"
      data={data}
      headers={headers}
      filename={"soms-students-import.csv"}
    >
      <Button variant={"outline"}>Download Template</Button>
    </CSVLink>
  );
};

export default StudentTemplateButton;
