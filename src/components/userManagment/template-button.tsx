"use client";
import { Button } from "../ui/button";
import { CSVLink } from "react-csv";

const TemplateButton = ({}) => {
  const headers = [
    { label: "first_name", key: "first_name" },
    { label: "last_name", key: "last_name" },
    { label: "email", key: "email" },
    { label: "national_id", key: "national_id" },
  ];

  const data = [
    {
      first_name: "",
      last_name: "",
      email: "",
    },
  ];

  return (
    <CSVLink
      target="_blank"
      data={data}
      headers={headers}
      filename={"soms-user-import.csv"}
    >
      <Button variant={"outline"} size={"sm"}>
        Download Template
      </Button>
    </CSVLink>
  );
};

export default TemplateButton;
