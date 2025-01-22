"use client";

import Button from "@/components/core/Button";
import { createPost } from "@/lib/actions/post";
import { cn, showToast } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { usePathname } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { useCreatePost } from "./CreatePostContext";

const FormCreatePost = () => {
  const { step, files, setSubmitSuccessful } = useCreatePost();
  const pathname = usePathname();

  const [state, setState] = useState({
    location: "",
    description: "",
  });

  const { isExecuting, execute } = useAction(createPost.bind(null, pathname), {
    onError: () => {
      showToast("Something went wrong", "error");
    },
    onSuccess: ({ data }) => {
      if (data) {
        showToast(data, "success");
      }
      setSubmitSuccessful(true);
    },
  });

  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", state.description);
    formData.append("location", state.location);
    files.forEach((file) => formData.append("images", file));
    startTransition(async () => {
      const response = await fetch("/api/post", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        showToast(data.message, "success");
        setSubmitSuccessful(true);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex w-full max-w-sm flex-col p-2", step < 1 && "hidden")}
      // action={(data) => {
      //   files.map((file) => data.append("images", file));
      //   execute(data);
      // }}
    >
      <fieldset disabled={isPending} className="flex-1 space-y-3">
        <textarea
          value={state.description}
          onChange={(e) =>
            setState({
              ...state,
              description: e.target.value,
            })
          }
          name="description"
          placeholder="how you describe this post?"
          className="mt-2 w-full resize-none rounded-lg border-transparent bg-skin-input align-top shadow-sm focus:border-transparent focus:ring focus:ring-skin-primary sm:text-sm"
          rows={5}
        ></textarea>

        <input
          value={state.location}
          onChange={(e) =>
            setState({
              ...state,
              location: e.target.value,
            })
          }
          name="location"
          placeholder="location"
          className="h-10 w-full rounded-md border-transparent bg-skin-input text-sm focus:border-transparent focus:ring focus:ring-skin-primary"
        />
      </fieldset>
      <Button
        isLoading={isPending}
        className="inline-flex w-full justify-center"
        type="submit"
      >
        Create Post
      </Button>
    </form>
  );
};

export default FormCreatePost;
