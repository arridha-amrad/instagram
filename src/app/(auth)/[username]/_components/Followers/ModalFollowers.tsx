"use client";

import MySpinner from "@/components/Spinner";
import Modal from "@/components/core/Modals/Wrapper";
import { useEffect, useState } from "react";
import { Data, useFollowerStore } from "./store";
import UserWithFollowButtonCard from "@/components/UserWithFollowButtonCard";

type Props = {
  username: string;
  total: number;
  followers: Data[];
};

export default function ModalFollowers({ total, followers }: Props) {
  const { setUsers, users, isLoading } = useFollowerStore();
  useEffect(() => {
    setUsers(followers);
  }, []);
  const [open, setOpen] = useState(false);
  const close = () => {
    setOpen(false);
  };
  const openModal = () => {
    setOpen(true);
  };
  useEffect(() => {
    if (open) {
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.documentElement.classList.remove("overflow-hidden");
    }
  }, [open]);
  return (
    <>
      <button onClick={openModal}>
        <span className="pr-1 font-semibold">{total} </span>
        Followers
      </button>
      {open && (
        <Modal closeModal={close}>
          <div className="relative h-max max-h-[500px] min-h-[100px] w-full max-w-sm rounded-md border border-skin bg-background">
            {isLoading ? (
              <MySpinner />
            ) : (
              <div>
                <div className="space-x-2 border-b border-skin py-2 text-center">
                  <h1 className="inline text-sm font-semibold">Followers</h1>
                </div>
                {users.length === 0 && (
                  <div className="flex h-full items-center justify-center pt-4">
                    <p className="text-sm">You have no followers</p>
                  </div>
                )}
                {users.map((user) => (
                  <UserWithFollowButtonCard
                    isFollow={user.isFollow}
                    key={user.id}
                    user={user}
                  />
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
