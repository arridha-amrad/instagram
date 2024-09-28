"use client";

import UsersContainer from "@/components/UsersContainer";
import { TFollow } from "@/lib/drizzle/queries/fetchUserFollowers";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

type Props = {
  data: TFollow[];
};

export default function ModalFollowers({ data }: Props) {
  const router = useRouter();

  const closeModal = () => {
    router.back();
  };

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        onClick={closeModal}
        className="absolute inset-0 bg-background/50 backdrop-blur"
      />
      <UsersContainer
        title="Followers"
        users={data}
        closeCallback={closeModal}
      />
    </div>,
    document.body,
  );
}
