"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import Link from "next/link";
import SectionTable from "@/components/sectionSetup/section-table";
import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
import SectionCreation from "@/components/sectionSetup/sectionCreation";
import { Grade } from "@/schemas";


const Page = () => {
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {" "}
              Section Management
            </h2>
          </div>
          {/* <div className="flex items-center space-x-2">
            <Button variant={"default"}>
              <Link href="/admin/section-setup/new">Add new</Link>
            </Button>
          </div> */}
        </div>
        <div className="">
          <SectionCreation
            selectedGrade={selectedGrade}
            setSelectedGrade={setSelectedGrade}
          />
        </div>
        <Suspense fallback={<BranchTableSkeleton />}>
          <SectionTable selectedGrade={selectedGrade} />
        </Suspense>
      </div>
    </>
  );
};

export default Page;
