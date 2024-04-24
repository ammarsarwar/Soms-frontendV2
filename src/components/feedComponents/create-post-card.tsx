"use client";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Camera, File, Send, Video } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { createPosts } from "@/server/feed/actions";
import { toast } from "sonner";
import { Icons } from "../ui/icons";
import { Textarea } from "../ui/textarea";
import { useRef, useState, useEffect } from "react";
import { Globe, School, Plus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Department, Section } from "@/schemas";
import SectionFilterFeed from "../filterComponent/section-filter";
const MAX_FILE_SIZE = 1024 * 1024 * 1;
const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png"];

type FormFieldNames = "videos" | "documents" | "images";

const postFormSchema = z.object({
  text: z.string({ required_error: "Please write something to post" }).min(1),
  videos: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),
  documents: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),
  images: z
    .array(
      z.object({
        name: z.string(),
      })
    )
    .optional(),
});

type TPostFormSchema = z.infer<typeof postFormSchema>;

const CreatePostCard = () => {
  const { data: session, status } = useSession();

  const [isDocumentPressed, setIsDocumentPressed] = useState(false);
  const [isVideoPressed, setIsVideoPressed] = useState(false);

  const [selectedAudience, setSelectedAudience] = useState("public");

  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleAudienceChange = (value: any) => {
    setSelectedAudience(value);
    if (value === "public") {
      // Directly resetting section and department if "public" is selected
      setSelectedSection(null);
      setSelectedDepartment(null);
    }
  };
  const confirmAudienceSelection = () => {
    setSelectedAudience(selectedAudience);
    if (selectedAudience !== "school") {
      setSelectedSection(null);
      setSelectedDepartment(null);
    }
  };

  useEffect(() => {
    setSelectedAudience(selectedAudience);
  }, [selectedAudience]);
  const form = useForm<TPostFormSchema>({
    resolver: zodResolver(postFormSchema),
    mode: "onChange",
  });

  const {
    reset,
    setValue,
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const { fields: videoFields, append: appendVideo } = useFieldArray({
    name: "videos",
    control: form.control,
  });

  const { fields: documentFields, append: appendDocument } = useFieldArray({
    name: "documents",
    control: form.control,
  });
  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    name: "images",
    control: form.control,
  });

  const onSubmit = async (values: TPostFormSchema) => {
    if (session && session.user && session.user.id) {
      const userId = session.user.id;
      const formData = new FormData();
      formData.append("text", values.text);
      formData.append("posted_by", String(userId)); // Append user ID from session

      // Handle optional fields
      if (selectedSection?.id) {
        formData.append(
          "targeted_section",
          selectedSection
            ? JSON.stringify([selectedSection.id])
            : JSON.stringify([])
        );
      }
      if (selectedDepartment?.id) {
        formData.append(
          "targeted_department",
          selectedDepartment
            ? JSON.stringify([selectedDepartment.id])
            : JSON.stringify([])
        );
      }

      values.documents?.forEach((document) => {
        formData.append("documents", document.value);
      });

      values.videos?.forEach((video) => {
        formData.append("videos", video.value);
      });

      // Append files
      if (selectedFiles[0]) {
        formData.append("images", selectedFiles[0], selectedFiles[0].name);
      }
      // Here we call createPosts with the form data and selected files

      const res = await createPosts(formData);

      if (res === undefined) {
        toast.error("Error creating a new post");
      } else {
        toast.success("New post has been created successfully");
        reset(); // Reset the form fields after successful submission
        setImagePreviews([]); // Clear the image previews
        setSelectedFiles([]); // Clear the selected files
        setIsVideoPressed(false);
        setIsDocumentPressed(false);
      }
    } else {
      console.error("User session is null");
    }
  };

  const handleVideoButtonClick = () => {
    setIsVideoPressed(true);
    appendVideo({ value: "" });
  };

  const handleDocumentButtonClick = () => {
    setIsDocumentPressed(true);
    appendDocument({ value: "" });
  };

  useEffect(() => {
    console.log(
      "these are values of selected section, selected department",
      selectedSection,
      selectedDepartment
    ); // Log selectedSection whenever it changes
  }, [selectedSection, selectedDepartment]);

  const handleIconClick = () => {
    fileInputRef.current?.click(); // Programmatically click the hidden file input
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // Only consider the first file
      const file = event.target.files[0];
      setSelectedFiles([file]); // Update state to an array with a single file

      // Update preview for a single image
      const newImagePreview = URL.createObjectURL(file);
      setImagePreviews([newImagePreview]);
    }
  };
  useEffect(() => {
    const namesOnly = imageFields.map((field) => field.name);
    console.log("Updated images array with names only:", namesOnly);
  }, [imageFields]);
  // Clean up image URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);
  return (
    <div className="w-full">
      <Card className="shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col p-5 gap-3">
            <div>
              <p className="scroll-m-20 text-xl font-semibold tracking-tight">
                Create a post
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/avatars/02.png" />
                <AvatarFallback>JL</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2 w-full">
                <Textarea
                  {...register("text")}
                  id="text"
                  placeholder="whats on you mind..."
                  disabled={isLoading || isSubmitting}
                  rows={3}
                />
                {errors.text && (
                  <small className="text-red-500 font-bold">
                    {errors.text?.message}
                  </small>
                )}
              </div>
            </div>
            <div className="mt-2 w-[500px] ml-12 flex flex-col gap-4">
              {isVideoPressed && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="videoUrlsField">Video Url</Label>
                  {videoFields.map((video, index) => (
                    <div key={video.id}>
                      <Input
                        {...register(`videos.${index}.value`)}
                        id={`videos[${index}].value`}
                        placeholder="https://youtube.me/3397dhhebfb"
                        disabled={isLoading || isSubmitting}
                      />
                      {errors.videos?.[index]?.value && (
                        <small className="text-red-500 font-bold">
                          {errors.videos[index]?.value?.message}
                        </small>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {isDocumentPressed && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="documentUrlsField">Document Url</Label>
                  {documentFields.map((document, index) => (
                    <div key={document.id}>
                      <Input
                        {...register(`documents.${index}.value`)}
                        id={`documents[${index}].value`}
                        placeholder="https://example.com/document.pdf"
                        disabled={isLoading || isSubmitting}
                      />
                      {errors.documents?.[index]?.value && (
                        <small className="text-red-500 font-bold">
                          {errors.documents[index]?.value?.message}
                        </small>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex w-full items-center justify-between mt-2">
              <div className="flex gap-2 w-full ml-12">
                <div
                  onClick={handleVideoButtonClick}
                  className={cn(
                    "flex gap-2 hover:text-primary cursor-pointer",
                    buttonVariants({ variant: "secondary" })
                  )}
                >
                  <Video width={20} height={20} />
                </div>
                <div
                  onClick={handleDocumentButtonClick}
                  className={cn(
                    "flex gap-2 hover:text-primary cursor-pointer",
                    buttonVariants({ variant: "secondary" })
                  )}
                >
                  <File width={20} height={20} />
                </div>
                <div
                  className={cn(
                    "flex gap-2 hover:text-primary cursor-pointer",
                    buttonVariants({ variant: "secondary" })
                  )}
                  onClick={handleIconClick}
                >
                  <Camera width={20} height={20} />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }} // Hide the input
                    ref={fileInputRef} // Reference to this input for triggering click
                    onChange={handleFileChange} // Handle file selection
                  />
                  {imagePreviews.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt="Uploaded image"
                      style={{ width: 50, height: 50 }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button type="button" variant="secondary">
                      Select audience
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                      <DialogTitle>Post audience</DialogTitle>
                      <DialogDescription>
                        Please select audience for this post
                      </DialogDescription>
                    </DialogHeader>
                    {/* Use temporaryAudience to manage changes within the dialog */}
                    <div className="flex flex-col gap-8">
                      <RadioGroup
                        value={selectedAudience} // Use temporaryAudience for the current value
                        onValueChange={handleAudienceChange}
                      >
                        <div className="flex flex-row justify-between hover:bg-slate-100 p-4">
                          <label
                            htmlFor="public"
                            className="flex flex-row gap-1 cursor-pointer"
                          >
                            <div className="flex items-center">
                              <Globe size={35} />
                            </div>
                            <div className="flex flex-col">
                              <p className="font-bold">Public</p>
                              <p className="text-sm text-muted-foreground">
                                Everyone within the school will see this post in
                                their feed
                              </p>
                            </div>
                          </label>
                          <RadioGroupItem value="public" id="public" />
                        </div>
                        <div className="flex flex-row justify-between hover:bg-slate-100 p-4">
                          <label
                            htmlFor="school"
                            className="flex flex-row gap-1 cursor-pointer"
                          >
                            <div className="flex items-center">
                              <School size={35} />
                            </div>
                            <div className="flex flex-col">
                              <p className="font-bold">Branch, campus...</p>
                              <p className="text-sm text-muted-foreground">
                                Selecting this will prompt you to select
                                department or section
                              </p>
                            </div>
                          </label>
                          <RadioGroupItem value="school" id="school" />
                        </div>
                      </RadioGroup>
                    </div>
                    {selectedAudience === "school" && (
                      <SectionFilterFeed
                        selectedSection={selectedSection}
                        setSelectedSection={setSelectedSection}
                        selectedDepartment={selectedDepartment}
                        setSelectedDepartment={setSelectedDepartment}
                      />
                    )}
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={confirmAudienceSelection}
                        >
                          Confirm
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button disabled={isLoading || isSubmitting} type="submit">
                  {isLoading ||
                    (isSubmitting && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ))}
                  Post
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreatePostCard;
