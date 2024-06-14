import DummySuggestedUser from "@/components/DummySuggestedUser";
import Link from "next/link";

const users = [
  {
    avatar:
      "https://images.unsplash.com/photo-1586351012965-861624544334?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGdpcmx8ZW58MHx8MHx8fDA%3D",
    name: "ひなたうづまき",
    username: "hinata__desu",
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1662351997685-57a21379d966?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fGdpcmx8ZW58MHx8MHx8fDA%3D",
    name: "桜ヒュウガ",
    username: "sakura.hyuuga",
  },
  {
    avatar:
      "https://plus.unsplash.com/premium_photo-1673792686302-7555a74de717?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGdpcmx8ZW58MHx8MHx8fDA%3D",
    name: "木村ユウ",
    username: "yuuuua__",
  },
  {
    avatar:
      "https://plus.unsplash.com/premium_photo-1668319915384-3cccf7689bef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z2lybHxlbnwwfHwwfHx8MA%3D%3D",
    name: "Jane Doe",
    username: "jane_doe",
  },
  {
    avatar:
      "https://plus.unsplash.com/premium_photo-1670282393309-70fd7f8eb1ef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGdpcmx8ZW58MHx8MHx8fDA%3D",
    name: "Sarah Ellish",
    username: "els_sarah",
  },
];

const SuggestedUsers = () => {
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
            key={user.name}
          />
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
