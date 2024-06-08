"use client";

import { TPost } from "@/app/(auth)/postsFetching";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as Heart } from "@heroicons/react/24/solid";
import { likePostAction } from "./likePostAction";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  post: TPost;
};

const initialState = {
  type: "",
  message: "",
};

const PostLikeButton = ({ post: { isLiked, id } }: Props) => {
  console.log({ isLiked });
  const { theme } = useTheme();
  const { data } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [formState, formAction] = useFormState(likePostAction, initialState);

  useEffect(() => {
    if (formState.type === "error") {
      toast.error(formState.message, { theme });
    }
    if (formState.type === "success") {
      toast.success(formState.message, { theme });
    }
  }, [formState.type]);

  return (
    <form
      className="h-full inline-flex items-center justify-center"
      action={formAction}
    >
      <input
        name="userId"
        type="text"
        defaultValue={data?.user.id}
        hidden
        readOnly
      />
      <input name="postId" type="text" defaultValue={id} hidden readOnly />
      <button type="submit">
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
