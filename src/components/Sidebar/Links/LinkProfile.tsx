"use client";

import Link from "next/link";
import { className } from "../styles";
import { useSession } from "next-auth/react";
import Avatar from "@/components/Avatar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LinkProfile = () => {
  const { data: session } = useSession();
  const href = `/${session?.user.username}`;
  const pathname = usePathname();
  const isActive = href === pathname;
  return (
    <Link
      className={className.button}
      href={`/${session?.user.username}` ?? "/"}
    >
      <Avatar url={session?.user.image} className="w-8" />
      <span className={cn("hidden xl:inline", isActive && "font-semibold")}>
        Profile
      </span>
    </Link>
  );
};

export default LinkProfile;
