"use client";

import setNewPostOnClient from "@/helpers/setNewPostOnClient";
import { cn } from "@/lib/utils";
import { usePostStore } from "@/stores/PostStore";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useCreatePost } from "../CreatePostContext";
import ButtonSubmitCreatePost from "./ButtonSubmitCreatePost";
import { createPostAction } from "./createPostAction";

const initialState = {
  data: {} as any,
  type: "",
  message: "",
};

const FormCreatePost = () => {
  const { step, files, setSubmitSuccessful } = useCreatePost();
  const { data: session } = useSession();
  const [formState, formAction] = useFormState(createPostAction, initialState);
  const { theme } = useTheme();
  const { addPost } = usePostStore();

  useEffect(() => {
    if (formState.type === "success") {
      toast.success(formState.message, { theme });
      setSubmitSuccessful(true);
      const authUser = session?.user;
      if (!authUser) return;
      setNewPostOnClient({
        authUser,
        post: formState.data,
        setterFn: addPost,
      });
    }
    if (formState.type === "error") {
      toast.error(formState.message, { theme });
    }
  }, [formState.type]);

  return (
    <form
      className={cn("flex w-full max-w-sm flex-col p-2", step < 1 && "hidden")}
      action={(data) => {
        if (session?.user.id) {
          data.append("userId", session.user.id);
          files.map((file) => data.append("images", file));
          formAction(data);
        }
      }}
    >
      <div className="flex-1 space-y-3">
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
      </div>
      <ButtonSubmitCreatePost />
    </form>
  );
};

export default FormCreatePost;
