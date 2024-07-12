"use client";

import MySpinner from "@/components/Spinner";
import UserWithFollowButtonCard from "@/components/UserWithFollowButtonCard";
import { useEffect, useState } from "react";
import { fetchLikes, User } from "./action";
import Wrapper from "@/components/core/ModalWrapper";

type Props = {
  postId: string;
  total: number;
};

const TotalLikes = ({ postId, total }: Props) => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const openModal = async () => {
    setOpen(true);
    const response = await fetchLikes({
      postId,
    });
    if (response?.data) {
      setUsers(response?.data);
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

              {users.length === 0 ? (
                <div className="pt-4">
                  <MySpinner />
                </div>
              ) : (
                users.map((user) => (
                  <UserWithFollowButtonCard
                    isFollow={user.isFollow}
                    key={user.user.id}
                    user={user.user}
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
