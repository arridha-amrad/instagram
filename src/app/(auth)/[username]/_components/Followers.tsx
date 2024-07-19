"use client";

import Spinner from "@/components/Spinner";
import UserWithFollowButtonCard from "@/components/UserWithFollowButtonCard";
import Modal from "@/components/core/ModalWrapper";
import { actionFetchFollowers } from "@/lib/next-safe-action/actionFetchFollowers";
import { useSessionStore } from "@/stores/SessionStore";
import { useEffect, useState } from "react";
import { Data } from "./Followers/store";

type Props = {
  total: number;
  userId: string;
};

export default function Followers({ total, userId }: Props) {
  const [followers, setFollowers] = useState<Data[]>([]);
  const [loading, setLoading] = useState(false);
  const { session } = useSessionStore();
  const [open, setOpen] = useState(false);

  const close = async () => {
    setOpen(false);
  };

  const openModal = async () => {
    setOpen(true);
    setLoading(true);
    try {
      const result = await actionFetchFollowers({
        userId,
        authUserId: session?.user.id,
      });
      if (result?.data) {
        setFollowers(result.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
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
          <div className="relative w-full max-w-sm rounded-md border border-skin bg-background">
            <div>
              <div className="space-x-2 border-b border-skin py-2 text-center">
                <h1 className="inline text-sm font-semibold">Followers</h1>
              </div>
              <div className="max-h-[500px] min-h-[100px] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center pt-4">
                    <Spinner />
                  </div>
                ) : (
                  <>
                    {followers.length === 0 && (
                      <div className="flex h-full items-center justify-center pt-4">
                        <p className="text-sm">You have no followers</p>
                      </div>
                    )}
                    {followers.map((user) => (
                      <UserWithFollowButtonCard
                        isFollow={user.isFollow}
                        key={user.id}
                        user={user}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
