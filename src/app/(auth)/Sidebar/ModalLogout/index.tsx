"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import Button from "@/components/core/Button";
import { signOut } from "next-auth/react";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";

const ModalLogout = () => {
  const [open, setOpen] = useState(false);
  const closeModal = () => {
    setOpen(false);
  };

  const router = useRouter();

  const logout = async () => {
    await signOut({ redirect: false });
    router.replace("/login");
  };
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-[40px] xl:w-fit w-full xl:px-4 flex items-center xl:justify-start justify-center gap-4 transition-colors duration-200 ease-linear rounded-md dark:hover:bg-red-600/20 "
      >
        <ArrowRightStartOnRectangleIcon className="w-7 aspect-square" />
        <span className="xl:inline hidden">Logout</span>
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
            <div className="relative overflow-hidden border-skin rounded-md border max-w-sm">
              <section className="p-4 border-b border-skin">
                <h1 className="font-semibold text-xl text-center">Logout</h1>
              </section>
              <p className="text-sm text-center text-skin-muted px-4 py-8">
                This action will clear your session. You need to relogin again
                to use this app. Are you sure?
              </p>
              <section className="flex justify-end p-4 gap-3">
                <button
                  onClick={closeModal}
                  className="text-sm px-4 py-2 rounded-md border border-skin"
                >
                  Cancel
                </button>
                <Button onClick={logout} className="text-sm">
                  Yes
                </Button>
              </section>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default ModalLogout;
