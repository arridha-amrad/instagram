"use client";

import { cn } from "@/lib/utils";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LinkChangePassword = () => {
  const href = "/settings/change-password";
  const pathname = usePathname();
  const isActive = href === pathname;
  return (
    <Link
      style={{ width: 320 - 70 }}
      href="/settings/change-password"
      className={cn(
        "flex h-12 items-center gap-3 rounded-md px-4 hover:bg-skin-fill/50",
        isActive && "bg-skin-fill/50",
      )}
    >
      <LockClosedIcon className="square w-7" />
      <span className="text-sm">Change Password</span>
    </Link>
  );
};

export default LinkChangePassword;
