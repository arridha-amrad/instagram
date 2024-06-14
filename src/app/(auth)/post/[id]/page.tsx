import { auth } from "@/auth";
import { fetchPost } from "@/fetchings/fetchPost";
import PostDetail from "./PostDetail";
import { redirect } from "next/navigation";
import { TPost } from "@/fetchings/type";

type Props = {
  params: {
    id: string;
  };
};

const Page = async ({ params }: Props) => {
  const session = await auth();
  let post: TPost | null = null;
  try {
    post = await fetchPost({ postId: params.id, userId: session?.user.id });
  } catch (err) {
    redirect("/");
  }

  if (!params.id) {
    redirect("/");
  }
  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      {!post ? (
        <div>
          <h1>Post not found</h1>
        </div>
      ) : (
        <PostDetail post={post} />
      )}
    </main>
  );
};

export default Page;
