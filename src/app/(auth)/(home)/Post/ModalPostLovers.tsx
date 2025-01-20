"use client";

import ModalBox from "@/components/ModalBox";
import Spinner from "@/components/Spinner";
import UserWithFollowButtonCard from "@/components/UserCardWithFollowButton";
import {
  fetchPostLikes,
  TLikeUsers,
} from "@/lib/drizzle/queries/posts/fetchPostLikes";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useState, useTransition } from "react";

type Props = {
  postId: string;
  total: number;
  sessionUserId: string;
};

export default function ModalPostLovers({
  postId,
  sessionUserId,
  total,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<TLikeUsers[]>([]);

  const fetchLovers = async () => {
    startTransition(async () => {
      const response = await fetchPostLikes({
        postId,
        authUserId: sessionUserId,
      });
      if (response.data) {
        setUsers(response.data);
      }
    });
  };

  return (
    <>
      <button
        onClick={async () => {
          setOpen(true);
          await fetchLovers();
        }}
        className="space-x-1"
      >
        <span className="font-semibold">{total}</span>
        <span className="text-sm">{total > 1 ? "likes" : "like"}</span>
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-background/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center px-4 py-10">
          <DialogPanel className="flex w-full max-w-sm items-center justify-center">
            <ModalBox title="Likes">
              {isPending ? (
                <div className="flex items-center justify-center py-4">
                  <Spinner className="w-6" />
                </div>
              ) : (
                users.map((user) => (
                  <UserWithFollowButtonCard
                    sessionUserId={sessionUserId}
                    key={user.id}
                    user={user}
                  />
                ))
              )}
            </ModalBox>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
