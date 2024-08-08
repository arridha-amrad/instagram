"use client";

import { TSearchUser } from "@/lib/drizzle/queries/type";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ReactNode, useState } from "react";
import { createPortal } from "react-dom";
import { className } from "../styles";
import FormSearchUser from "./FormSearchUser";
import UserCard from "./UserCard";

type Props = {
  children: ReactNode;
};

const ModalSearchUser = ({ children }: Props) => {
  const [open, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const [searchResult, setSearchResult] = useState<TSearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  return (
    <>
      <button onClick={openModal} className={className.button}>
        <div className={`${className.iconContainer}`}>
          <MagnifyingGlassIcon />
        </div>
        <span className="hidden xl:inline">Search</span>
      </button>
      {open &&
        createPortal(
          <div className="fixed inset-0">
            <div
              onClick={closeModal}
              className="absolute inset-0 bg-background/50 backdrop-blur-sm"
            />
            <div className="relative min-h-screen w-full max-w-sm rounded-md border-r border-skin bg-background px-6 py-4 shadow backdrop-blur-sm">
              <div className="flex h-16 items-center">
                <h1 className="text-xl font-semibold">Search</h1>
              </div>
              <FormSearchUser
                setSearchResult={setSearchResult}
                open={open}
                setIsSearching={setIsSearching}
                setOpen={setOpen}
              />
              <div className="h-4" />
              <div className="flex flex-col gap-2">
                {!isSearching ? (
                  children
                ) : searchResult.length === 0 ? (
                  <p className="text-center text-skin-muted">User not found</p>
                ) : (
                  searchResult.map((user) => (
                    <UserCard isRemovable={false} user={user} key={user.id} />
                  ))
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default ModalSearchUser;
