import { auth } from "@/auth";
import Avatar from "@/components/Avatar";
import Carousel from "@/components/Post/FeedPost/Carousel";
import PostProvider from "@/components/Providers/PostProvider";
import { fetchPost } from "@/lib/drizzle/queries/fetchPost";
import { HeartIcon } from "@heroicons/react/24/solid";
import { formatDistanceToNowStrict } from "date-fns";
import { Metadata } from "next";
import Link from "next/link";

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const session = await auth();
  const post = await fetchPost({
    postId: params.id,
    authUserId: session?.user.id,
  });

  return {
    title: `Instagram Post by ${post?.owner.username} added at ${new Intl.DateTimeFormat("en-US").format(post?.createdAt)} • Instagram`,
    description: `Instagram post created by ${post?.owner.username}`,
  };
}

const Page = async ({ params }: Props) => {
  const session = await auth();

  const post = await fetchPost({
    postId: params.id,
    authUserId: session?.user.id,
  });

  if (!post) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-3xl font-semibold text-skin-muted">
          Oops, Post not found
        </p>
      </div>
    );
  }

  return (
    <PostProvider post={post}>
      <main className="px flex min-h-screen w-full max-w-xl flex-col px-4 pb-20">
        <section className="flex h-[80px] w-max items-center gap-3">
          <Avatar url={post.owner.avatar} />
          <div>
            <Link
              href={`/${post.owner.username}`}
              className="font-semibold hover:underline"
            >
              {post.owner.username}
            </Link>
            <p className="text-sm text-skin-muted">{post.location}</p>
          </div>
          <div className="aspect-square w-1 rounded-full bg-neutral-500" />
          <h2 className="text-sm text-skin-muted">
            {formatDistanceToNowStrict(post.createdAt)}
          </h2>
        </section>
        <Carousel urls={post.urls.map((u) => u.url)} />
        <section className="flex items-center justify-center">
          <button>
            <HeartIcon className="w-7 fill-pink-500" />
          </button>
        </section>
        {/* <Action /> */}
        {/* <CommentForm />
        <TotalComments /> */}
        {/* <section className="py-3">
          <Comments />
        </section> */}
      </main>
    </PostProvider>
  );
};

export default Page;
