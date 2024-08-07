"use client";

import UsersContainer from "@/components/UsersContainer";
import useBoundProfileStore from "@/lib/zustand/profilePageStore";
import { useRouter } from "next/navigation";

export default function ModalFollowings() {
  const { followings } = useBoundProfileStore();
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
