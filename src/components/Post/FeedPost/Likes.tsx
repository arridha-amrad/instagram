"use client";

import Wrapper from "@/components/core/ModalWrapper";
import MySpinner from "@/components/Spinner";
import UserWithFollowButtonCard from "@/components/UserWithFollowButtonCard";
import { useSessionStore } from "@/stores/Session";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { actionFetchLikedPostUsers } from "@/lib/next-safe-action/actionFetchLikedPostUsers";
import { TUserIsFollow } from "@/lib/drizzle/queries/type";

type Props = {
  postId: string;
  total: number;
};

const TotalLikes = ({ postId, total }: Props) => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<TUserIsFollow[]>([]);
  const { session } = useSessionStore();
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const openModal = async () => {
    setOpen(true);
    setIsLoading(true);
    try {
      const response = await actionFetchLikedPostUsers({
        postId,
        authUserId: session?.user.id,
      });
      if (response?.data) {
        setUsers(response.data.data);
      }
    } catch (err) {
      toast.error("Something went wrong", { theme });
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
                    isFollow={user.isFollow}
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
