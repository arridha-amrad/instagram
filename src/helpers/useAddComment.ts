import { TComment, TCommentSchema, TOwner } from "@/fetchings/type";
import { User } from "next-auth";

type Params = {
  authUser: User;
  comment: TCommentSchema;
  setterFn: (comment: TComment) => void;
};

export default function setNewCommentOnClient({
  comment,
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
    ...comment,
    ...extra,
  });
}
