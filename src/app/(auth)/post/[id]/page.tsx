import Avatar from "@/components/Avatar";
import Carousel from "@/app/(auth)/(home)/Post/Carousel";
import Comments from "@/components/Post/Post/Comments";
import CommentsProvider from "@/components/Providers/CommentsProvider";
import { fetchComments } from "@/lib/drizzle/queries/comments/fetchComments";
import { fetchPost } from "@/lib/drizzle/queries/posts/fetchPost";
import { fetchPostMetadata } from "@/lib/drizzle/queries/posts/fetchPostMetadata";
import { getAuth } from "@/lib/next.auth";
import { formatDistanceToNowStrict } from "date-fns";
import { Metadata } from "next";
import Link from "next/link";
import ButtonLikePost from "./components/ButtonLike";
import FormComment from "./components/FormComment";
import SumComment from "./components/SumComments";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const post = await fetchPostMetadata(id);
  return {
    title: `Instagram Post by ${post?.username} added at ${new Intl.DateTimeFormat("en-US").format(post?.createdAt)} • Instagram`,
    description: `Instagram post created by ${post?.username}`,
  };
}

const Page = async ({ params }: Props) => {
  const session = await getAuth();
  const id = (await params).id;

  const [post, comments] = await Promise.all([
    await fetchPost({
      postId: id,
      userId: session?.user.id,
    }),
    await fetchComments({
      postId: id,
      userId: session?.user.id,
    }),
  ]);

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
    <CommentsProvider total={post.sumComments} data={comments}>
      <main className="px flex min-h-screen w-full max-w-xl flex-col px-4 pb-20">
        <section className="flex h-[80px] w-max items-center gap-3">
          <Avatar url={post.avatar} />
          <Link
            href={`/${post.username}`}
            className="font-semibold hover:underline"
          >
            {post.username}
          </Link>
          <p className="text-sm text-skin-muted">{post.location}</p>
          <div className="aspect-square w-1 rounded-full bg-neutral-500" />
          <h2 className="text-sm text-skin-muted">
            {formatDistanceToNowStrict(post.createdAt)}
          </h2>
        </section>
        <Carousel isFirstPost urls={post.urls.map((u) => u.url)} />
        <section className="space-y-1">
          <div className="py-2">
            <ButtonLikePost
              isLiked={post.isLiked}
              postId={post.id}
              total={post.sumLikes}
            />
          </div>
          <FormComment session={session} />
        </section>
        <SumComment />
        <Comments showForm />
      </main>
    </CommentsProvider>
  );
};

export default Page;
