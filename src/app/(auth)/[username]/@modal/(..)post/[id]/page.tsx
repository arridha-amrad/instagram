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
  return <ModalPostExpanded comments={comments} id={params.id} />;
};

export default Page;
