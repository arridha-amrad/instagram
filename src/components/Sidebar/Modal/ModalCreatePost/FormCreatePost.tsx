"use client";

import Button from "@/components/core/Button";
import { actionCreatePost } from "@/lib/next-safe-action/actionCreatePost";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { useCreatePost } from "./CreatePostContext";

const FormCreatePost = () => {
  const { step, files, setSubmitSuccessful } = useCreatePost();
  const { theme } = useTheme();
  const pathname = usePathname();

  const { isExecuting, execute } = useAction(actionCreatePost, {
    onError: () => {
      toast.error("Something went wrong", { theme });
    },
    onSuccess: () => {
      toast.success("New post created successfully", { theme });
      setSubmitSuccessful(true);
    },
  });

  return (
    <form
      className={cn("flex w-full max-w-sm flex-col p-2", step < 1 && "hidden")}
      action={(data) => {
        files.map((file) => data.append("images", file));
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
        <input name="pathname" hidden defaultValue={pathname} readOnly />
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
