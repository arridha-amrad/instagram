"use client";

import { cn } from "@/lib/utils";
import { useCreatePost } from "./CreatePostContext";

const ModalTitle = () => {
  const { step, setStep, preview } = useCreatePost();
  return (
    <div
      className={cn(
        "flex h-[50px] w-full items-center justify-center border-b border-skin bg-background px-4",
        preview.length > 0 && "justify-between",
      )}
    >
      <button
        onClick={() => setStep((val) => (val -= 1))}
        className={cn(
          "invisible font-semibold text-skin-inverted",
          step > 0 && "visible",
        )}
      >
        Back
      </button>
      <h1 className="text-sm font-semibold">Create new post</h1>
      <button
        onClick={() => setStep((val) => (val += 1))}
        className={cn(
          "font-semibold text-skin-inverted",
          preview.length === 0 && "invisible",
          step > 0 && "invisible",
        )}
      >
        Next
      </button>
    </div>
  );
};

export default ModalTitle;
