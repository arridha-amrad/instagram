"use client";

import Button from "@/components/core/Button";
import { follow as fl } from "@/lib/actions/follow";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  userId: string;
  isFollow: boolean;
};

const ButtonFollow = ({ userId, isFollow }: Props) => {
  const pathname = usePathname();
  const [isPending, setPending] = useState(false);

  const follow = async () => {
    setPending(true);
    try {
      await fl({ followId: userId, pathname });
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
