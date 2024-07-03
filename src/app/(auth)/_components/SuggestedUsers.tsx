import Link from "next/link";
import DummySuggestedUser from "./DummySuggestedUser";
import { TOwner } from "@/fetchings/type";

type Props = {
  users: TOwner[];
};

const SuggestedUsers = ({ users }: Props) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-4 pb-4">
        <h1 className="text-sm font-semibold text-skin-muted">
          Suggested for you
        </h1>
        <Link href="/" className="text-sm font-medium text-skin-base">
          see all
        </Link>
      </div>
      <div className="mt-2 space-y-3">
        {users.map((user) => (
          <DummySuggestedUser
            avatar={user.avatar}
            name={user.name}
            username={user.username}
            key={user.id}
          />
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
