"use client";

import Spinner from "@/components/Spinner";
import UserWithFollowButtonCard from "@/components/UserWithFollowButtonCard";
import { loadMoreLovers } from "@/lib/actions/post";
import { TLikeUsers } from "@/lib/drizzle/queries/posts/fetchPostLikes";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<TLikeUsers[]>([]);
  const fetchLovers = async () => {
    startTransition(async () => {
      const response = await loadMoreLovers.bind(
        null,
        pathname,
      )({
        postId,
      });
      if (response?.data) {
        setUsers(response.data.data);
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
        <div className="fixed inset-0 flex w-screen items-center justify-center px-4 py-10">
          <DialogPanel className="w-full max-w-sm space-y-4 bg-background">
            <div className="relative h-max max-h-[500px] min-h-[100px] w-full rounded-md border border-skin bg-background">
              <div>
                <div className="space-x-2 border-b border-skin py-2 text-center">
                  <h1 className="inline text-sm font-semibold">Likes</h1>
                </div>
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
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
