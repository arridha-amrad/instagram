"use client";

import UserCard from "./UserCard";
import ButtonRemoveAll from "./ButtonRemoveAll";
import { TSearchUser } from "@/lib/drizzle/queries/type";

type Props = {
  data: TSearchUser[];
};

const Histories = ({ data }: Props) => {
  return (
    <div>
      <section className="flex items-center justify-between py-4 text-sm">
        <div className="font-medium">Recent</div>
        {data.length >= 1 && <ButtonRemoveAll />}
      </section>
      <section>
        {data.length === 0 ? (
          <p className="py-4 text-center text-skin-muted">No Search History</p>
        ) : (
          data.map((user) => (
            <UserCard isRemovable={true} user={user} key={user.id} />
          ))
        )}
      </section>
    </div>
  );
};

export default Histories;
