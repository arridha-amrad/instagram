"use client";

import Image from "next/image";
import ChevronRightIcon from "@heroicons/react/20/solid/ChevronRightIcon";
import ChevronLeftIcon from "@heroicons/react/20/solid/ChevronLeftIcon";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePostStore } from "@/stores/PostStore";

type Props = {
  height: number;
  postId: string;
};

const Preview = ({ height, postId }: Props) => {
  const { posts } = usePostStore();
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return null;
  }

  const preview = post.urls;

  const [index, setIndex] = useState(0);
  const next = () => {
    setIndex((val) => (val += 1));
  };
  const prev = () => {
    setIndex((val) => (val -= 1));
  };

  return (
    <div className="relative" style={{ height }}>
      <Image
        alt="post"
        loading="lazy"
        width={500}
        height={500}
        src={preview[index].url}
        className="h-full w-auto max-w-[700px] object-cover object-center"
      />
      <div className="absolute inset-y-0 right-2 flex items-center justify-center">
        <button
          onClick={next}
          className={cn(
            "inline-flex aspect-square w-6 items-center justify-center rounded-full bg-background/50 hover:bg-background/60",
            index === preview.length - 1 && "hidden",
          )}
        >
          <ChevronRightIcon className="aspect-square w-4" />
        </button>
      </div>
      <div className="absolute inset-y-0 left-2 flex items-center justify-center">
        <button
          onClick={prev}
          className={cn(
            "inline-flex aspect-square w-6 items-center justify-center rounded-full bg-background/50 hover:bg-background/60",
            index === 0 && "hidden",
          )}
        >
          <ChevronLeftIcon className="aspect-square w-4" />
        </button>
      </div>
    </div>
  );
};

export default Preview;
