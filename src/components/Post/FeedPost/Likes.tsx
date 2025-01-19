"use client";

import Wrapper from "@/components/core/ModalWrapper";
import MySpinner from "@/components/Spinner";
import UserWithFollowButtonCard from "@/components/UserWithFollowButtonCard";
import { loadMoreLovers } from "@/lib/actions/post";
import { TUserIsFollow } from "@/lib/drizzle/queries/type";
import { showToast } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  postId: string;
  total: number;
  sessionUserId: string;
};

const TotalLikes = ({ postId, total, sessionUserId }: Props) => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<TUserIsFollow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
  const openModal = async () => {
    setOpen(true);
    setIsLoading(true);
    try {
      const response = await loadMoreLovers.bind(
        null,
        pathname,
      )({
        postId,
      });
      if (response?.data) {
        setUsers(response.data.data);
      }
    } catch (err) {
      showToast("something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setOpen(false);
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
      <button onClick={openModal} className="space-x-1">
        <span className="font-semibold">{total}</span>
        <span className="text-sm">{total > 1 ? "likes" : "like"}</span>
      </button>
      {open && (
        <Wrapper closeModal={closeModal}>
          <div className="relative h-max max-h-[500px] min-h-[100px] w-full max-w-sm rounded-md border border-skin bg-background">
            <div>
              <div className="space-x-2 border-b border-skin py-2 text-center">
                <h1 className="inline text-sm font-semibold">Likes</h1>
              </div>
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <MySpinner className="w-6 fill-indigo-500" />
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
        </Wrapper>
      )}
    </>
  );
};

export default TotalLikes;
