import { TInfiniteResult, TReply } from "@/lib/drizzle/queries/type";
import Reply from "./Reply";

type Props = {
  replies: TInfiniteResult<TReply>;
};

const Replies = ({ replies }: Props) => {
  return replies.data.map((r) => <Reply key={r.id} reply={r} />);
};

export default Replies;
