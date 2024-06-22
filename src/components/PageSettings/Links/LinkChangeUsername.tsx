"use client";

import { cn } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LinkChangeUsername = () => {
  const href = "/settings/change-username";
  const pathname = usePathname();
  const isActive = href === pathname;
  return (
    <Link
      style={{ width: 320 - 70 }}
      href="/settings/change-username"
      className={cn(
        "flex h-12 items-center gap-3 rounded-md px-4 hover:bg-skin-fill/50",
        isActive && "bg-skin-fill/50",
      )}
    >
      <UserIcon className="square w-7" />
      <span className="text-sm">Change Username</span>
    </Link>
  );
};

export default LinkChangeUsername;
