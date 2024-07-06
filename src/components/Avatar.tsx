import Image from "next/image";
import DefaultAvatar from "@/images/default.jpg";
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = {
  url?: string | null;
  isPriority?: boolean;
} & HTMLAttributes<HTMLDivElement>;

const Avatar = ({ url, isPriority = false, ...props }: Props) => {
  return (
    <div
      className={cn(
        "aspect-square w-[40px] overflow-hidden rounded-full",
        props.className,
      )}
    >
      <Image
        alt="avatar"
        priority={isPriority}
        width={300}
        height={300}
        className="h-full w-full object-cover"
        src={url && url !== "null" ? url : DefaultAvatar}
      />
    </div>
  );
};

export default Avatar;
