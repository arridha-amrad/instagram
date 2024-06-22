"use client";

import { useState } from "react";
import Button from "@/components/core/Button";
import { signOut } from "next-auth/react";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Modal from "@/components/core/Modals/Wrapper";
import { className } from "../styles";

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
      <button onClick={() => setOpen(true)} className={className.button}>
        <div className={className.iconContainer}>
          <ArrowRightStartOnRectangleIcon />
        </div>
        <span className="hidden xl:inline">Logout</span>
      </button>
      {open && (
        <Modal closeModal={closeModal}>
          <div className="relative max-w-sm overflow-hidden rounded-md border border-skin bg-background">
            <section className="border-b border-skin p-4">
              <h1 className="text-center text-xl font-semibold">Logout</h1>
            </section>
            <p className="px-4 py-8 text-center text-sm text-skin-muted">
              This action will clear your session. You need to relogin again to
              use this app. Are you sure?
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
        </Modal>
      )}
    </>
  );
};

export default ModalLogout;
