import Avatar from "@/components/Avatar";
import { TSearchUser } from "@/lib/drizzle/queries/type";
import ButtonRemove from "./ButtonRemove";
import ButtonSaveToHistory from "./ButtonSaveToHistory";

type Props = {
  user: TSearchUser;
  isRemovable: boolean;
};

const UserCard = ({
  user: { avatar, name, username, id },
  isRemovable,
}: Props) => {
  return (
    <div className="flex gap-3 rounded-md px-2 py-2 hover:bg-skin-fill/20">
      <div className="flex-none">
        <Avatar url={avatar} />
      </div>
      <div className="flex-1 text-sm">
        <ButtonSaveToHistory userId={id} username={username} />
        <p className="text-skin-muted">{name}</p>
      </div>
      {isRemovable && <ButtonRemove userId={id} />}
    </div>
  );
};

export default UserCard;
