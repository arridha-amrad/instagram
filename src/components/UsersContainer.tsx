"use client";

import { TUserIsFollow } from "@/lib/drizzle/queries/type";
import UserWithFollowButtonCard from "./UserWithFollowButtonCard";

type Props = {
  users: TUserIsFollow[];
  sessionUserId: string;
  title: string;
};

export default function UsersContainer({ users, sessionUserId, title }: Props) {
  return (
    <div className="relative w-full max-w-md rounded-lg border border-skin bg-background">
      <div className="relative space-x-2 border-b border-skin py-3 text-center">
        <h1 className="font-semibold tracking-wide">{title}</h1>
      </div>
      <div className="max-h-[500px] overflow-y-auto p-3">
        {users.map((user) => (
          <UserWithFollowButtonCard
            sessionUserId={sessionUserId}
            key={user.id}
            user={user}
          />
        ))}
      </div>
    </div>
  );
}
