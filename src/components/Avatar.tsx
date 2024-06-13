import Image from "next/image";
import DefaultAvatar from "@/images/default.jpg";

type Props = {
  url?: string | null;
};

const Avatar = ({ url }: Props) => {
  return (
    <div className="aspect-square w-[40px] overflow-hidden rounded-full border border-skin">
      <Image
        alt="avatar"
        width={50}
        height={50}
        className="h-full w-full object-cover"
        src={url && url !== "null" ? url : DefaultAvatar}
      />
    </div>
  );
};

export default Avatar;
