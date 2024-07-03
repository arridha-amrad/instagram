"use client";

import Modal from "@/components/core/Modals/Wrapper";
import { TOwner } from "@/fetchings/type";
import { useEffect, useState } from "react";
import MySpinner from "@/components/Spinner";
import Card from "../Card";
import { useFollowerStore } from "./store";

type Props = {
  username: string;
  total: number;
  followers: TOwner[];
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
          <div className="relative h-max max-h-[500px] min-h-[200px] w-full max-w-sm rounded-md border border-skin bg-background">
            {isLoading ? (
              <MySpinner />
            ) : (
              <div>
                <div className="space-x-2 border-b border-skin py-2 text-center">
                  <h1 className="inline text-sm font-semibold">Followers</h1>
                </div>
                {users.map((user) => (
                  <Card key={user.id} user={user} />
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
