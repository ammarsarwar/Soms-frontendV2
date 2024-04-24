import { Suspense } from "react";

import PostCard from "./post-card";
import { getPosts } from "@/serverParent/feed/actions";
import { TPostSchema } from "./feed.types";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BookCheck, ListTodo } from "lucide-react";
const Posts = async () => {
  const posts = await getPosts();

  return (
    <div className="flex flex-col p-2 gap-3 w-full">
      <div>
        {!posts || posts.length === 0 ? (
          <div className="w-full flex justify-center items-center mt-36 gap-3">
            <AlertTriangle />
            <p> No one has posted yet</p>
          </div>
        ) : (
          <Suspense fallback={<p>Posts loading ...</p>}>
            <PostCard posts={posts} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default Posts;
