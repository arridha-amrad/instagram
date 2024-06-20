import { TProfile } from "@/fetchings/type";
import db from "@/lib/drizzle/db";
import { PostsTable } from "@/lib/drizzle/schema";
import { eq, sql } from "drizzle-orm";
import Profile from "@/components/ProfilePage/Profile";
import Posts from "@/components/ProfilePage/Posts";

type Props = {
  params: {
    username: string;
  };
};

const fetchUser = async (username: string) => {
  let myUser: TProfile | null = null;
  const user = await db.query.UsersTable.findFirst({
    columns: {
      id: true,
      avatar: true,
      name: true,
      username: true,
    },
    where(fields, operators) {
      return operators.eq(fields.username, username);
    },
  });

  if (user) {
    const [{ sumPosts }] = await db
      .select({
        sumPosts: sql<number>`count(${PostsTable.id})`,
      })
      .from(PostsTable)
      .where(eq(PostsTable.userId, user.id));

    myUser = { ...user, sumPosts };
  }
  return myUser;
};

const Page = async ({ params }: Props) => {
  const user = await fetchUser(params.username);

  if (!user) {
    return (
      <div>
        <h1>Oops, User not found</h1>
      </div>
    );
  }

  return (
    <main className="w-full py-4">
      <Profile user={user} />
      <Posts userId={user.id} />
    </main>
  );
};

export default Page;
