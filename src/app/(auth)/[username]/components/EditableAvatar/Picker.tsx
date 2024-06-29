"use client";

import { PhotoIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, Dispatch, Ref, SetStateAction, forwardRef, useRef } from "react";
import { useFormStatus } from "react-dom";
import mergeRefs from "merge-refs";

type Props = {
  setIsSubmit: Dispatch<SetStateAction<boolean>>;
};

const Picker = ({ setIsSubmit }: Props, ref: Ref<HTMLInputElement>) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onChangeFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsSubmit(true);
    }
  };
  const { pending } = useFormStatus();
  if (pending) {
    return null;
  }
  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 group-hover:opacity-100"
    >
      <PhotoIcon className="aspect-square w-7" />
      <input name="image" onChange={onChangeFileInput} hidden ref={mergeRefs(inputRef, ref)} type="file" />
    </div>
  );
};

export default forwardRef(Picker);
