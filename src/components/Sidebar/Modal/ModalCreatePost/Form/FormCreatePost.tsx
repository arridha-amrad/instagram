"use client";

import Button from "@/components/core/Button";
import setNewPostOnClient from "@/helpers/setNewPostOnClient";
import { cn } from "@/lib/utils";

import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useCreatePost } from "../CreatePostContext";
import { createPostAction } from "./actionCreatePost";
import { useHomePageStore } from "@/lib/zustand/homePageStore";
import useBoundProfileStore from "@/lib/zustand/profilePageStore";
import { useSessionStore } from "@/stores/Session";

const FormCreatePost = () => {
  const { step, files, setSubmitSuccessful } = useCreatePost();
  const { session } = useSessionStore();
  const cpa = createPostAction.bind(null, session?.user.id ?? "");
  const { result, isExecuting, hasErrored, hasSucceeded, execute } =
    useAction(cpa);
  const { theme } = useTheme();
  const { addPost } = useHomePageStore();
  const { addPost: adp } = useBoundProfileStore();

  useEffect(() => {
    if (hasSucceeded && result.data?.message) {
      toast.success(result.data.message, { theme });
      setSubmitSuccessful(true);
      const authUser = session?.user;
      if (!authUser) return;
      setNewPostOnClient({
        authUser,
        post: result.data.data,
        setterFn: addPost,
      });
    }
  }, [hasSucceeded]);

  useEffect(() => {
    if (hasErrored) {
      console.log("fe ", result.fetchError);
      console.log("ve : ", result.validationErrors);
      console.log("se : ", result.serverError);

      toast.error("Somethng went wrong", { theme });
    }
  }, [hasErrored]);

  return (
    <form
      className={cn("flex w-full max-w-sm flex-col p-2", step < 1 && "hidden")}
      action={(data) => {
        files.map((file) => data.append("images", file));
        console.log("location : ", data.get("location"));
        execute(data);
      }}
    >
      <fieldset disabled={isExecuting} className="flex-1 space-y-3">
        <textarea
          name="description"
          placeholder="how you describe this post?"
          className="mt-2 w-full resize-none rounded-lg border-transparent bg-skin-input align-top shadow-sm focus:border-transparent focus:ring focus:ring-skin-primary sm:text-sm"
          rows={5}
        ></textarea>
        <input
          name="location"
          placeholder="location"
          className="h-10 w-full rounded-md border-transparent bg-skin-input text-sm focus:border-transparent focus:ring focus:ring-skin-primary"
        />
      </fieldset>
      <Button
        isLoading={isExecuting}
        className="inline-flex w-full justify-center"
        type="submit"
      >
        Create Post
      </Button>
    </form>
  );
};

export default FormCreatePost;
