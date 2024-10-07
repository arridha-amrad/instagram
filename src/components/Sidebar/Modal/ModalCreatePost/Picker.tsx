"use client";

import PhotoIcon from "@heroicons/react/20/solid/PhotoIcon";
import { ChangeEvent, useRef } from "react";
import { useCreatePost } from "./CreatePostContext";
import Button from "@/components/core/Button";

const Picker = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { setFiles, setPreview } = useCreatePost();
  const onChangeFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const urls: string[] = [];
      const f: File[] = [];
      for (let i = 0; i < files.length; i++) {
        f.push(files[i]);
        urls.push(URL.createObjectURL(files[i]));
      }
      setFiles(f);
      setPreview(urls);
    }
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <PhotoIcon className="aspect-square w-24 stroke-1" />
      <h1>Drag photos here</h1>
      <input
        onChange={onChangeFileInput}
        hidden
        multiple
        type="file"
        ref={fileInputRef}
      />
      <Button onClick={() => fileInputRef.current?.click()}>
        Select from computer
      </Button>
    </div>
  );
};

export default Picker;
