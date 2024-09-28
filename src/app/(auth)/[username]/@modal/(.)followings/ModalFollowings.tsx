"use client";

import UsersContainer from "@/components/UsersContainer";
import { TFollowing } from "@/lib/drizzle/queries/fetchUserFollowings";

import { useRouter } from "next/navigation";

interface Props {
  data: TFollowing[];
}

export default function ModalFollowings({ data }: Props) {
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
        users={data}
        closeCallback={closeModal}
      />
    </div>
  );
}
