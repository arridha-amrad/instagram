import Image from "next/image";

type Props = {
  url?: string | null;
};

const Avatar = ({ url }: Props) => {
  const defaultAvatar = `${process.env.BASE_URL!}/default.jpg`;

  return (
    <div className="w-12 aspect-square rounded-full border border-skin overflow-hidden">
      <Image
        className="object-cover w-full h-full"
        alt="avatar"
        width={100}
        height={100}
        loading="lazy"
        src={url && url !== "null" ? url : defaultAvatar}
      />
    </div>
  );
};

export default Avatar;
