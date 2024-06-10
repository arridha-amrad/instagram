import Image from "next/image";
import DefaultAvatar from "@/images/default.jpg";

type Props = {
  url: string | null;
};

const Avatar = ({ url }: Props) => {
  return (
    <div className="w-[40px] aspect-square rounded-full border border-skin overflow-hidden">
      <Image
        alt="avatar"
        width={50}
        height={50}
        className="object-cover h-full w-full"
        src={url && url !== "null" ? url : DefaultAvatar}
      />
    </div>
  );
};

export default Avatar;
