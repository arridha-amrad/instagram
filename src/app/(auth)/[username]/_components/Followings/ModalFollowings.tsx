"use client";

import Modal from "@/components/core/Modals/Wrapper";
import { TOwner } from "@/fetchings/type";
import { useEffect, useState } from "react";
import { useFollowingsStore } from "./store";
import Card from "../Card";
import MySpinner from "@/components/Spinner";

type Props = {
  username: string;
  total: number;
  followings: TOwner[];
};

export default function ModalFollowings({ total, followings }: Props) {
  const { setUsers, users, isLoading } = useFollowingsStore();
  useEffect(() => {
    setUsers(followings);
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
        Followings
      </button>
      {open && (
        <Modal closeModal={close}>
          <div className="relative h-max max-h-[500px] w-full max-w-sm rounded-md border border-skin bg-background">
            {isLoading ? (
              <MySpinner />
            ) : (
              <div>
                <div className="space-x-2 border-b border-skin py-2 text-center">
                  <h1 className="inline text-sm font-semibold">Followings</h1>
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
