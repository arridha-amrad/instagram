"use client";

import { TUserIsFollow } from "@/lib/drizzle/queries/type";
import { XMarkIcon } from "@heroicons/react/24/outline";
import UserWithFollowButtonCard from "./UserWithFollowButtonCard";

type Props = {
  closeCallback?: VoidFunction;
  users: TUserIsFollow[];
  title: string;
};

export default function UsersContainer({ users, closeCallback, title }: Props) {
  return (
    <div className="relative w-full max-w-md rounded-lg border border-skin bg-background">
      <div className="relative space-x-2 border-b border-skin py-3 text-center">
        <h1 className="font-semibold tracking-wide">{title}</h1>
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button onClick={closeCallback}>
            <XMarkIcon className="aspect-square w-5" />
          </button>
        </div>
      </div>
      <div className="max-h-[500px] overflow-y-auto p-3">
        {users.map((user) => (
          <UserWithFollowButtonCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
