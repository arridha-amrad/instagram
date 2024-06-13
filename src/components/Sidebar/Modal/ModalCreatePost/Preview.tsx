"use client";

import Image from "next/image";
import { useCreatePost } from "./CreatePostContext";
import ChevronRightIcon from "@heroicons/react/20/solid/ChevronRightIcon";
import ChevronLeftIcon from "@heroicons/react/20/solid/ChevronLeftIcon";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  height: number;
  width: number;
};

const Preview = ({ height, width }: Props) => {
  const { preview } = useCreatePost();

  const [index, setIndex] = useState(0);
  const next = () => {
    setIndex((val) => (val += 1));
  };
  const prev = () => {
    setIndex((val) => (val -= 1));
  };
  return (
    <div className="relative" style={{ width, height }}>
      <Image
        alt="post"
        loading="lazy"
        width={500}
        height={500}
        src={preview[index]}
        className="object-cover object-center w-full h-full"
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
