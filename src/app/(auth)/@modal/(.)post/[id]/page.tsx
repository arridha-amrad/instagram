import { fetchComments } from "@/fetchings/comments";
import Modal from "./Modal";

type Props = {
  params: {
    id: string;
  };
};

const Page = async ({ params }: Props) => {
  const comments = await fetchComments({ postId: params.id });
  return <Modal comments={comments} id={params.id} />;
};

export default Page;
