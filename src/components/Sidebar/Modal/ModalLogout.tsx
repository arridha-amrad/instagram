"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/core/Button";
import { signOut } from "next-auth/react";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import Modal from "@/components/core/Modals/Wrapper";

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
        className="flex h-[40px] w-full items-center justify-center gap-4 rounded-md transition-colors duration-200 ease-linear dark:hover:bg-red-600/20 xl:w-fit xl:justify-start xl:px-4"
      >
        <ArrowRightStartOnRectangleIcon className="aspect-square w-7 stroke-1" />
        <span className="hidden xl:inline">Logout</span>
      </button>
      {open &&
        createPortal(
          <Modal closeModal={closeModal}>
            <div className="relative max-w-sm overflow-hidden rounded-md border border-skin bg-background">
              <section className="border-b border-skin p-4">
                <h1 className="text-center text-xl font-semibold">Logout</h1>
              </section>
              <p className="px-4 py-8 text-center text-sm text-skin-muted">
                This action will clear your session. You need to relogin again
                to use this app. Are you sure?
              </p>
              <section className="flex justify-end gap-3 p-4">
                <button
                  onClick={closeModal}
                  className="rounded-md border border-skin px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <Button onClick={logout} className="text-sm">
                  Yes
                </Button>
              </section>
            </div>
          </Modal>,
          document.body,
        )}
    </>
  );
};

export default ModalLogout;
