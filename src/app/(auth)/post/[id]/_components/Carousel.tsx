"use client";

import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useState } from "react";
import useMeasure from "react-use-measure";

type Props = {
  urls: string[];
};

const Carousel = ({ urls }: Props) => {
  const maxIndex = urls.length - 1;
  const [ref, { height, width }] = useMeasure();
  const [position, setPosition] = useState(0);
  const [index, setIndex] = useState(0);

  const toRight = () => {
    setIndex((val) => (val === length - 1 ? length - 1 : (val += 1)));
  };

  const toLeft = () => {
    setIndex((val) => (val === 0 ? 0 : (val -= 1)));
  };

  useEffect(() => {
    setPosition(-1 * index * width);
  }, [index]);

  return (
    <section className="relative w-full rounded-md">
      <div ref={ref} className="relative aspect-square w-full overflow-hidden">
        <div
          style={{
            translate: `${position}px 0px`,
          }}
          className={`absolute left-0 top-0 flex transition-all duration-500 ease-in`}
        >
          {urls.map((url, i) => (
            <div key={i} style={{ height, width }}>
              <Image
                loading="lazy"
                src={url}
                alt="post"
                width={1000}
                height={1000}
                className="h-full w-full overflow-hidden object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <div className={cn("absolute inset-y-0 right-2 flex items-center justify-center", index >= maxIndex && "hidden")}>
        <button
          onClick={toRight}
          className="inline-flex aspect-square w-7 items-center justify-center rounded-full bg-border/70"
        >
          <ChevronRightIcon className="aspect-square w-4" />
        </button>
      </div>
      <div className={cn("absolute inset-y-0 left-2 flex items-center justify-center", index <= 0 && "hidden")}>
        <button
          onClick={toLeft}
          className="inline-flex aspect-square w-7 items-center justify-center rounded-full bg-border/70"
        >
          <ChevronLeftIcon className="aspect-square w-4" />
        </button>
      </div>
    </section>
  );
};

export default Carousel;
