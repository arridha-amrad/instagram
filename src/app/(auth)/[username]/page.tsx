import { TProfile } from "@/fetchings/type";
import db from "@/lib/drizzle/db";
import { PostsTable } from "@/lib/drizzle/schema";
import { eq, sql } from "drizzle-orm";
import Profile from "./Profile";
import Image from "next/image";
import {
  ChatBubbleOvalLeftIcon,
  DocumentDuplicateIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as Heart } from "@heroicons/react/24/solid";
import Link from "next/link";

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

const fetchUserPosts = async (userId: string) => {
  const posts = await db.query.PostsTable.findMany({
    with: {
      comments: {
        columns: {
          id: true,
        },
      },
      likes: true,
    },
    orderBy(fields, operators) {
      return operators.desc(fields.createdAt);
    },
    where(fields, operators) {
      return operators.eq(fields.userId, userId);
    },
  }).then((result) => {
    return result.map((data) => ({
      ...data,
      sumComments: data.comments.length,
      isLiked: !!data.likes.find((like) => like.userId === userId),
      sumLikes: data.likes.length,
    }));
  });
  return posts;
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

  const posts = await fetchUserPosts(user?.id);

  return (
    <main className="w-full py-4">
      <Profile user={user} />
      <section className="grid w-full grid-cols-3 gap-3 pt-10">
        {posts.map((post) => (
          <Link
            key={post.id}
            scroll={false}
            href={`/post/${post.id}`}
            className="relative aspect-square overflow-hidden rounded-md"
          >
            <Image
              src={post.urls[0].url}
              alt="post_image"
              width={300}
              height={300}
              className="h-full w-full object-cover"
            />
            {post.urls.length > 1 && (
              <div className="absolute right-2 top-2">
                <DocumentDuplicateIcon className="aspect-square w-5" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 hover:opacity-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {post.isLiked ? (
                    <Heart className="aspect-square w-8 fill-pink-600" />
                  ) : (
                    <HeartIcon className="aspect-square w-8" />
                  )}
                  <p>{post.sumLikes}</p>
                </div>
                <div className="flex items-center gap-2">
                  <ChatBubbleOvalLeftIcon className="aspect-square w-8 -scale-x-100" />
                  <p>{post.sumComments}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default Page;
