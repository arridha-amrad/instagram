"use client";

import { TSearchUser } from "@/fetchings/type";
import UserCard from "./UserCard";
import { removeAllFromHistories } from "./action";
import { useSession } from "next-auth/react";

type Props = {
  histories: TSearchUser[];
};

const Histories = ({ histories }: Props) => {
  const { data } = useSession();

  const action = removeAllFromHistories.bind(null, {
    userId: data?.user.id ?? "",
  });
  return (
    <div>
      <section className="flex items-center justify-between py-4 text-sm">
        <div className="font-medium">Recent</div>
        {histories.length >= 1 && (
          <form action={action}>
            <button type="submit" className="font-semibold">
              Clear all
            </button>
          </form>
        )}
      </section>
      <section>
        {histories.length === 0 ? (
          <p className="py-4 text-center text-skin-muted">No Search History</p>
        ) : (
          histories.map(({ searchUser: { avatar, id, name, username } }) => (
            <UserCard
              key={id}
              name={name}
              userId={id}
              username={username}
              avatar={avatar}
            />
          ))
        )}
      </section>
    </div>
  );
};

export default Histories;
