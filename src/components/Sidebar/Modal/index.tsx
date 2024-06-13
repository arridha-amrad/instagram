"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { ReactNode } from "react";

type Props = {
  closeModal: VoidFunction;
  children: ReactNode;
};

const Modal = ({ closeModal, children }: Props) => {
  return (
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
      {children}
    </div>
  );
};

export default Modal;
