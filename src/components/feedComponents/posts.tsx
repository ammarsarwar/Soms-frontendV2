import { Suspense } from "react";
import CreatePostCard from "./create-post-card";
import PostCard from "./post-card";
import { getPosts } from "@/server/feed/actions";
import { TPostSchema } from "./feed.types";
import { Button } from "../ui/button";

const Posts = async () => {
  const posts = await getPosts();
  // console.log(posts);
  return (
    <div className="flex flex-col p-2 gap-3 w-full">
      <div className="">
        <CreatePostCard />
      </div>
      <div>
        <Suspense fallback={<p>Posts loading ...</p>}>
          <PostCard posts={posts} />
        </Suspense>
      </div>
    </div>
  );
};

export default Posts;
