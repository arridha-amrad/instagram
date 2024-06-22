import Image from "next/image";
import DefaultAvatar from "@/images/default.jpg";
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = {
  url?: string | null;
} & HTMLAttributes<HTMLDivElement>;

const Avatar = ({ url, ...props }: Props) => {
  return (
    <div
      className={cn(
        "aspect-square w-[40px] overflow-hidden rounded-full",
        props.className,
      )}
    >
      <Image
        alt="avatar"
        width={300}
        height={300}
        className="h-full w-full object-cover"
        src={url && url !== "null" ? url : DefaultAvatar}
      />
    </div>
  );
};

export default Avatar;
