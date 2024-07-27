"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import FaceSmileIcon from "@heroicons/react/24/outline/FaceSmileIcon";
import { EmojiStyle, Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";

const Picker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false },
);

export default function ButtonEmoji() {
  const [isOpen, setOpen] = useState(false);
  const { theme } = useTheme();

  const pickerRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutsidePicker = (e: MouseEvent) => {
    if (!pickerRef.current?.contains(e.target as any)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsidePicker);
    return document.addEventListener("mousedown", handleClickOutsidePicker);
  }, []);

  return (
    <>
      <button type="button" onClick={() => setOpen((val) => !val)}>
        <FaceSmileIcon className="aspect-square w-4" />
      </button>
      <div ref={pickerRef} className="absolute bottom-0 right-0">
        <Picker
          theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
          searchDisabled
          emojiStyle={EmojiStyle.APPLE}
          open={isOpen}
          previewConfig={{
            showPreview: false,
          }}
        />
      </div>
    </>
  );
}
