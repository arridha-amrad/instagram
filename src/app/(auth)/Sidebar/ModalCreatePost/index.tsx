"use client";

import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCreatePost } from "../CreatePostContext";
import useMeasure from "react-use-measure";
import Preview from "./Preview";
import Picker from "./Picker";
import { cn } from "@/lib/utils";
import FormCreatePost from "./Form/FormCreatePost";
import ModalTitle from "./ModalTitle";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

const NewPostModal = () => {
  const [open, setOpen] = useState(false);
  const { preview, step, setPreview, setStep, setFiles, isSubmitSuccessful } =
    useCreatePost();
  const [ref, { height }] = useMeasure();

  const closeModal = () => {
    setOpen(false);
    setPreview([]);
    setStep(0);
    setFiles([]);
  };

  useEffect(() => {
    if (open) {
      document.documentElement.classList.add("overflow-y-hidden", "pr-4");
    } else {
      document.documentElement.classList.remove("overflow-y-hidden", "pr-4");
    }
  }, [open]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      closeModal();
    }
  }, [isSubmitSuccessful]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex
        hover:bg-skin-fill transition-colors duration-300 ease-linear
        w-full xl:w-fit h-[40px] justify-center xl:justify-start items-center gap-4 xl:px-4 rounded-md xl:py-2"
      >
        <PencilSquareIcon className="w-6 aspect-square" />
        <span className="xl:inline hidden">New Post</span>
      </button>
      {open &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center">
            <div
              onClick={closeModal}
              className="absolute inset-0 bg-background/30 backdrop-blur-sm"
            />
            <div className="fixed top-4 right-4">
              <button onClick={closeModal}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="relative bg-background overflow-hidden border-skin rounded-md border">
              <ModalTitle />
              <div
                ref={ref}
                className={cn(
                  "min-h-[70vh] max-h-[500px] aspect-square",
                  step >= 1 && "aspect-auto"
                )}
              >
                {preview.length === 0 ? (
                  <Picker />
                ) : (
                  <section
                    className="flex gap-2 transition-all duration-300 ease-linear"
                    style={{ width: step >= 1 ? height + 384 : height }}
                  >
                    <Preview height={height} width={height} />
                    <FormCreatePost />
                  </section>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default NewPostModal;
