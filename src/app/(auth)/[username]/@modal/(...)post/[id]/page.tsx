import { fetchComments } from "@/fetchings/comments";
import { auth } from "@/auth";
import ModalPostExpanded from "@/components/core/Modals/ModalPostDetail";

type Props = {
  params: {
    id: string;
  };
};

const Page = async ({ params }: Props) => {
  const session = await auth();
  const comments = await fetchComments({
    postId: params.id,
    userId: session?.user.id,
  });
  // return <ModalPostExpanded comments={comments} id={params.id} />;
  return (
    <main className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div>
        <h1>Hello World</h1>
      </div>
    </main>
  );
};

export default Page;
