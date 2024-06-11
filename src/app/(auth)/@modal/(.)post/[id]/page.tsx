import { fetchComments } from "@/fetchings/comments";
import Modal from "./Modal";
import { auth } from "@/auth";

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
  return <Modal comments={comments} id={params.id} />;
};

export default Page;
