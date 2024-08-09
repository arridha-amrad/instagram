"use client";

import Avatar from "@/components/Avatar";
import Button from "@/components/core/Button";
import { actionCreateComment } from "@/lib/next-safe-action/actionCreateComment";
import { actionCreateReply } from "@/lib/next-safe-action/actionCreateReply";
import { cn } from "@/lib/utils";
import usePostsStore from "@/stores/Posts";
import { useReplySetter } from "@/stores/ReplySetter";
import { useSessionStore } from "@/stores/Session";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function CommentForm() {
  const [isFocus, setFocus] = useState(false);

  const { session } = useSessionStore();
  const avatar = session?.user.image ?? null;
  const id = session?.user.id ?? "";
  const username = session?.user.username ?? "";

  const { post } = usePostsStore();

  if (!post) return null;

  const { theme } = useTheme();
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState("");

  const { reply, setReply } = useReplySetter();
  const { addReply, addComment } = usePostsStore();

  const replyAction = actionCreateReply.bind(null, reply?.commentId ?? "");
  const commentAction = actionCreateComment.bind(null, post.id);

  const { execute: exeReply, isExecuting: isExeReply } = useAction(
    replyAction,
    {
      onError: () => {
        toast.error("Something went wrong", { theme });
      },
      onSuccess: ({ data }) => {
        if (!data) return;
        addReply(data.commentId, {
          ...data,
          isLiked: false,
          owner: {
            avatar,
            id,
            username,
          },
          sumLikes: 0,
        });
      },
    },
  );

  const { execute: exeComment, isExecuting: isExeComment } = useAction(
    commentAction,
    {
      onError: () => {
        toast.error("Something went wrong", { theme });
      },
      onSuccess: ({ data }) => {
        if (!data) return;
        addComment({
          ...data,
          isLiked: false,
          owner: {
            avatar,
            id,
            username,
          },
          replies: {
            date: new Date(),
            data: [],
            page: 0,
            total: 0,
          },
          sumLikes: 0,
          sumReplies: 0,
          sumRepliesRemaining: 0,
        });
      },
    },
  );

  useEffect(() => {
    if (message === "") {
      setReply(null);
    }
  }, [message]);

  return (
    <div className="flex items-start gap-4">
      <section className="flex-none">
        <Avatar url={session?.user.image} />
      </section>
      <form
        action={reply ? exeReply : exeComment}
        ref={formRef}
        className="flex-1 basis-0"
      >
        <label htmlFor="NewComment" className="sr-only">
          Add new comment
        </label>

        <div className="overflow-hidden">
          <fieldset disabled={isExeReply || isExeComment}>
            <input
              name="message"
              // ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => {
                setFocus(true);
              }}
              // onBlur={() => {
              //   setFocusToCommentForm(false);
              // }}
              id="NewComment"
              className="w-full border-x-0 border-t-0 border-skin bg-background px-0 align-top sm:text-sm"
              placeholder="Add new comment"
            />

            <div
              className={cn(
                "flex items-center justify-end gap-2 pt-3 opacity-0 transition-opacity duration-200 ease-linear",
                isFocus && "opacity-100",
              )}
            >
              <Button onClick={() => setMessage("")} className="bg-background">
                Clear
              </Button>
              <Button type="submit">Add</Button>
            </div>
          </fieldset>
        </div>
      </form>
    </div>
  );
}
