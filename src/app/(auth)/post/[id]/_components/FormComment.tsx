"use client";

import Avatar from "@/components/Avatar";
import Button from "@/components/core/Button";
import Spinner from "@/components/Spinner";
import { useActionCreateComment } from "@/hooks/useActionCreateComment";
import { useActionCreateReply } from "@/hooks/useActionCreateReply";
import { cn } from "@/lib/utils";
import usePostsStore from "@/stores/Posts";
import { useReplySetter } from "@/stores/ReplySetter";
import { useSessionStore } from "@/stores/Session";
import mergeRefs from "merge-refs";
import { useParams } from "next/navigation";

import { forwardRef, Ref, useEffect, useRef, useState } from "react";

const CommentForm = ({}, ref: Ref<HTMLInputElement>) => {
  const [isFocus, setFocus] = useState(false);
  const params = useParams();

  const { session } = useSessionStore();

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState("");

  const { reply, setReply } = useReplySetter();

  const { exeComment, isExeComment, isSuccess } = useActionCreateComment(
    params.id as string,
  );

  const { execute, hasSucceeded, isExecuting } = useActionCreateReply(
    reply?.commentId ?? "",
  );

  useEffect(() => {
    if (reply?.commentId) {
      setMessage(`@${reply.username} `);
      inputRef.current?.focus();
      window.scroll({ top: inputRef.current?.scrollTop, behavior: "smooth" });
    }
  }, [reply?.commentId]);

  useEffect(() => {
    if (isSuccess || hasSucceeded) {
      formRef.current?.reset();
      setMessage("");
    }
  }, [isSuccess, hasSucceeded]);

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
        action={reply ? execute : exeComment}
        ref={formRef}
        className="flex-1 basis-0"
      >
        <label htmlFor="NewComment" className="sr-only">
          Add new comment
        </label>

        <div className="relative overflow-hidden">
          {(isExeComment || isExecuting) && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <Spinner />
            </div>
          )}
          <fieldset disabled={isExecuting || isExeComment}>
            <input
              name="message"
              ref={mergeRefs(ref, inputRef)}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => {
                setFocus(true);
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
                type="button"
                onClick={() => setMessage("")}
                className="bg-background"
              >
                Clear
              </Button>
              <Button type="submit">Add</Button>
            </div>
          </fieldset>
        </div>
      </form>
    </div>
  );
};

export default forwardRef(CommentForm);
