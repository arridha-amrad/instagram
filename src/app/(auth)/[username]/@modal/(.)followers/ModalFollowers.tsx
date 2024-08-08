"use client";

import UsersContainer from "@/components/UsersContainer";
import { TInfiniteResult, TUserIsFollow } from "@/lib/drizzle/queries/type";
import useBoundProfileStore from "@/lib/zustand/profilePageStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  data: TInfiniteResult<TUserIsFollow>;
};

export default function ModalFollowers({ data }: Props) {
  const { followers, setFollowers } = useBoundProfileStore();
  useEffect(() => {
    setFollowers(data);
  }, []);
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
        title="Followers"
        users={followers}
        closeCallback={closeModal}
      />
    </div>
  );
}
