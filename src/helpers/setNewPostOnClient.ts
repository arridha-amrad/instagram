import { TOwner, TPost, TPostSchema } from "@/fetchings/type";
import { User } from "next-auth";

type Params = {
  authUser: User;
  post: TPostSchema;
  setterFn: (post: TPost) => void;
};

export default function setNewPostOnClient({
  authUser: { username, id, image, name },
  post,
  setterFn,
}: Params) {
  const extra = {
    owner: {
      avatar: image,
      id,
      name,
      username,
    } as TOwner,
    comments: [],
    isLiked: false,
    sumLikes: 0,
    sumComments: 0,
  };
  setterFn({
    ...post,
    ...extra,
  });
}
