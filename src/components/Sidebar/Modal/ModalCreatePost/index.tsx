"use client";

import Modal from "@/components/core/ModalWrapper";
import { cn } from "@/lib/utils";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useMeasure from "react-use-measure";
import { className } from "../../styles";
import { useCreatePost } from "./CreatePostContext";
import FormCreatePost from "./FormCreatePost";
import ModalTitle from "./ModalTitle";
import Picker from "./Picker";
import Preview from "./Preview";

const NewPostModal = () => {
  const [open, setOpen] = useState(false);
  const { preview, step, reset, isSubmitSuccessful } = useCreatePost();
  const [ref, { height }] = useMeasure();

  const closeModal = () => {
    setOpen(false);
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
      reset();
    }
  }, [isSubmitSuccessful]);

  return (
    <>
      <button onClick={() => setOpen(true)} className={className.button}>
        <div className={className.iconContainer}>
          <PencilSquareIcon />
        </div>
        <span className="hidden xl:inline">New Post</span>
      </button>
      {open &&
        createPortal(
          <Modal closeModal={closeModal}>
            <div className="relative overflow-hidden rounded-md border border-skin bg-background">
              <ModalTitle />
              <div
                ref={ref}
                className={cn(
                  "aspect-square max-h-[500px] min-h-[70vh]",
                  step >= 1 && "aspect-auto",
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
          </Modal>,
          document.body,
        )}
    </>
  );
};

export default NewPostModal;
