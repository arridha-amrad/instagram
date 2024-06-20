"use client";

import MySpinner from "@/components/Spinner";
import Button from "@/components/core/Button";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

type Props = {
  isFollow: boolean;
};

const ButtonFollowSubmit = ({ isFollow }: Props) => {
  const { pending } = useFormStatus();
  return (
    <Button
      className={cn(
        "w-24",
        isFollow && "bg-neutral-100 text-skin-base dark:bg-neutral-700",
      )}
      disabled={pending}
      type="submit"
    >
      {pending ? <MySpinner /> : isFollow ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default ButtonFollowSubmit;
