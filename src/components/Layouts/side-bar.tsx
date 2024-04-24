"use client";

import React, { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ADMIN_SIDENAV_ITEMS,
  TEACHER_SIDENAV_ITEMS,
  PARENT_SIDENAV_ITEMS,
  ACADEMICS_SIDENAV_ITEMS,
  NURSE_SIDENAV_ITEMS,
  ADMISSION_TEAM_SIDENAV_ITEMS,
} from "./constants";
import { SideNavItem } from "@/lib/types";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";

const SideNav = () => {
  //checking the requested path
  const pathname = usePathname();
  const pathArray = pathname.split("/");

  // checking to see which path user is trying to access and <match it with session> to see if user
  // has access to this path and if its true than return sidebar items based on requested pathname
  // the comment in <> is yet to be implemented
  const userPath = pathArray[1];

  const getSidebarItems = () => {
    switch (userPath) {
      case "admin":
        return ADMIN_SIDENAV_ITEMS;
      case "teacher":
        return TEACHER_SIDENAV_ITEMS;
      case "admissionsTeam":
        return ADMISSION_TEAM_SIDENAV_ITEMS;
      case "parent":
        return PARENT_SIDENAV_ITEMS;
      case "academics":
        return ACADEMICS_SIDENAV_ITEMS;
      case "nurse":
        return NURSE_SIDENAV_ITEMS;
      default:
        return [];
    }
  };

  const sidebarItems = getSidebarItems();

  return (
    <div className="bg-white h-screen flex-1 fixed border-r w-72 flex flex-col overflow-scroll no-scrollbar">
      <div className="flex justify-center mt-10">
        <Image src="/Logo.svg" height={150} width={150} alt="soms" />
      </div>
      <div className="flex flex-col mx-4 h-screen py-12">
        <div>
          {sidebarItems.map((item, idx) => {
            return <MenuItem key={idx} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div className="">
      {item.submenu ? (
        <>
          <div
            onClick={toggleSubMenu}
            className={`flex flex-row items-center text-[#64748b] p-3 mb-2 rounded-lg hover-bg-zinc-100 w-full justify-between hover:bg-zinc-100 ${
              pathname.includes(item.path) ? "bg-zinc-100" : ""
            }`}
          >
            <div className="flex flex-row space-x-4 items-center ">
              {item.icon}
              <span>{item.title}</span>
            </div>

            <div className={`${subMenuOpen ? "rotate-180" : ""} flex`}>
              <ChevronDown width="24" height="24" />
            </div>
          </div>

          {subMenuOpen && (
            <div className="my-2 ml-12 flex flex-col space-y-4 text-[#64748b]">
              {item.subMenuItems?.map((subItem, idx) => {
                return (
                  <Link
                    key={idx}
                    href={subItem.path}
                    className={`${
                      subItem.path === pathname ? "font-bold" : ""
                    }`}
                  >
                    <span>{subItem.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`flex flex-row space-x-4 items-center p-3 text-[#64748b] mb-2 rounded-lg hover:bg-zinc-100 ${
            item.path === pathname ? "bg-zinc-100" : ""
          }`}
        >
          {item.icon}
          <span>{item.title}</span>
        </Link>
      )}
    </div>
  );
};
