"use client";

import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Props = {
  urls: string[];
  isFirstPost?: boolean;
};

const Carousel = ({ urls, isFirstPost }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onDotSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    onDotSelect(emblaApi);
    onInit(emblaApi);
    emblaApi
      .on("reInit", onSelect)
      .on("reInit", onInit)
      .on("reInit", onDotSelect)
      .on("select", onDotSelect)
      .on("select", onSelect);
  }, [emblaApi, onSelect, onInit, onDotSelect]);

  return (
    <section className="group relative w-full">
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
        id="embla_view_port"
        ref={emblaRef}
        className="w-full overflow-hidden"
        style={{ aspectRatio: 4 / 5 }}
      >
        <div id="embla_container" className="flex h-full">
          {urls.map((url, i) => (
            <div
              key={i}
              className="h-full min-w-0 flex-shrink-0 flex-grow-0 basis-full"
            >
              <Image
                loading={isFirstPost ? "eager" : "lazy"}
                priority={isFirstPost}
                src={url}
                alt="post"
                width={1000}
                height={1000}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="invisible absolute inset-y-0 left-2 flex items-center justify-center group-hover:visible">
        <button
          disabled={prevBtnDisabled}
          onClick={onPrevButtonClick}
          className="flex aspect-square w-8 items-center justify-center rounded-full bg-background/50 disabled:opacity-0"
        >
          <ChevronLeftIcon className="aspect-square w-4" />
        </button>
      </div>
      <div className="invisible absolute inset-y-0 right-2 flex items-center justify-center group-hover:visible">
        <button
          disabled={nextBtnDisabled}
          onClick={onNextButtonClick}
          className="flex aspect-square w-8 items-center justify-center rounded-full bg-background/50 disabled:opacity-0"
        >
          <ChevronRightIcon className="aspect-square w-4" />
        </button>
      </div>

      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center justify-center gap-1 rounded-lg p-1">
        {scrollSnaps.map((_, i) => (
          <button
            onClick={() => onDotButtonClick(i)}
            key={i}
            className={cn(
              "aspect-square w-2 rounded-full",
              i === selectedIndex ? "bg-background/70" : "bg-skin-input/40",
            )}
          />
        ))}
      </div>
      <div className="absolute right-2 top-2 opacity-0 transition-opacity duration-200 ease-linear group-hover:opacity-100">
        <div className="relative rounded-md bg-background bg-opacity-50 px-2 py-1 text-sm">
          {selectedIndex + 1} / {scrollSnaps.length}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
