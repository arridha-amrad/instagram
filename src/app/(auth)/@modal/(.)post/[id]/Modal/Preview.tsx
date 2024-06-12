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
        className="object-cover object-center w-auto h-full max-w-[700px]"
      />
      <div className="absolute inset-y-0 flex items-center justify-center right-2">
        <button
          onClick={next}
          className={cn(
            "w-6 bg-background/50 hover:bg-background/60 aspect-square rounded-full inline-flex items-center justify-center",
            index === preview.length - 1 && "hidden"
          )}
        >
          <ChevronRightIcon className="w-4 aspect-square" />
        </button>
      </div>
      <div className="absolute inset-y-0 flex items-center justify-center left-2">
        <button
          onClick={prev}
          className={cn(
            "w-6 bg-background/50 hover:bg-background/60 aspect-square rounded-full inline-flex items-center justify-center",
            index === 0 && "hidden"
          )}
        >
          <ChevronLeftIcon className="w-4 aspect-square" />
        </button>
      </div>
    </div>
  );
};

export default Preview;
