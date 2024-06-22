"use client";

import Link from "next/link";
import { className } from "../styles";
import { CogIcon } from "@heroicons/react/24/outline";
import { CogIcon as Cog } from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LinkSettings = () => {
  const href = "/settings";
  const pathname = usePathname();
  const isActive = pathname.includes(href);
  return (
    <Link className={`${className.button}`} href={href}>
      <div className={`${className.iconContainer}`}>
        {isActive ? <Cog /> : <CogIcon />}
      </div>
      <span className={cn("hidden xl:inline", isActive && "font-semibold")}>
        Settings
      </span>
    </Link>
  );
};

export default LinkSettings;
