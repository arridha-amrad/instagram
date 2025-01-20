"use client";

import Link from "next/link";
import { className } from "../styles";
import { MagnifyingGlassIcon as Mgi } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";

const LinkSearch = () => {
  const href = "/search";
  const pathname = usePathname();
  const isActive = pathname === href;
  const setRouteCookie = () => {
    if (!isActive) {
      Cookies.set("prevRoute", pathname, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
      });
    }
  };
  return (
    <Link
      onClick={setRouteCookie}
      className={`${className.button}`}
      href={href}
      scroll={false}
    >
      <div className={`${className.iconContainer}`}>
        {isActive ? <MagnifyingGlassIcon /> : <Mgi />}
      </div>
      <span className={cn("hidden xl:inline", isActive && "font-semibold")}>
        Search
      </span>
    </Link>
  );
};

export default LinkSearch;
