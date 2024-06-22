"use client";

import Link from "next/link";
import { className } from "../styles";
import Avatar from "@/components/Avatar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User } from "next-auth";

type Props = {
  user: User;
};

const LinkProfile = ({ user }: Props) => {
  const href = `/${user.username}`;
  const pathname = usePathname();
  const isActive = href === pathname;
  return (
    <Link className={className.button} href={`/${user.username}` ?? "/"}>
      <Avatar url={user.image} className="w-8" />
      <span className={cn("hidden xl:inline", isActive && "font-semibold")}>
        Profile
      </span>
    </Link>
  );
};

export default LinkProfile;
