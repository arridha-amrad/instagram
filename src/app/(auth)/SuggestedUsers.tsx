import Link from "next/link";
import DummySuggestedUser from "./components/DummySuggestedUser";

const users = [
  {
    avatar:
      "https://images.pexels.com/photos/763546/pexels-photo-763546.jpeg?auto=compress&cs=tinysrgb&w=600",
    name: "ひなたうづまき",
    username: "hinata__desu",
  },
  {
    avatar:
      "https://images.pexels.com/photos/1271702/pexels-photo-1271702.jpeg?auto=compress&cs=tinysrgb&w=600",
    name: "桜ヒュウガ",
    username: "sakura.hyuuga",
  },
  {
    avatar:
      "https://images.pexels.com/photos/20529826/pexels-photo-20529826/free-photo-of-wanita-perempuan-kaum-wanita-potret.jpeg?auto=compress&cs=tinysrgb&w=600",
    name: "木村ユウ",
    username: "yuuuua__",
  },
  {
    avatar:
      "https://images.pexels.com/photos/3939478/pexels-photo-3939478.jpeg?auto=compress&cs=tinysrgb&w=600",
    name: "Jane Doe",
    username: "jane_doe",
  },
  {
    avatar:
      "https://images.pexels.com/photos/25212021/pexels-photo-25212021/free-photo-of-mode-jalanan.jpeg?auto=compress&cs=tinysrgb&w=600",
    name: "Sarah Ellish",
    username: "els_sarah",
  },
];

const SuggestedUsers = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-4">
        <h1 className="font-semibold text-skin-muted text-sm">
          Suggested for you
        </h1>
        <Link href="/" className="text-skin-base text-sm font-medium">
          see all
        </Link>
      </div>
      <div className="space-y-3 mt-2">
        {users.map((user) => (
          <DummySuggestedUser
            avatar={user.avatar}
            name={user.name}
            username={user.username}
            key={user.name}
          />
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
