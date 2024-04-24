"use client";

import { TKgStudentReportCardDataSchema } from "@/schemas";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeAlert } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useReportsStore } from "@/GlobalStore/reportsStore";
import { useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import KgReportForm from "./kg-report-form";
import KgReportUpdateForm from "./kg-report-update-form";

const KgReportPage = ({
  student,
  studentId,
}: {
  student: TKgStudentReportCardDataSchema;
  studentId: number;
}) => {
  const { studentReportsData } = useReportsStore();
  const kgReportRef = useRef(null);
  const [open, setOpen] = useState(false);

  const addEvaluation = async () => {};

  const updateEvaluation = async () => {};

  const generateReportPdf = async () => {
    const inputData = kgReportRef.current;
    const report = document.getElementById("kg-student-report");
    if (report)
      try {
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: "a4",
        });

        const width = pdf.internal.pageSize.getWidth();
        const canvas = await html2canvas(report, {
          scale: 595.26 / width,
          scrollY: 0,
        });
        const imgData = canvas.toDataURL("image/png");

        const height = (canvas.height * width) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save(
          `${student.student_data.student_first_name_english}-${student.student_data.student_middle_name_english}-${student.student_data.student_last_name_english}.pdf`
        );
      } catch (error) {
        console.log(error);
      }
    // // Assuming you have a DOM element with id "kg-student-report"
    // const html2pdf = await import("html2pdf.js/dist/html2pdf")
    // const report = document.getElementById("kg-student-report");
    // if (report) {
    //   const content = document.createElement("div");
    //   content.innerHTML = report.innerHTML;
    //   content.style.width = "800px"; // Adjust width as needed
    //   const options = {
    //     image: { type: "jpeg", quality: 0.9 },
    //     html2canvas: { scale: 2 },
    //   };
    //   html2pdf().set(options).from(content).save("ssjf.pdf");
    // } else {
    //   console.error("Element with id 'kg-student-report' not found.");
    // }
    // // Convert HTML element to canvas using html2canvas
    // html2canvas(content, { scale: 2 }).then((canvas) => {
    //   // Create a new jsPDF instance
    //   const pdf = new jsPDF();
    //   // Calculate dimensions to fit the whole canvas into the PDF
    //   const width = pdf.internal.pageSize.getWidth();
    //   const height = canvas.height * (width / canvas.width);
    //   // Add canvas image to PDF
    //   const imgData = canvas.toDataURL("image/png");
    //   pdf.addImage(imgData, "PNG", 0, 0, width, height);
    //   // Save PDF to file
    //   pdf.save("hhh.pdf");
    // });
  };

  const maxAssessments = useMemo(() => {
    return student.courses.reduce(
      (max, course) => Math.max(max, course.assessments.length),
      0
    );
  }, [student.courses]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col p-4 border border-slate-300 rounded-md w-full">
        <div className="flex justify-between gap-2 items-center p-2 mb-2">
          <div className="flex gap-2">
            <Avatar>
              <AvatarImage src="" alt="@shadcn" />
              <AvatarFallback>
                {student.student_data.student_first_name_english.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-semibold">
                {student.student_data.student_first_name_english}{" "}
                {student.student_data.student_middle_name_english}{" "}
                {student.student_data.student_last_name_english}
              </p>
              <span className="text-sm text-muted-foreground">123444</span>
            </div>
          </div>
          {/* <div>
            <Button>Download Pdf</Button>
          </div> */}
        </div>
        <Separator />
        <div className="flex justify-between mb-2 mt-2 p-2">
          <div className="flex flex-col">
            <p className="text-sm font-semibold">Academic year</p>
            <span className="text-sm text-muted-foreground">
              {student.student_grade.academic_year?.start_year}{" "}
              {student.student_grade.academic_year?.end_year}
            </span>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold">Current semester</p>
            <span className="text-sm text-muted-foreground">
              {
                student.courses[0].assessments[0].semester_record[0]
                  .semester_name
              }
            </span>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold">Branch</p>
            <span className="text-sm text-muted-foreground">
              {student.student_grade.department.campus.branch.name}
            </span>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold">Campus</p>
            <span className="text-sm text-muted-foreground">
              {student.student_grade.department.campus.name}
            </span>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold">Department</p>
            <span className="text-sm text-muted-foreground">
              {student.student_grade.department.name}
            </span>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold">Grade</p>
            <span className="text-sm text-muted-foreground">
              {student.student_grade.name}
            </span>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2 mt-2 p-2">
          <p className="text-sm font-semibold ">Remarks</p>
          <div className="bg-primary p-3 rounded-sm flex justify-between">
            <div className="flex gap-2 items-center text-white">
              <BadgeAlert />
              <span className="text-sm font-semibold ">
                {student.report
                  ? "Student report successfully generated, Please download your report or update evalutaion"
                  : "Report card is not finalized yet, Please add final evalution and final comments"}
              </span>
            </div>
            {student.report ? (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size={"sm"} variant={"outline"}>
                    Update Evaluation
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Final Evaluation</DialogTitle>
                  </DialogHeader>
                  <KgReportUpdateForm setOpen={setOpen} student={student} />
                  <DialogFooter></DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size={"sm"} variant={"outline"}>
                    Add Evaluation
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Final Evaluation</DialogTitle>
                  </DialogHeader>
                  <KgReportForm
                    setOpen={setOpen}
                    studentId={student.student_data.id}
                  />
                  <DialogFooter></DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col p-4 border border-slate-300 rounded-md w-full h-full">
        <div className="flex w-full justify-end">
          <Button onClick={generateReportPdf}>Generate Pdf</Button>
        </div>
        <div className="mt-4 p-4">
          <div id="kg-student-report">
            <div className="m-12">
              <div className="pt-12">
                <div className="gird grid-cols-1 grid-rows-5">
                  <div className="items-center text-center text-md bg-[#CFE2F3] p-2 font-semibold border-r-2 border-l-2 border-t-2 border-black">
                    Student Information
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="p-2 col-span-1 border-r-2 border-l-2 border-t-2 border-b-2 border-black">
                      Student Name
                    </div>
                    <div className="p-2 col-span-1 border-r-2 border-t-2 border-b-2 border-black">
                      {student.student_data.student_first_name_english}{" "}
                      {student.student_data.student_middle_name_english}{" "}
                      {student.student_data.student_last_name_english}{" "}
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="p-2 col-span-1 border-r-2 border-l-2  border-b-2 border-black">
                      Student ID
                    </div>
                    <div className="p-2 col-span-1 border-r-2  border-b-2 border-black">
                      {student.student_data.student_national_id}
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="p-2 col-span-1 border-r-2 border-l-2  border-b-2 border-black">
                      {student.student_grade.department.name}
                    </div>
                    <div className="p-2 col-span-1 border-r-2 border-b-2 border-black">
                      {student.student_grade.name}
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="p-2 col-span-1 border-r-2 border-l-2 border-b-2 border-black">
                      Academic Year
                    </div>
                    <div className="p-2 col-span-1 border-r-2 border-b-2 border-black">
                      {student.student_grade.academic_year?.start_year}-
                      {student.student_grade.academic_year?.end_year}
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="w-full border-2 border-slate-500">
                <div className="flex items-center justify-center bg-[#CFE2F3] p-2">
                  <p className="text-sm font-semibold">
                    {student.student_grade.department.name} Student Assessment
                  </p>
                </div>
                <div className="grid grid-cols-2 grid-rows-1 divide-x divide-gray-500">
                  <div className="grid grid-cols-2 grid-rows-3 divide-x divide-gray-500">
                    <div className="flex flex-col justify-center items-center">
                      <p>Student Name</p>
                    </div>
                    <div className="flex justify-center p-2">
                      <p>
                        {student.student_data.student_first_name_english}{" "}
                        {student.student_data.student_middle_name_english}{" "}
                        {student.student_data.student_last_name_english}{" "}
                      </p>
                    </div>
                    <div className="flex justify-center p-2">
                      <p>Parent Name</p>
                    </div>
                    <div className="flex justify-center p-2">
                      <p>{student.student_data.parent_name_arabic}</p>
                    </div>
                    <div className="flex justify-center p-2">
                      <p>National Id</p>
                    </div>
                    <div className="flex justify-center p-2">
                      <p>123-333</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 grid-rows-3 divide-x divide-gray-500">
                    <div className="flex justify-center p-2">
                      <p>أسم الطالب</p>
                    </div>
                    <div className="flex justify-center p-2">
                      <p>
                        {student.student_data.student_first_name_english}{" "}
                        {student.student_data.student_middle_name_english}{" "}
                        {student.student_data.student_last_name_english}{" "}
                      </p>
                    </div>
                    <div className="flex justify-center p-2">
                      <p>اسم الوالدين</p>
                    </div>
                    <div className="flex justify-center p-2">
                      <p>{student.student_data.parent_name_arabic}</p>
                    </div>
                    <div className="flex justify-center p-2">
                      <p>الهوية الوطنية</p>
                    </div>
                    <div className="flex justify-center p-2">
                      <p>123-333</p>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* grades */}
              <div className="mt-12">
                <div className="flex flex-wrap">
                  {student.courses.map((course, i) => (
                    <div key={course.generic_course_id} className="w-1/2">
                      <div className="">
                        <div className="grid grid-cols-8 bg-[#CFE2F3] items-center  border-b-2 border-t-2 border-black">
                          <div className="p-2 text-md font-semibold border-r-2 border-l-2 border-black col-span-5">
                            {course.generic_course_name}
                          </div>
                          <div className="p-2 border-r-2  border-black ">
                            T1
                          </div>
                          <div className="p-2 border-r-2  border-black">T2</div>
                          <div className="p-2 border-r-2  border-black">T3</div>
                        </div>
                        {course.assessments.map((assessment) => (
                          <div
                            key={assessment.assessment_id}
                            className="grid grid-cols-8"
                          >
                            <div className="p-2 border-r-2 border-l-2 border-b-2 border-black col-span-5 last:border-b-0">
                              {assessment.assessment_name}
                            </div>

                            <div
                              className={`p-2 border-r-2 border-b-2   border-black overflow-hidden  ${
                                assessment.semester_record[0].semester_name ===
                                  "TERM 1" &&
                                assessment.semester_record[0].performace_key ===
                                  1
                                  ? "bg-[#93C47D]"
                                  : assessment.semester_record[0]
                                      .semester_name === "TERM 1" &&
                                    assessment.semester_record[0]
                                      .performace_key === 2
                                  ? "bg-[#F6B26B]"
                                  : assessment.semester_record[0]
                                      .semester_name === "TERM 1" &&
                                    assessment.semester_record[0]
                                      .performace_key === 3
                                  ? "bg-[#E06666]"
                                  : ""
                              }`}
                            ></div>
                            <div
                              className={`p-2 border-r-2 border-b-2  border-black overflow-hidden ${
                                assessment.semester_record[0].semester_name ===
                                  "TERM 2" &&
                                assessment.semester_record[0].performace_key ===
                                  1
                                  ? "bg-[#93C47D]"
                                  : assessment.semester_record[0]
                                      .semester_name === "TERM 2" &&
                                    assessment.semester_record[0]
                                      .performace_key === 2
                                  ? "bg-[#F6B26B]"
                                  : assessment.semester_record[0]
                                      .semester_name === "TERM 2" &&
                                    assessment.semester_record[0]
                                      .performace_key === 3
                                  ? "bg-[#E06666]"
                                  : ""
                              }`}
                            ></div>
                            <div
                              className={`p-2 border-r-2 border-b-2 border-black overflow-hidden ${
                                assessment.semester_record[0].semester_name ===
                                  "TERM 3" &&
                                assessment.semester_record[0].performace_key ===
                                  1
                                  ? "bg-[#93C47D]"
                                  : assessment.semester_record[0]
                                      .semester_name === "TERM 3" &&
                                    assessment.semester_record[0]
                                      .performace_key === 2
                                  ? "bg-[#F6B26B]"
                                  : assessment.semester_record[0]
                                      .semester_name === "TERM 3" &&
                                    assessment.semester_record[0]
                                      .performace_key === 3
                                  ? "bg-[#E06666]"
                                  : ""
                              }`}
                            ></div>
                          </div>
                        ))}
                        {Array.from(
                          {
                            length: maxAssessments - course.assessments.length,
                          },
                          (_, index) => (
                            <div
                              key={`dummy-${index}`}
                              className="grid grid-cols-8"
                            >
                              <div className="text-slate-50 p-2 border-r-2 border-l-2 border-b-2 border-black col-span-5 last:border-b-0">
                                -
                              </div>
                              <div className="p-2 border-r-2 border-b-2 border-black" />
                              <div className="p-2 border-r-2 border-b-2 border-black" />
                              <div className="p-2 border-r-2 border-b-2 border-black" />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* performance key  */}
              <div className="mt-12">
                <div className="gird grid-cols-1 grid-rows-2 w-full">
                  <div className="items-center text-center text-md bg-[#CFE2F3] p-2 font-semibold border-r-2 border-l-2 border-t-2 border-black">
                    Performance Key
                  </div>
                  <div className="grid grid-cols-9">
                    <div className="p-2 col-span-1 bg-[#93C47D] border-r-2 border-l-2 border-t-2 border-b-2 border-black"></div>
                    <div className="p-2 col-span-2 border-r-2 border-t-2 border-b-2 border-black">
                      Progressing
                    </div>
                    <div className="p-2 col-span-1 bg-[#F6B26B] border-r-2 border-t-2 border-b-2 border-black"></div>
                    <div className="p-2 col-span-2 border-r-2 border-t-2 border-b-2 border-black">
                      Slow Progressing
                    </div>
                    <div className="p-2 col-span-1 bg-[#E06666] border-r-2 border-t-2 border-b-2 border-black"></div>
                    <div className="p-2 col-span-2 border-r-2 border-t-2 border-b-2 border-black">
                      Not Progressing
                    </div>
                  </div>
                </div>
              </div>
              {/* term comments */}
              <div className="mt-12">
                <div className="grid grid-cols-1 grid-rows-4">
                  <div className="items-center text-center text-md bg-[#CFE2F3] p-2 font-semibold border-r-2 border-l-2 border-t-2 border-black">
                    Comments
                  </div>
                  <div className="grid grid-cols-9">
                    <div className="p-2 col-span-1 border-r-2 border-l-2 border-t-2 border-b-2 border-black">
                      TERM 1
                    </div>
                    <div className="p-2 col-span-8 border-r-2 border-t-2 border-b-2 border-black"></div>
                  </div>
                  <div className="grid grid-cols-9">
                    <div className="p-2 col-span-1 border-r-2 border-l-2 border-b-2 border-black">
                      TERM 2
                    </div>
                    <div className="p-2 col-span-8 border-r-2  border-b-2 border-black"></div>
                  </div>
                  <div className="grid grid-cols-9">
                    <div className="p-2 col-span-1 border-r-2 border-l-2 border-b-2 border-black">
                      TERM 3
                    </div>
                    <div className="p-2 col-span-8 border-r-2 border-b-2 border-black"></div>
                  </div>
                </div>
              </div>
              {/* final evaluation */}
              <div className="mt-12">
                <div className="grid grid-cols-1 grid-rows-4">
                  <div className="items-center text-center text-md bg-[#CFE2F3] p-2 font-semibold border-r-2 border-l-2 border-t-2 border-black">
                    Final Evaluation
                  </div>
                  <div className="grid grid-cols-9">
                    <div className="p-2 col-span-8 border-r-2 border-l-2 border-t-2 border-b-2 border-black text-sm font-semibold">
                      {student.report ? student.report.final_evalution : null}
                    </div>
                    <div className="p-2 col-span-1 border-r-2 border-t-2 border-b-2 border-black"></div>
                  </div>
                  <div className="grid grid-cols-9">
                    <div className="p-2 col-span-8 border-r-2 border-l-2 border-b-2 border-black text-sm font-semibold">
                      {student.report ? student.report.final_coments : null}
                    </div>
                    <div className="p-2 col-span-1 border-r-2  border-b-2 border-black"></div>
                  </div>
                </div>
              </div>
              {/* for official use */}
              <div className="mt-12">
                <div className="grid grid-cols-3 grid-rows-3">
                  <div className="items-center text-center text-md bg-[#CFE2F3] p-2 font-semibold border-r-2 border-l-2 border-t-2 border-black">
                    Head Of School
                  </div>
                  <div className="items-center text-center text-md bg-[#CFE2F3] p-2 font-semibold border-r-2  border-t-2 border-black">
                    KG PRINCIPAL
                  </div>
                  <div className="items-center text-center text-md bg-[#CFE2F3] p-2 font-semibold border-r-2  border-t-2 border-black">
                    HOME ROOM TEACHER
                  </div>
                  <div className="border-r-2 border-l-2 border-t-2 border-b-2 border-black"></div>
                  <div className="border-r-2 border-t-2 border-b-2 border-black"></div>
                  <div className="border-r-2 border-t-2 border-b-2 border-black"></div>
                  <div className="border-r-2 border-l-2 border-b-2 border-black"></div>
                  <div className="border-r-2 border-b-2 border-black"></div>
                  <div className="border-r-2 border-b-2 border-black"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KgReportPage;
