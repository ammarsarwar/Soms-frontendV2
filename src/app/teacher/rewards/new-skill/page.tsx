"use client";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { postSkills } from "@/serverTeacher/rewards/actions";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface IFormSchema {
  skillName: string;
  skillPoints: number | null;
  description?: string;
}
interface Icon {
  name: string;
  file: Blob;
}
const NewSkillPage = () => {
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const form = useForm<IFormSchema>({
    defaultValues: {
      skillName: "",
      skillPoints: null,
      description: "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { isSubmitting, isLoading },
  } = form;
  const handleIconSelect = async (iconName: any) => {
    try {
      const response = await fetch(`/skills-icons/${iconName}`);
      if (response.ok) {
        const blob = await response.blob();
        setSelectedIcon({ name: iconName, file: blob });
      } else {
        console.error("Failed to fetch icon:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching icon:", error);
    }
  };
  const onSubmit = async (values: IFormSchema) => {
    const formData = new FormData();
    formData.append("name", values.skillName);
    formData.append("points", String(values.skillPoints));

    // Append the selected icon as a file to the FormData
    if (selectedIcon && selectedIcon.file) {
      formData.append("icon", selectedIcon.file, selectedIcon.name);
    }

    try {
      const responseData = await postSkills(formData);
      console.log("Response from server:", responseData);
      alert("Skill created");
      reset();
    } catch (error) {
      alert("Error creating a new skill");
      console.error("Error submitting form:", error);
    }
  };

  const icons = [
    "add-to-svgrepo-com.svg",
    "answer-student-svgrepo-com.svg",
    "art-palette-svgrepo-com.svg",
    "back-bag-bag-education-learning-school-school-bag-svgrepo-com.svg",
    "bell-svgrepo-com.svg",
    "book-closed-svgrepo-com.svg",
    "book-sparkles-svgrepo-com.svg",
    "brainstorm-think-svgrepo-com.svg",
    "bulb-svgrepo-com.svg",
    "calculator-svgrepo-com.svg",
    "checklist2-svgrepo-com.svg",
    "couple-with-heart-woman-man-light-skin-tone-dark-skin-tone-svgrepo-com.svg",
    "crown-user-svgrepo-com.svg",
    "docusaurus-svgrepo-com.svg",
    "earth-moon-svgrepo-com.svg",
    "earth-svgrepo-com.svg",
    "event-gift-svgrepo-com.svg",
    "handshake-svgrepo-com.svg",
    "happy-2-svgrepo-com.svg",
    "heart-svgrepo-com.svg",
    "laptop-svgrepo-com.svg",
    "lightningmood-svgrepo-com.svg",
    "magnifier-svgrepo-com.svg",
    "megaphone-loudspeaker-svgrepo-com.svg",
    "mic-karaoke-svgrepo-com.svg",
    "peace-svgrepo-com.svg",
    "plant-garden-svgrepo-com.svg",
    "plant-svgrepo-com.svg",
    "plus-svgrepo-com.svg",
    "puzzle-svgrepo-com.svg",
    "question-and-answer-svgrepo-com.svg",
    "recycle-electricity-svgrepo-com.svg",
    "recycle-svgrepo-com.svg",
    "smile-1-svgrepo-com.svg",
    "the-medal-svgrepo-com.svg",
    "thumbs-up-svgrepo-com.svg",
    "volume-speaker-svgrepo-com.svg",
  ];

  return (
    <div className="flex flex-col space-y-8 p-8">
      <h2 className="text-2xl font-bold tracking-tight">Add a new skill</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Choose Icon</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[725px] h-[500px] overflow-scroll no-scrollbar ">
              <DialogHeader>
                <DialogTitle>Choose an Icon</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-4 gap-4 px-5 py-5 ">
                {icons.map((icon, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer p-2 border-2 rounded-md flex justify-center ${
                      selectedIcon?.name === icon
                        ? "border-blue-700"
                        : "border-transparent"
                    }`}
                    onClick={() => handleIconSelect(icon)}
                  >
                    <Image
                      src={`/skills-icons/${icon}`}
                      alt={icon}
                      width={80}
                      height={80}
                      className="hover:opacity-75" // Optional: Change opacity on hover
                    />
                  </div>
                ))}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => console.log("Icon selected:", selectedIcon)}
                  >
                    Confirm icon
                  </Button>
                </DialogClose>
                {/* <DialogClose asChild>
                  {" "}
                  <Button
                    variant={"default"}
                    onClick={() => console.log("Icon selected:", selectedIcon)}
                  >
                    Confirm Icon
                  </Button>
                </DialogClose> */}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Input
            {...register("skillName", {
              required: "Skill name is required",
            })}
            placeholder="Skill Name"
            type="text"
          />

          <Input
            {...register("skillPoints", {
              required: "Skill points are required",
              min: {
                value: 1,
                message: "Skill points must be at least 1",
              },
              max: {
                value: 5,
                message: "Skill points cannot be more than 5",
              },
              validate: {
                isInteger: (value: any) =>
                  (parseInt(value, 10) >= 1 && parseInt(value, 10) <= 5) ||
                  "Skill points must be an integer between 1 and 5",
              },
            })}
            placeholder="Skill Points 1-5"
            type="number"
            min="1"
            max="5"
            onInput={(e) => {
              const inputValue = (e.target as HTMLInputElement).value;
              if (parseInt(inputValue, 10) < 1) {
                (e.target as HTMLInputElement).value = "1";
              } else if (parseInt(inputValue, 10) > 5) {
                (e.target as HTMLInputElement).value = "5";
              }
            }}
          />

          <Textarea
            {...register("description")}
            placeholder="Description about why you're rewarding the skill points (optional)"
          />
          <div>
            <Button type="submit">
              {isLoading || isSubmitting ? "Creating" : "Create"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewSkillPage;
