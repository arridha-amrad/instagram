"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: ReactNode;
};

export default function ModalFollowers({ children }: Props) {
  const router = useRouter();
  const closeModal = () => {
    router.back();
  };

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        onClick={closeModal}
        className="absolute inset-0 bg-background/50 backdrop-blur"
      />
      {children}
    </div>,
    document.body,
  );
}
