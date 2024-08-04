"use client";

import Avatar from "@/components/Avatar";
import Button from "@/components/core/Button";
import { useCreateComment } from "@/hooks/useCreateComment";
import { cn } from "@/lib/utils";
import usePostsStore from "@/stores/Posts";
import { useSessionStore } from "@/stores/Session";

import { useState } from "react";

export default function CommentForm() {
  const [isFocus, setFocus] = useState(false);
  const { session } = useSessionStore();
  const { post } = usePostsStore();
  const {
    execute,
    formRef,
    inputRef,
    isExecuting,
    message,
    setFocusToCommentForm,
    setMessage,
  } = useCreateComment({
    post: post!,
    session,
  });

  return (
    <div className="flex items-start gap-4">
      <section className="flex-none">
        <Avatar url={session?.user.image} />
      </section>
      <form action={execute} ref={formRef} className="flex-1 basis-0">
        <label htmlFor="NewComment" className="sr-only">
          Add new comment
        </label>

        <div className="overflow-hidden">
          <input
            name="message"
            disabled={isExecuting}
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => {
              setFocus(true);
            }}
            onBlur={() => {
              setFocusToCommentForm(false);
            }}
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
            <Button
              onClick={() => setMessage("")}
              disabled={isExecuting}
              className="bg-background"
            >
              Clear
            </Button>
            <Button type="submit" isLoading={isExecuting}>
              Add
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
