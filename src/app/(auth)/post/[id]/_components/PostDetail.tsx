"use client";

import PostExpanded from "@/components/PostExpanded";
import { TComment } from "@/fetchings/type";
import { useCommentsStore } from "@/stores/CommentsStore";
import { usePostStore } from "@/stores/PostStore";
import { useEffect } from "react";
import Carousel from "./_Carousel";

type Props = {
  comments: TComment[];
};

const PostDetail = ({ comments }: Props) => {
  const { setComments } = useCommentsStore();
  const { posts } = usePostStore();

  useEffect(() => {
    setComments(comments);
  }, [comments]);

  if (!posts[0]) {
    return (
      <div className="mx-auto w-full">
        <p>Opps, user not found</p>
      </div>
    );
  }

  return (
    <div>
      <Carousel urls={[]} />
    </div>
  );

  // return (
  //   <div className="mx-6 flex flex-1 basis-0 border border-skin">
  //     <PostExpanded post={posts[0]} />
  //   </div>
  // );
};

export default PostDetail;
