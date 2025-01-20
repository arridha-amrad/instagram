import Link from "next/link";
import React from "react";
import { saveUserToSearchHistory } from "@/lib/actions/user";
import { usePathname } from "next/navigation";

interface Props {
  userId: string;
  username: string;
}

export default function ButtonSaveToHistory({ userId, username }: Props) {
  const pathname = usePathname();
  const action = async () => {
    console.log("saving...");

    const result = await saveUserToSearchHistory.bind(
      null,
      pathname,
    )({
      searchId: userId,
    });
    console.log("saved");

    console.log(result);
  };
  return (
    <Link
      className="font-medium hover:underline"
      onClick={action}
      href={`/${username}`}
    >
      {username}
    </Link>
  );
}
