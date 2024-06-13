"use client";

import { cn } from "@/lib/utils";
import { useCreatePost } from "../CreatePostContext";
import ButtonSubmitCreatePost from "./ButtonSubmitCreatePost";
import { useFormState } from "react-dom";
import { createPostAction } from "./createPostAction";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";

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

  useEffect(() => {
    if (formState.type === "success") {
      toast.success(formState.message, { theme });
      setSubmitSuccessful(true);
    }
    if (formState.type === "error") {
      toast.error(formState.message, { theme });
    }
  }, [formState.type]);

  return (
    <form
      className={cn("w-full flex flex-col max-w-sm p-2", step < 1 && "hidden")}
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
          className="mt-2 w-full resize-none bg-skin-input focus:ring focus:ring-skin-primary focus:border-transparent rounded-lg border-transparent align-top shadow-sm sm:text-sm"
          rows={5}
        ></textarea>
        <input
          name="location"
          placeholder="location"
          className="w-full h-10 focus:ring focus:ring-skin-primary text-sm rounded-md bg-skin-input focus:border-transparent border-transparent"
        />
      </div>
      <ButtonSubmitCreatePost />
    </form>
  );
};

export default FormCreatePost;
