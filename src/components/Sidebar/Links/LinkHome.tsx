"use client";

import Link from "next/link";
import { className } from "../styles";
import { HomeIcon } from "@heroicons/react/24/outline";
import { HomeIcon as Home } from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LinkHome = () => {
  const href = "/";
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link className={`${className.button}`} href={href}>
      <div className={`${className.iconContainer}`}>
        {isActive ? <Home /> : <HomeIcon />}
      </div>
      <span className={cn("hidden xl:inline", isActive && "font-semibold")}>
        Home
      </span>
    </Link>
  );
};

export default LinkHome;
