"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, File, Plus, Send, Video } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createPosts } from "@/serverAcademics/feed/actions";
import { toast } from "sonner";
import { Icons } from "@/components/ui/icons";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";

const MAX_FILE_SIZE = 1024 * 1024 * 1;
const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png"];

const postFormSchema = z.object({
  text: z.string({ required_error: "Please write something to post" }).min(4),
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
    .any()
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max image size is 1MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .optional(),
});

type TPostFormSchema = z.infer<typeof postFormSchema>;

const CreatePostCard = () => {
  const [isDocumentPressed, setIsDocumentPressed] = useState(false);
  const [isVideoPressed, setIsVideoPressed] = useState(false);
  const [isImagePressed, setIsPressed] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  const onSubmit = async (values: TPostFormSchema) => {
    console.log(values);
    const res = await createPosts(values);
    if (res === undefined) {
      toast.error("Error creating a new post");
    } else {
      toast.success("New post has been created successfully");
    }
    // reset();
  };

  const handleVideoButtonClick = () => {
    setIsVideoPressed(true);
    appendVideo({ value: "" });
  };

  const handleDocumentButtonClick = () => {
    setIsDocumentPressed(true);
    appendDocument({ value: "" });
  };

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
              </div>
              <div className="flex">
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
