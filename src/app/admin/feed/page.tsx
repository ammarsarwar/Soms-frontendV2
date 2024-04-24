// "use client";
// import React, { useState, useEffect } from "react";

// import { Button } from "@/components/ui/button";
// import { Suspense } from "react";
// import Link from "next/link";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import BranchTableSkeleton from "@/components/skeletons/branch-table-skeleton";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";

// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import {
//   Dialog,
//   DialogContent,
//   DialogClose,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// //react icons import
// import {
//   Image,
//   FileVideo2,
//   PersonStanding,
//   ArrowUpRight,
//   Heart,
//   HeartCrack,
//   Laugh,
//   Frown,
//   Globe,
//   LibraryBig,
//   GraduationCap,
//   BookOpenCheck,
//   MoveLeft,
// } from "lucide-react";

// function FeedView() {
//   const [fileName, setFileName] = useState<string>("");

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setFileName(file.name);
//     }
//   };

//   const handleClick = () => {
//     document.getElementById("fileInput")?.click();
//   };

//   const posts = [
//     {
//       name: "Ali Irtaza",
//       email: "ali.irtaza@SOMS.com",
//       time: "5:00PM",
//       text: "Announcement, all students from section 1 grade 5 are marked fail. Please collect your transcript from the office",
//       avatar: "https://github.com/shadcn.png",
//       attachment: "Click on the picture to view",
//     },
//     {
//       name: "Hina Saleem,",
//       email: "hina@SOMS.com",
//       time: "4:00PM",
//       text: "PTM tomorrow, everyone from elementary department, please come with your parents tomorrow",
//       avatar: "https://github.com/shadcn.png",
//       attachment: "",
//     },
//     {
//       name: "Moeen Taj,",
//       email: "Moeen@SOMS.com",
//       time: "2:00PM",
//       text: "Never say never",
//       avatar: "https://github.com/shadcn.png",
//       attachment: "Click on the picture to view",
//     },
//     {
//       name: "Moeen Taj,",
//       email: "Moeen@SOMS.com",
//       time: "2:00PM",
//       text: "Never say never",
//       avatar: "https://github.com/shadcn.png",
//       attachment: "Click on the picture to view",
//     },
//     {
//       name: "Moeen Taj,",
//       email: "Moeen@SOMS.com",
//       time: "2:00PM",
//       text: "Never say never",
//       avatar: "https://github.com/shadcn.png",
//       attachment: "Click on the picture to view",
//     },
//     {
//       name: "Moeen Taj,",
//       email: "Moeen@SOMS.com",
//       time: "2:00PM",
//       text: "Never say never",
//       avatar: "https://github.com/shadcn.png",
//       attachment: "Click on the picture to view",
//     },
//   ];
//   const [showSelect, setShowSelect] = useState(false);

//   const handleRadioChange = (value: string) => {
//     if (value === "department") {
//       setShowSelect(true);
//     }
//     if (value === "grade") {
//       setShowSelect(true);
//     }
//     if (value === "section") {
//       setShowSelect(true);
//     }
//   };
//   return (
//     <>
//       <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
//         <div className="">
//           <div className="border border-[#2dd4bf] shadow-lg  rounded-lg h-screen overflow-scroll no-scrollbar ">
//             <div className="flex items-center justify-center p-5 ">
//               <div className="border border-[#2dd4bf] rounded-lg p-5 w-[70%] h-full shadow-md">
//                 <div className="text-xl font-bold">Home</div>
//                 <div className="flex flex-col gap-7 mt-4">
//                   <div className="flex flex-row gap-3">
//                     <div>
//                       <Avatar>
//                         <AvatarImage
//                           src="https://github.com/shadcn.png"
//                           alt="@shadcn"
//                         />
//                         <AvatarFallback>CN</AvatarFallback>
//                       </Avatar>
//                     </div>
//                     <div>
//                       <Textarea
//                         placeholder="Type your message here."
//                         className="w-[550px] border-none"
//                       />
//                     </div>
//                   </div>
//                   <div className="flex flex-row justify-between">
//                     <div className="flex flex-row gap-3">
//                       <span className="cursor-pointer" onClick={handleClick}>
//                         <Image />
//                         {fileName && <span className="ml-2">{fileName}</span>}
//                         <Input
//                           type="file"
//                           id="fileInput"
//                           style={{ display: "none" }}
//                           onChange={handleFileChange}
//                           accept="image/*"
//                         />
//                       </span>
//                       <span className="cursor-pointer">
//                         <FileVideo2 />
//                       </span>
//                     </div>
//                     <div>
//                       <Dialog>
//                         <DialogTrigger asChild>
//                           <Button type="button" className="rounded-full">
//                             Post
//                           </Button>
//                         </DialogTrigger>
//                         <DialogContent className="sm:max-w-[525px]">
//                           <DialogHeader>
//                             <DialogTitle>Post audience</DialogTitle>
//                           </DialogHeader>
//                           <Separator className="my-4" />
//                           <Label className="text-xl">
//                             Who can see your post?
//                           </Label>
//                           <p className="text-muted-foreground">
//                             Your post will appear in feed for those selected
//                             below
//                           </p>
//                           {!showSelect ? (
//                             <RadioGroup
//                               defaultValue="public"
//                               onValueChange={handleRadioChange}
//                             >
//                               <div className="flex flex-col gap-7">
//                                 <div className="flex flex-row justify-between cursor-pointer p-3 hover:bg-slate-100 ">
//                                   <div className="flex flex-row gap-1 ">
//                                     <Globe className="h-8 w-8" />
//                                     <Label
//                                       htmlFor="public"
//                                       className="text-md font-medium leading-none cursor-pointer peer-disabled:opacity-70 mt-2"
//                                     >
//                                       Public
//                                     </Label>
//                                   </div>
//                                   <div>
//                                     <RadioGroupItem
//                                       value="public"
//                                       id="public"
//                                     />
//                                   </div>
//                                 </div>
//                                 <div className="flex flex-row justify-between cursor-pointer p-3 hover:bg-slate-100 ">
//                                   <div className="flex flex-row gap-1 ">
//                                     <LibraryBig className="h-8 w-8" />
//                                     <Label
//                                       htmlFor="department"
//                                       className="text-md font-medium leading-none cursor-pointer peer-disabled:opacity-70 mt-2"
//                                     >
//                                       Department
//                                     </Label>
//                                   </div>
//                                   <div>
//                                     <RadioGroupItem
//                                       value="department"
//                                       id="department"
//                                     />
//                                   </div>
//                                 </div>
//                                 <div className="flex flex-row justify-between cursor-pointer p-3 hover:bg-slate-100 ">
//                                   <div className="flex flex-row gap-1 ">
//                                     <GraduationCap className="h-8 w-8" />
//                                     <Label
//                                       htmlFor="grade"
//                                       className="text-md font-medium leading-none cursor-pointer peer-disabled:opacity-70 mt-2"
//                                     >
//                                       Grade
//                                     </Label>
//                                   </div>
//                                   <div>
//                                     <RadioGroupItem value="grade" id="grade" />
//                                   </div>
//                                 </div>
//                                 <div className="flex flex-row justify-between cursor-pointer p-3 hover:bg-slate-100 ">
//                                   <div className="flex flex-row gap-1 ">
//                                     <BookOpenCheck className="h-8 w-8" />
//                                     <Label
//                                       htmlFor="section"
//                                       className="text-md font-medium leading-none cursor-pointer peer-disabled:opacity-70 mt-2"
//                                     >
//                                       Section
//                                     </Label>
//                                   </div>
//                                   <div>
//                                     <RadioGroupItem
//                                       value="section"
//                                       id="section"
//                                     />
//                                   </div>
//                                 </div>
//                               </div>
//                             </RadioGroup>
//                           ) : (
//                             <>
//                               <div className="flex flex-col gap-5">
//                                 <div>
//                                   <Select>
//                                     <SelectTrigger className="w-[180px]">
//                                       <SelectValue placeholder="Select a department" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                       <SelectGroup>
//                                         <SelectLabel>Departments</SelectLabel>
//                                         <SelectItem value="Elementary">
//                                           Elementary
//                                         </SelectItem>
//                                         <SelectItem value="Primary">
//                                           Primary
//                                         </SelectItem>
//                                         <SelectItem value="Kg">Kg</SelectItem>
//                                       </SelectGroup>
//                                     </SelectContent>
//                                   </Select>
//                                 </div>
//                                 <div>
//                                   <Button
//                                     variant={"secondary"}
//                                     type="button"
//                                     onClick={() => setShowSelect(false)}
//                                   >
//                                     Back
//                                   </Button>
//                                 </div>
//                               </div>
//                             </>
//                           )}
//                           <DialogFooter>
//                             <DialogClose asChild>
//                               <Button
//                                 type="button"
//                                 onClick={() => setShowSelect(false)}
//                               >
//                                 Save changes
//                               </Button>
//                             </DialogClose>
//                           </DialogFooter>
//                         </DialogContent>
//                       </Dialog>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="px-14">
//               <div className=" flex flex-row gap-1 justify-between">
//                 <span className="flex flex-row cursor-pointer">
//                   <p>Audience</p>
//                   <PersonStanding />
//                   <ArrowUpRight size={12} />
//                 </span>
//                 <div className="cursor-pointer">Filter by new</div>
//               </div>
//               <div className="mt-5">
//                 {posts.map((post, index) => (
//                   <div
//                     key={index}
//                     className="border shadow-md rounded-md h-[270px] p-5 mb-5 bg-slate-50"
//                   >
//                     <div className="flex h-full">
//                       <div className="flex flex-col justify-between pt-6">
//                         <div className="flex justify-end">
//                           <div className="w-24 h-24">
//                             <img
//                               src={post.avatar}
//                               alt={`Avatar for ${post.name}`}
//                               className="rounded-full"
//                             />
//                           </div>
//                         </div>
//                         <div className="flex-grow"></div> {/* Spacer Div */}
//                       </div>

//                       <div className="flex-grow flex flex-col">
//                         <div className="flex items-center p-2">
//                           <div className="flex flex-row gap-2">
//                             <p className="font-bold">{post.name}</p>
//                             <p className="text-muted-foreground text-sm">
//                               {post.email}
//                             </p>
//                             <p className="text-muted-foreground text-sm">
//                               {post.time}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="flex-grow overflow-scroll no-scrollbar p-2 break-all max-w-full">
//                           {post.text}
//                           <br></br>
//                           <span className="underline cursor-pointer">
//                             {post.attachment}
//                           </span>
//                         </div>
//                         <div className="flex flex-row gap-2">
//                           {/* Replace these with your actual icon components */}
//                           <span className="cursor-pointer">❤️</span>
//                           <span className="cursor-pointer">💔</span>
//                           <span className="cursor-pointer">😂</span>
//                           <span className="cursor-pointer">😞</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default FeedView;

import Posts from "@/components/feedComponents/posts";
import PostsRightSidebar from "@/components/feedComponents/sidebar/posts-right-sidebar";
import { FC, Suspense } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface pageProps {}

const FeedPage: FC<pageProps> = ({}) => {
  return (
    <div className=" w-full h-full flex">
      <div className="flex flex-initial w-[70%] ">
        <ScrollArea className="h-screen w-full p-3 rounded-md mb-[500px]">
          <Posts />
        </ScrollArea>
      </div>
      <div className="flex flex-1 flex-col">
        <PostsRightSidebar />
      </div>
    </div>
  );
};

export default FeedPage;
