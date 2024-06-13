"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as Heart } from "@heroicons/react/24/solid";
import { likePostAction } from "@/actions/postAction";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { TPost } from "@/fetchings/type";
import { usePostStore } from "@/stores/PostStore";

type Props = {
  post: TPost;
};

const initialState = {
  type: "",
  message: "",
};

const PostLikeButton = ({ post }: Props) => {
  const { isLiked, id } = post;
  const { theme } = useTheme();
  const { data } = useSession();
  const { likePost } = usePostStore();

  const lp = likePostAction.bind(null, {
    postId: id,
    userId: data?.user.id ?? "",
  });

  const [formState, formAction] = useFormState(lp, initialState);
  const [mId, setMId] = useState(0);
  useEffect(() => {
    if (formState.type === "error") {
      toast.error(formState.message, { theme });
    }
  }, [mId]);

  return (
    <form
      className="inline-flex h-full items-center justify-center"
      action={() => {
        setMId(new Date().getTime());
        likePost(post);
        formAction();
      }}
    >
      <button disabled={!data?.user.id} type="submit">
        {isLiked ? (
          <Heart className="aspect-square w-7 fill-pink-600" />
        ) : (
          <HeartIcon className="aspect-square w-7" />
        )}
      </button>
    </form>
  );
};

export default PostLikeButton;
