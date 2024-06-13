import Reply from "@/components/Reply";
import { TReply } from "@/fetchings/type";

type Props = {
  replies: TReply[];
};

const Replies = ({ replies }: Props) => {
  return replies.map((r) => <Reply key={r.id} reply={r} />);
};

export default Replies;
