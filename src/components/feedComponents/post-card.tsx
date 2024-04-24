"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera, File, Heart, SmilePlus, ThumbsUp, Video } from "lucide-react";
import { Label } from "../ui/label";
import { TPostSchema } from "./feed.types";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { createReacts } from "@/server/feed/actions";
import { toast } from "sonner";
import Link from "next/link";

function formatDateTimeDifference(dateTimeString: string): string {
  const providedDate: Date = new Date(dateTimeString);
  const currentDate: Date = new Date();

  const timeDifference: number = currentDate.getTime() - providedDate.getTime();
  const secondsDifference: number = Math.floor(timeDifference / 1000);
  const minutesDifference: number = Math.floor(secondsDifference / 60);
  const hoursDifference: number = Math.floor(minutesDifference / 60);
  const daysDifference: number = Math.floor(hoursDifference / 24);

  if (secondsDifference < 60) {
    return `${secondsDifference} seconds ago`;
  } else if (minutesDifference < 60) {
    return `${minutesDifference} mins ago`;
  } else if (hoursDifference < 24) {
    return `${hoursDifference} hours ago`;
  } else if (daysDifference === 1) {
    return `${daysDifference} day ago`;
  } else {
    return `${daysDifference} days ago`;
  }
}

const getColorForReactionType = (reactionType: string) => {
  switch (reactionType) {
    case "Hearts":
      return "red-500";
    case "Smiley face":
      return "blue-500";
    case "Thumbs up":
      return "primary";
    // Add more cases as needed
    default:
      return "gray-500"; // Default color if reaction type is not recognized
  }
};

const getIconForReactionType = (reactionType: string) => {
  switch (reactionType) {
    case "Hearts":
      return <Heart />;
    case "Smiley face":
      return <SmilePlus />;
    case "Thumbs up":
      return <ThumbsUp />;
    default:
      return null;
  }
};

const countReactionsOfType = (type: string, post: TPostSchema) => {
  return post.reactions.filter((reaction) => reaction.reaction_type === type)
    .length;
};

const PostCard = ({ posts }: { posts: TPostSchema[] }) => {
  // react query handling initial data

  const allReactionTypes = ["Hearts", "Smiley face", "Thumbs up"];

  const handleReactionClick = async (reactionType: string, postId: number) => {
    const res = await createReacts(reactionType, postId);
    if (res === undefined) {
      toast.error("Error reacting to this post");
    } else {
      toast.success("You have successfully reacted to this post");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => {
        const availableReactionTypes = new Set(
          post.reactions.map((reaction) => reaction.reaction_type)
        );

        return (
          <Card className="shadow-sm" key={post.id}>
            <div className="flex h-full w-full p-3 flex-col">
              <div className="flex gap-2">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {post.posted_by?.first_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="flex gap-2">
                    <span className="text-sm font-medium leading-none text-primary">
                      {post.posted_by?.first_name}
                    </span>
                    <span className="text-md font-medium leading-none text-primary">
                      {post.posted_by?.last_name} .{" "}
                      <small>{formatDateTimeDifference(post.created)}</small>
                    </span>
                  </div>
                  <div>
                    <small className="text-sm text-muted-foreground">
                      {post.posted_by?.email}
                    </small>
                  </div>
                </div>
              </div>
              <Separator className="mt-3" />
              <div className="w-full p-8 flex flex-col gap-2 bg-sky-50 rounded-sm">
                <div className="">
                  <p className="text-sm text-muted-foreground">{post.text}</p>
                </div>
                <div className="w-full">
                  {post.videos.length > 0 &&
                    post.videos.map((video) => (
                      <div
                        key={video.id}
                        className="flex items-center gap-2 text-primary hover:text-slate-300 cursor-pointer"
                      >
                        <Video />
                        <Link href={`${video.video_link}`} target="_blank">
                          {video.video_link}
                        </Link>
                      </div>
                    ))}
                  {post.images.length > 0 &&
                    post.images.map((image) => (
                      <div
                        key={image.id}
                        className={cn(
                          "",
                          post.images.length > 2
                            ? "grid grid-cols-2 gap-2"
                            : "w-full"
                        )}
                      >
                        <Image
                          src={`${image.image}`}
                          alt="image"
                          width={400}
                          height={300}
                          className={cn(
                            "rounded-xl overflow-hidden transition-opacity ease-in-out delay-150 bg-slate-200 duration-[1s]"
                          )}
                        />
                      </div>
                    ))}
                  {post.documents.length > 0 &&
                    post.documents.map((document) => (
                      <div
                        key={document.id}
                        className="flex items-center gap-2 text-primary hover:text-slate-300 cursor-pointer"
                      >
                        <File />
                        <p>{document.document_link}</p>
                      </div>
                    ))}
                </div>
              </div>
              <Separator className="" />
              <div className="flex gap-3 p-3">
                {allReactionTypes.map((reactionType) => (
                  <Button
                    key={reactionType}
                    variant={"secondary"}
                    className={cn(
                      "flex gap-2 items-center",
                      availableReactionTypes.has(reactionType) &&
                        `text-${getColorForReactionType(reactionType)}`
                    )}
                    onClick={() => handleReactionClick(reactionType, post.id)}
                  >
                    {countReactionsOfType(reactionType, post) > 0 && (
                      <small>{countReactionsOfType(reactionType, post)}</small>
                    )}
                    {getIconForReactionType(reactionType)}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default PostCard;
