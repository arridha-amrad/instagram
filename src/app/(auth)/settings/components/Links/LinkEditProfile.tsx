"use client";

import { cn } from "@/lib/utils";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LinkEditProfile = () => {
  const href = "/settings";
  const pathname = usePathname();
  const isActive = href === pathname;
  return (
    <Link
      style={{ width: 320 - 70 }}
      href="/settings"
      className={cn(
        "flex h-12 items-center gap-3 rounded-md px-4 hover:bg-skin-fill/50",
        isActive && "bg-skin-fill/50",
      )}
    >
      <UserCircleIcon className="square w-7" />
      <span className="text-sm">Edit Profile</span>
    </Link>
  );
};

export default LinkEditProfile;
