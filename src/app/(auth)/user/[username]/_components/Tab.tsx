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
  const target =
    href === "" ? `/user/${username}` : `/user/${username}/${href}`;
  const isActive = target === pathname;
  console.log({ name, isActive, pathname, target });

  return (
    <div className={cn("p-4", isActive ? "border-t" : "")} key={name}>
      <Link href={target}>{name}</Link>
    </div>
  );
}
