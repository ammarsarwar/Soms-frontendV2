"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";

const GradeReportPage = ({}) => {
  const semesterReportRef = useRef(null);

  const generateReportPdf = async () => {
    const inputData = semesterReportRef.current;
    const report = document.getElementById("grade-semester-report");
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
        pdf.save(`semester-report.pdf`);
      } catch (error) {
        console.log(error);
      }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col p-4 border border-slate-300 rounded-md w-full">
        <div className="flex justify-between gap-2 items-center p-2 mb-2">
          <div className="flex gap-2">
            <Avatar>
              <AvatarImage src="" alt="@shadcn" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-semibold">Ali Irtaza</p>
              <span className="text-sm text-muted-foreground">
                aliirtaza401@gmail.com
              </span>
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
            <span className="text-sm text-muted-foreground">2023-2024</span>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold">Current semester</p>
            <span className="text-sm text-muted-foreground">Term 2</span>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold">Branch</p>
            <span className="text-sm text-muted-foreground">Test branch</span>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold">Campus</p>
            <span className="text-sm text-muted-foreground">Test campus</span>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold">Department</p>
            <span className="text-sm text-muted-foreground">
              Test department
            </span>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold">Grade</p>
            <span className="text-sm text-muted-foreground">Test grade</span>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold">Section</p>
            <span className="text-sm text-muted-foreground">Test section</span>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2 mt-2 p-2">
          <p className="text-sm font-semibold">Filter report card</p>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="year">Annual Report Card</SelectItem>
                    <SelectItem value="term">Term Report Card</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Years</SelectLabel>
                    <SelectItem value="apple">Term 1</SelectItem>
                    <SelectItem value="banana">Term 2</SelectItem>
                    <SelectItem value="blueberry">Term 3</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Academic Term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Terms</SelectLabel>
                    <SelectItem value="apple">Term 1</SelectItem>
                    <SelectItem value="banana">Term 2</SelectItem>
                    <SelectItem value="blueberry">Term 3</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button variant={"outline"}>Generate student details</Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-4 border border-slate-300 rounded-md w-full h-full">
        <div className="flex w-full justify-end">
          <Button onClick={generateReportPdf}>Generate Pdf</Button>
        </div>
        <div className="mt-4 p-4">
          <div id="grade-semester-report">
            <div className="m-12">
              <div className="grid grid-cols-5 items-center w-full">
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">
                    Kingdom of Saudi Arabia
                  </p>
                  <p className="text-smd font-semibold">
                    Ministry of Education
                  </p>
                  <p className="text-sm font-semibold">
                    General Directorate of Education
                  </p>
                  <p className="text-sm font-semibold">Eastern Province</p>
                  <p className="text-sm font-semibold">
                    AlForsan International Schools
                  </p>
                  <p className="text-sm font-semibold">American Curriculum</p>
                  <p className="text-sm font-semibold">License No. 520-3278</p>
                </div>
                <Image src="/fursan.jpg" alt="" width={100} height={100} />
                <Image src="/cognia.png" alt="" width={100} height={100} />
                <Image src="/ministry.png" alt="" width={100} height={100} />
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-end">
                    المملكة العربیة السعودیة
                  </p>
                  <p className="text-sm font-semibold text-end">
                    وزارة التعلیم
                  </p>
                  <p className="text-sm font-semibold text-end">
                    الادارة العامة للتعلیم بالمنطقة الشرقیة
                  </p>
                  <p className="text-sm font-semibold text-end">
                    مكتب التعلیم الاجنبي والعالمي بالمنطقة الشرقیة
                  </p>
                  <p className="text-sm font-semibold text-end">
                    مدارس الفرسان العالمیة الثانیة
                  </p>
                  <p className="text-sm font-semibold text-end">
                    المنهج : الأمریكي
                  </p>
                  <p className="text-sm font-semibold text-end">
                    ترخیص رقم : 520-3278
                  </p>
                </div>
              </div>
              <div className="mt-8 flex flex-col gap-2 w-full">
                <p className="text-sm font-semibold text-center">
                  مدارس الفرسان العالمیة
                </p>
                <p className="text-sm font-semibold text-center">
                  Al Forsan International Schools
                </p>
              </div>
              <div className="mt-12 flex items-center w-full">
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-sm font-semibold">
                    First Semester Report For Year 2023-2024
                  </p>
                  <p className="text-sm font-semibold">Grade: Grade 3</p>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-sm font-semibold text-end">
                    كشف درجات الفصل الدراسي الأول للعام الدراسي 1444 / 1445 هـ{" "}
                  </p>
                  <p className="text-sm font-semibold text-end">
                    الصف : الثالث الابتدائي
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 grid-rows-5 mt-4">
                <div className="text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black">
                  Student Information
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-t-2 border-black">
                  AlBahri Said Shahad
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-t-2 border-black">
                  شهد سعيد البحري
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-t-2 border-black">
                  اسم الطالبة
                </div>
                <div className=" text-center text-sm  font-semibold  border-l-2  border-t-2 border-black">
                  Nationality
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black grid grid-cols-2">
                  <div className=" text-center text-sm  font-semibold  border-black">
                    Saudi
                  </div>
                  <div className=" text-center text-sm  font-semibold  border-l-2  border-black">
                    الجنسية
                  </div>
                </div>
                <div className=" text-center text-sm  font-semibold   border-t-2 border-black">
                  Admission Date
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black grid grid-cols-2">
                  <div className=" text-center text-sm  font-semibold  border-black"></div>
                  <div className=" text-center text-sm  font-semibold  border-l-2  border-black">
                    تاريخ الالتحاقة
                  </div>
                </div>
                <div className=" text-center text-sm  font-semibold  border-l-2  border-t-2 border-black">
                  Date & Place Of Birth
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black grid grid-cols-2">
                  <div className="text-center text-sm  font-semibold  border-black">
                    04-08-2015
                  </div>
                  <div className=" text-center text-sm  font-semibold  border-l-2  border-black">
                    تاريخ و مكان الميلاد
                  </div>
                </div>
                <div className=" text-center text-sm  font-semibold   border-t-2 border-black">
                  Studying Weeks
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black grid grid-cols-2">
                  <div className=" text-center text-sm  font-semibold  border-black"></div>
                  <div className=" text-center text-sm  font-semibold  border-l-2  border-black">
                    عدد أسابيع الدراسة
                  </div>
                </div>
                <div className=" text-center text-sm  font-semibold  border-l-2 border-t-2 border-black">
                  ID No / Iqama
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black grid grid-cols-2">
                  <div className=" text-center text-sm  font-semibold  border-black">
                    1427107822
                  </div>
                  <div className=" text-center text-sm  font-semibold  border-l-2  border-black">
                    الإقامة / المدنى السجل
                  </div>
                </div>
                <div className=" text-center text-sm  font-semibold   border-t-2 border-black">
                  Previous Grade
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black grid grid-cols-2">
                  <div className=" text-center text-sm  font-semibold  border-black"></div>
                  <div className=" text-center text-sm  font-semibold  border-l-2  border-black">
                    السابق الصف
                  </div>
                </div>
                <div className=" text-center text-sm  font-semibold  border-l-2 border-b-2 border-t-2 border-black">
                  Passport No
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-b-2 border-t-2 border-black grid grid-cols-2">
                  <div className=" text-center text-sm  font-semibold  border-black"></div>
                  <div className=" text-center text-sm  font-semibold  border-l-2  border-black">
                    رقم جواز السفر
                  </div>
                </div>
                <div className=" text-center text-sm  font-semibold border-b-2  border-t-2 border-black">
                  School Previous
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-b-2 border-l-2 border-t-2 border-black grid grid-cols-2">
                  <div className="items-center text-center text-sm  font-semibold  border-black"></div>
                  <div className="items-center text-center text-sm  font-semibold  border-l-2  border-black">
                    المدرسة السابقة
                  </div>
                </div>
              </div>
              <div className="w-full text-center mt-4">
                <p className="text-sm font-semibold text-center">
                  Student Grades - درجات الطالبة
                </p>
              </div>
              {/* grades */}
              <div className="grid grid-cols-7 grid-rows-11 mt-4">
                <div className="bg-slate-50 text-center text-sm font-semibold border-r-2 border-l-2 border-t-2 border-black">
                  Course
                </div>
                <div className="bg-slate-100 text-center text-sm  font-semibold border-r-2 border-t-2 border-black">
                  الدراسیة المواد
                </div>
                <div className="bg-slate-100 text-center text-sm  font-semibold border-r-2 border-t-2 border-black">
                  Homework
                </div>
                <div className="bg-slate-100 text-center text-sm  font-semibold border-r-2 border-t-2 border-black">
                  Class Work
                </div>
                <div className="bg-slate-100 text-center text-sm  font-semibold border-r-2 border-t-2 border-black">
                  Quiz
                </div>
                <div className="bg-slate-100 text-center text-sm  font-semibold border-r-2 border-t-2 border-black">
                  Exam
                </div>
                <div className="bg-slate-100 text-center text-sm  font-semibold border-r-2 border-t-2 border-black">
                  Total
                </div>
                {/* here */}
                <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black">
                  English
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-t-2 border-black">
                  اللغة الإنجلیزیة
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm  border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  40 / 34
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  94 / 100
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black">
                  Maths
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-t-2 border-black">
                  الریاضیات
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm  border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  40 / 34
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  94 / 100
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black">
                  Science
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-t-2 border-black">
                  العلوم
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm  border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  40 / 34
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  94 / 100
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black">
                  Arabic
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-t-2 border-black">
                  اللغة العربیة
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm  border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  40 / 34
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  94 / 100
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black">
                  Studies Islamic
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-t-2 border-black">
                  الدراسات الإسلامیة
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm  border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  40 / 34
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  94 / 100
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black">
                  Studies Social
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-t-2 border-black">
                  الدراسات الاجتماعیة
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm  border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  40 / 34
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  94 / 100
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black">
                  Art
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-t-2 border-black">
                  التربیة الفنیة
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm  border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  40 / 34
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  94 / 100
                </div>
                <div className="leading-2 text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black">
                  Computer
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-t-2 border-black">
                  الحاسب الآلي
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm  border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  40 / 34
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  94 / 100
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black">
                  Education Physical
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-t-2 border-black">
                  التربیة البدنیة
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm  border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  40 / 34
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-black">
                  94 / 100
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-b-2 border-l-2 border-t-2 border-black">
                  French/Quran
                </div>
                <div className=" text-center text-sm  font-semibold border-r-2 border-t-2 border-b-2 border-black">
                  القرآن الكریم/اللغة الفرنسیة
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm  border-r-2 border-t-2 border-b-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-b-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-b-2 border-black">
                  20 / 20
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-b-2 border-black">
                  40 / 34
                </div>
                <div className="bg-[#DFF0D8] text-center text-sm border-r-2 border-t-2 border-b-2 border-black">
                  94 / 100
                </div>
              </div>
              {/* grades */}

              <div className="w-full text-center text-sm items-center mt-8">
                <span className="bg-[#F2DEDE]">◼ 0% - 50%</span>
                <span className="bg-[#FCF8E3]">◼ 50% - 75%</span>
                <span className="bg-[#DFF0D8]">◼ 75% - 100%</span>
              </div>

              <div className="w-full mt-8 flex justify-between">
                <div className="grid grid-cols-3 grid-rows-2 h-12">
                  <div className="text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black">
                    Final Mark %
                  </div>
                  <div className="text-center text-sm  font-semibold border-r-2 border-t-2 border-black">
                    97.7
                  </div>
                  <div className="text-center text-sm  font-semibold border-r-2 border-t-2 border-black">
                    الدرجة النهائیة
                  </div>
                  <div className="text-center text-sm  font-semibold border-r-2 border-l-2 border-b-2 border-t-2 border-black">
                    General Grade
                  </div>
                  <div className="text-center text-sm  font-semibold border-r-2 border-b-2 border-t-2 border-black">
                    A+
                  </div>
                  <div className="text-center text-sm  font-semibold border-r-2 border-b-2 border-t-2 border-black">
                    العام التقدیر
                  </div>
                </div>
                <div className="grid grid-cols-2 grid-rows-11 w-[300px]">
                  <div className="col-span-2 text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black">
                    Grading Key
                  </div>
                  <div className=" text-center text-sm  font-semibold border-l-2 border-t-2 border-black">
                    Rank
                  </div>
                  <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black">
                    Mark
                  </div>
                  <div className="leading-5 text-center text-sm  font-semibold border-l-2 border-t-2 border-black">
                    A+
                  </div>
                  <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black">
                    100-95
                  </div>
                  <div className=" text-center text-sm  font-semibold border-l-2 border-t-2 border-black">
                    A
                  </div>
                  <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black">
                    94-90
                  </div>
                  <div className=" text-center text-sm  font-semibold border-l-2 border-t-2 border-black">
                    B+
                  </div>
                  <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black">
                    89-85
                  </div>
                  <div className=" text-center text-sm  font-semibold border-l-2 border-t-2 border-black">
                    B
                  </div>
                  <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black">
                    84-80
                  </div>
                  <div className=" text-center text-sm  font-semibold border-l-2 border-t-2 border-black">
                    C+
                  </div>
                  <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black">
                    79-75
                  </div>
                  <div className=" text-center text-sm  font-semibold border-l-2 border-t-2 border-black">
                    C
                  </div>
                  <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black">
                    74-70
                  </div>
                  <div className=" text-center text-sm  font-semibold border-l-2 border-t-2 border-black">
                    D+
                  </div>
                  <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black">
                    69-65
                  </div>
                  <div className=" text-center text-sm  font-semibold border-l-2 border-t-2 border-black">
                    D
                  </div>
                  <div className=" text-center text-sm  font-semibold border-r-2 border-l-2 border-t-2 border-black">
                    64-60
                  </div>
                  <div className=" text-center text-sm  font-semibold border-l-2 border-b-2 border-t-2 border-black">
                    F
                  </div>
                  <div className=" text-center text-sm  font-semibold border-r-2 border-b-2 border-l-2 border-t-2 border-black">
                    Below 60
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center w-full mt-12">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold">MOE Principal</p>
                  <span className="text-sm font-semibold">
                    المديرة الوزارية
                  </span>
                  <span className="text-sm font-semibold">
                    الاسم: فاتن الصرعاوي
                  </span>
                  <span></span>
                  <div className="flex gap-1">
                    <span className="text-sm font-semibold">
                      ..........................
                    </span>
                    <p className="text-sm font-semibold">التوقيع</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold">School Stamp</p>
                  <span className="text-sm font-semibold">المدرسة ختم</span>
                  <span className="text-sm font-semibold"></span>
                  <span></span>
                  <div className="flex gap-1">
                    <span className="text-sm font-semibold">
                      ..........................
                    </span>
                    <p className="text-sm font-semibold">التاريخ</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold">Academic Advisor</p>
                  <span className="text-sm font-semibold">
                    المشرفة الأكاديمية
                  </span>
                  <span className="text-sm font-semibold">
                    الاسم: دنيا محي الدين
                  </span>
                  <span></span>
                  <div className="flex gap-1">
                    <span className="text-sm font-semibold">
                      ..........................
                    </span>
                    <p className="text-sm font-semibold">التوقيع</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeReportPage;
