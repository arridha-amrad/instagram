import { TReply } from "@/lib/drizzle/queries/fetchReplies";
import Reply from "./Reply";

type Props = {
  replies: TReply[];
};

const Replies = ({ replies }: Props) => {
  return replies.map((r) => <Reply key={r.id} reply={r} />);
};

export default Replies;
