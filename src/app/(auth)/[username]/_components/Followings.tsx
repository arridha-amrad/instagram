"use client";

import Modal from "@/components/core/Modals/Wrapper";
import { useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  username: string;
  total: number;
};

export default function Followings() {
  const [open, setOpen] = useState(false);
  const close = () => {
    setOpen(false);
  };
  const openModal = () => {
    setOpen(true);
  };
  return (
    <>
      <button onClick={openModal}>
        <span className="pr-1 font-semibold">{0} </span>
        Followings
      </button>
      {open &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center">
            <div
              onClick={close}
              className="absolute inset-0 bg-background/50 backdrop-blur"
            ></div>
            <div className="relative">
              <p>Your modal</p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
