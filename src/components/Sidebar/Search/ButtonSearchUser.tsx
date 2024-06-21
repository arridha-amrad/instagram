"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { className } from "../styles";
import { useState } from "react";
import { createPortal, useFormState } from "react-dom";
import SearchInput from "./SearchInput";
import { searchUser } from "./action";
import Avatar from "@/components/Avatar";
import Link from "next/link";
import UserCard from "./UserCard";

const initialState = {
  data: [],
};

const ButtonSearchUser = () => {
  const [open, setOpen] = useState(false);
  const openModal = () => {
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
  };
  const [state, action] = useFormState(searchUser, initialState);

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
              <form action={action}>
                <SearchInput />
              </form>
              <div className="h-4" />
              <div className="flex flex-col gap-2">
                {state.data.map(({ avatar, name, username, id }) => (
                  <UserCard
                    key={id}
                    avatar={avatar}
                    closeModal={closeModal}
                    name={name}
                    username={username}
                    userId={id}
                  />
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default ButtonSearchUser;
