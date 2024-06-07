"use client";

import { cn } from "@/lib/utils";
import { useCreatePost } from "../../CreatePostContext";
import ButtonSubmitCreatePost from "./ButtonSubmitCreatePost";
import { useFormState } from "react-dom";
import { createPostAction } from "./createPostAction";

const initialState = {
  data: {} as any,
};

const FormCreatePost = () => {
  const { step, files } = useCreatePost();
  const [formState, formAction] = useFormState(createPostAction, initialState);

  return (
    <form
      className={cn("w-full flex flex-col max-w-sm p-2", step < 1 && "hidden")}
      action={(data) => {
        files.map((file) => data.append("images", file));
        formAction(data);
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
