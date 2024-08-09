"use client";

import UsersContainer from "@/components/UsersContainer";
import { TInfiniteResult, TUserIsFollow } from "@/lib/drizzle/queries/type";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  data: TInfiniteResult<TUserIsFollow>;
}

export default function ModalFollowings({ data }: Props) {
  const [followings, setFollowings] = useState<TUserIsFollow[]>(data.data);

  const router = useRouter();

  const closeModal = () => {
    router.back();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        onClick={closeModal}
        className="absolute inset-0 bg-background/50 backdrop-blur"
      />
      <UsersContainer
        title="Followings"
        users={followings}
        closeCallback={closeModal}
      />
    </div>
  );
}
