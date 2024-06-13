"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as Heart } from "@heroicons/react/24/solid";
import { likePostAction } from "./likePostAction";
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
  const [formState, formAction] = useFormState(likePostAction, initialState);
  const [mId, setMId] = useState(0);

  useEffect(() => {
    if (formState.type === "error") {
      toast.error(formState.message, { theme });
    }
    if (formState.type === "success") {
      toast.success(formState.message, { theme });
      likePost(post);
    }
  }, [mId]);

  return (
    <form
      className="h-full inline-flex items-center justify-center"
      action={(data) => {
        setMId(new Date().getTime());
        formAction(data);
      }}
    >
      <input
        name="userId"
        type="text"
        defaultValue={data?.user.id}
        hidden
        readOnly
      />
      <input name="postId" type="text" defaultValue={id} hidden readOnly />
      <button disabled={!data?.user.id} type="submit">
        {isLiked ? (
          <Heart className="w-7 aspect-square fill-pink-600" />
        ) : (
          <HeartIcon className="w-7 aspect-square" />
        )}
      </button>
    </form>
  );
};

export default PostLikeButton;
