import Reply from "@/components/Reply";
import { TReply } from "@/fetchings/type";
import { TInfiniteResult } from "@/lib/drizzle/queries/type";

type Props = {
  replies: TInfiniteResult<TReply>;
};

const Replies = ({ replies }: Props) => {
  return replies.data.map((r) => <Reply key={r.id} reply={r} />);
};

export default Replies;
