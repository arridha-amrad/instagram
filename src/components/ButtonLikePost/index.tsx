"use client";

import { TPost } from "@/fetchings/type";
import { usePostStore } from "@/stores/PostStore";
import { useSessionStore } from "@/stores/SessionStore";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as Heart } from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";
import { toast } from "react-toastify";
import { likePostAction } from "./actionLike";

type Props = {
  post: TPost;
};

const ButtonLikePost = ({ post }: Props) => {
  const { likePost } = usePostStore();
  const { session } = useSessionStore();
  const { theme } = useTheme();

  const like = async () => {
    likePost(post.id);
    const result = await likePostAction({
      postId: post.id,
      userId: session?.user.id ?? "",
    });
    if (result?.serverError) {
      toast.error("Something went wrong", { theme });
    }
  };

  return (
    <button onClick={like} disabled={!session?.user.id}>
      {post.isLiked ? (
        <Heart className="aspect-square w-7 fill-pink-600" />
      ) : (
        <HeartIcon className="aspect-square w-7" />
      )}
    </button>
  );
};

export default ButtonLikePost;
