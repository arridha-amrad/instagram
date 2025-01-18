import { TReply } from "@/lib/drizzle/queries/replies/fetchReplies";
import Reply from "./Reply";

type Props = {
  replies: TReply[];
  showForm?: boolean;
};

const Replies = ({ replies, showForm }: Props) => {
  return replies.map((r) => <Reply showForm={showForm} key={r.id} reply={r} />);
};

export default Replies;
