"use client";

import Modal from "@/components/core/Modals/Wrapper";
import { CogIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import Logout from "./Logout";

const Settings = () => {
  const [open, setOpen] = useState(false);
  const closeModal = () => {
    setOpen(false);
  };
  const openModal = () => {
    setOpen(true);
  };
  return (
    <>
      <button onClick={openModal}>
        <CogIcon className="aspect-square w-6" />
      </button>
      {open && (
        <Modal closeModal={closeModal}>
          <div className="relative flex w-full max-w-sm flex-col rounded-md border border-skin bg-background">
            <Link href="/settings" className="py-3 text-center">
              Settings
            </Link>
            <div className="h-px w-full bg-border" />
            <Link href="/settings/change-username" className="py-3 text-center">
              Change Username
            </Link>
            <div className="h-px w-full bg-border" />
            <Link href="/settings/change-password" className="py-3 text-center">
              Change Password
            </Link>
            <div className="h-px w-full bg-border" />
            <Logout />
            <div className="h-px w-full bg-border" />
            <button onClick={closeModal} className="py-3">
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Settings;
