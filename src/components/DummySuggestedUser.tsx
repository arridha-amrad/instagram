"use client";

import Avatar from "@/components/Avatar";
import Image from "next/image";

type Props = {
  avatar: string;
  username: string;
  name: string;
};

const DummySuggestedUser = ({ name, username, avatar }: Props) => {
  return (
    <div className="flex w-full items-center justify-between px-4">
      <div className="flex items-start justify-start gap-3">
        <Avatar url={avatar} />
        <div className="text-sm">
          <h1 className="font-semibold">{username}</h1>
          <p className="text-skin-muted">{name}</p>
        </div>
      </div>
      <button className="text-sm font-medium text-skin-inverted">follow</button>
    </div>
  );
};

export default DummySuggestedUser;
