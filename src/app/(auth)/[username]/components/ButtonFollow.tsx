"use client";

import { actionFollow } from "@/actions/user/actionFollow";
import Button from "@/components/core/Button";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/stores/SessionStore";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  userId: string;
  isFollow: boolean;
};

const ButtonFollow = ({ userId, isFollow }: Props) => {
  const pathname = usePathname();
  const { session } = useSessionStore();
  const [isPending, setPending] = useState(false);

  const follow = async () => {
    setPending(true);
    try {
      await actionFollow({
        authId: session?.user.id ?? "",
        pathname,
        userId,
      });
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      onClick={follow}
      className={cn(
        "w-24",
        isFollow && "bg-neutral-100 text-skin-base dark:bg-neutral-700",
      )}
      isLoading={isPending}
      type="submit"
    >
      {isFollow ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default ButtonFollow;
