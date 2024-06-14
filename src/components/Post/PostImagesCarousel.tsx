"use client";

import MySpinner from "@/components/Spinner";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState, useTransition } from "react";

type PostContentUrl = {
  type: "image" | "video";
  url: string;
  publicId: string;
};

type Props = {
  urls: PostContentUrl[];
};

const PostImagesCarousel = ({ urls }: Props) => {
  const maxIndex = urls.length - 1;
  const [isPending, startTransition] = useTransition();
  const [index, setIndex] = useState(0);
  const next = () => {
    startTransition(() => {
      setIndex((val) => (val += 1));
    });
  };
  const prev = () => {
    startTransition(() => {
      setIndex((val) => (val -= 1));
    });
  };
  return (
    <section className="relative w-full">
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <MySpinner />
        </div>
      )}

      <div className="absolute inset-0 flex animate-pulse items-center justify-center rounded bg-gray-300 dark:bg-gray-700">
        <svg
          className="h-10 w-10 text-gray-200 dark:text-gray-600"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 18"
        >
          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
        </svg>
      </div>

      <div
        className="relative overflow-hidden"
        style={{ width: "100%", aspectRatio: 3 / 4 }}
      >
        <Image
          className="h-full w-full object-cover object-center"
          src={urls[index].url}
          width={500}
          height={500}
          alt="post"
          loading="lazy"
        />
      </div>
      <div
        className={cn(
          "absolute inset-y-0 right-2 flex items-center justify-center",
          index >= maxIndex && "hidden",
        )}
      >
        <button
          onClick={next}
          className="inline-flex aspect-square w-7 items-center justify-center rounded-full bg-border/70"
        >
          <ChevronRightIcon className="aspect-square w-4" />
        </button>
      </div>
      <div
        className={cn(
          "absolute inset-y-0 left-2 flex items-center justify-center",
          index <= 0 && "hidden",
        )}
      >
        <button
          onClick={prev}
          className="inline-flex aspect-square w-7 items-center justify-center rounded-full bg-border/70"
        >
          <ChevronLeftIcon className="aspect-square w-4" />
        </button>
      </div>
    </section>
  );
};

export default PostImagesCarousel;
