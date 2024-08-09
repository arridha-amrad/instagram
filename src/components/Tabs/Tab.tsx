"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  href: string;
  name: string;
  username: string;
};

export default function Tab({ href, name, username }: Props) {
  const pathname = usePathname();
  const target = href === "" ? `/${username}` : `/${username}/${href}`;
  const isActive = target === pathname;

  return (
    <div className={cn("p-4", isActive ? "border-t" : "")} key={name}>
      <Link
        scroll={false}
        className={cn(isActive ? "font-semibold" : "font-normal")}
        href={target}
      >
        {name}
      </Link>
    </div>
  );
}
