"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = {
  closeModal: VoidFunction;
  children: ReactNode;
};

const Wrapper = ({ closeModal, children }: Props) => {
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        onClick={closeModal}
        className="absolute inset-0 bg-background/30 backdrop-blur-sm"
      />
      <div className="fixed right-4 top-4">
        <button onClick={closeModal}>
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      {children}
    </div>,
    document.body,
  );
};

export default Wrapper;
