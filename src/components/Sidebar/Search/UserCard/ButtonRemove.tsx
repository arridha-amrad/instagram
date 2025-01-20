"use client";

import { removeUserFromSearchHistory } from "@/lib/actions/user";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

interface Props {
  userId: string;
}

export default function ButtonRemove({ userId }: Props) {
  const pathname = usePathname();
  const remove = async () => {
    await removeUserFromSearchHistory.bind(null, userId, pathname)();
  };
  return (
    <button
      onClick={async (e) => {
        e.stopPropagation();
        await remove();
      }}
      type="submit"
      className="flex-none"
    >
      <XMarkIcon className="aspect-square w-5" />
    </button>
  );
}
