"use client";
// import { getServerSession } from "next-auth";
import PersonaSelect from "@/components/onBoardingComponents/prosona-select";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col p-8 w-full h-screen">
      <div className="flex justify-center items-center w-full">
        <Image src="/Logo.svg" height={150} width={150} alt="soms" />
      </div>
      <div className="flex flex-col justify-center items-center h-screen w-full  gap-8">
        <PersonaSelect />
      </div>
    </main>
  );
}
