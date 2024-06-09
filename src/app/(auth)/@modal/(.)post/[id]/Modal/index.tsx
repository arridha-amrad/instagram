"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Preview from "./Preview";
import useMeasure from "react-use-measure";
import { usePostStore } from "@/app/(auth)/PostStore";
import Avatar from "./Avatar";
import { formatDistanceToNowStrict } from "date-fns";
import PostLikeButton from "@/app/(auth)/components/Post/PostActions/Like/PostLikeButton";
import {
  ChatBubbleLeftIcon,
  ChatBubbleOvalLeftIcon,
} from "@heroicons/react/24/outline";
import Button from "@/components/core/Button";

type Props = {
  id: string;
};

const Modal = ({ id }: Props) => {
  const router = useRouter();
  const { posts } = usePostStore();
  const post = posts.find((p) => p.id === id);
  if (!post) return null;

  const [ref, { height, width }] = useMeasure();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (open) {
      document.documentElement.classList.add("overflow-y-hidden", "pr-4");
    } else {
      document.documentElement.classList.remove("overflow-y-hidden", "pr-4");
    }
  }, [open]);

  const closeModal = () => {
    router.back();
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        onClick={closeModal}
        className="absolute inset-0 bg-background/30 backdrop-blur-sm"
      />
      <div className="relative flex border border-skin">
        <div ref={ref} className="h-[90vh] aspect-square w-max">
          <Preview postId={id} height={height} />
        </div>
        <div className=" w-[400px] flex flex-col bg-background">
          <div className="h-[70px] border-b border-skin flex items-center gap-3 px-4">
            <Avatar url={post.owner.avatar} />
            <div>
              <h1 className="font-semibold text-sm">{post.owner.username}</h1>
            </div>
          </div>
          <div className="flex items-start gap-3 px-4 py-2">
            <div>
              <Avatar url={post.owner.avatar} />
            </div>
            <div className="pt-0.5">
              <h1 className="font-semibold text-sm inline pr-2">
                {post.owner.username}
              </h1>
              <p className="text-skin-muted text-sm inline">
                {post.description}
              </p>
              <div className="py-4">
                <p className="text-xs text-skin-muted font-thin">
                  {formatDistanceToNowStrict(post.createdAt)}
                </p>
              </div>
            </div>
          </div>
          <section className="flex-1 w-full bg-green-500/50 overflow-y-auto">
            a
          </section>
          <section>
            <div className="w-full px-2 py-2">
              <div className="flex gap-3 items-center py-2">
                <PostLikeButton post={post} />
                <button>
                  <ChatBubbleOvalLeftIcon className="w-7 aspect-square -scale-x-100" />
                </button>
              </div>
              <div className="px-1">
                <h1 className="font-semibold">
                  {post.likes}
                  <span className="text-sm pl-1">
                    {post.likes > 1 ? "likes" : "like"}
                  </span>
                </h1>
                <p className="text-xs text-skin-muted">
                  {formatDistanceToNowStrict(post.createdAt)}
                </p>
              </div>
            </div>
          </section>
          <section className="flex items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Add comment..."
                className="w-full flex-1 border-none bg-skin-input focus:ring-0 px-2"
              />
            </div>
            <button className="text-skin-muted px-2 bg-background">Send</button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Modal;
