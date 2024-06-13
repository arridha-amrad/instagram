import { TOwner, TReply, TReplySchema } from "@/fetchings/type";
import { User } from "next-auth";

type Params = {
  authUser: User;
  reply: TReplySchema;
  setterFn: (comment: TReply) => void;
};

export default function setNewReplyOnClient({
  reply,
  authUser,
  setterFn,
}: Params) {
  const extra = {
    replies: [],
    sumReplies: 0,
    sumRepliesRemaining: 0,
    isLiked: false,
    sumLikes: 0,
    owner: {
      avatar: authUser.image,
      id: authUser.id,
      name: authUser.name,
      username: authUser.username,
    } as TOwner,
  };

  setterFn({
    ...reply,
    ...extra,
  });
}
