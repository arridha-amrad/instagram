import { sumComments } from "@/helpers/comments";
import db from "@/lib/drizzle/db";
import { TComment, TPost } from "@/lib/drizzle/queries/type";

type Params = {
  authUserId?: string;
  postId: string;
};

export const fetchPost = async ({
  postId,
  authUserId,
}: Params): Promise<TPost | null> => {
  const post = await db.query.PostsTable.findFirst({
    where({ id }, { eq }) {
      return eq(id, postId);
    },
    orderBy({ createdAt }, { desc }) {
      return desc(createdAt);
    },
    with: {
      likes: true,
      comments: {
        limit: 10,
        orderBy(fields, operators) {
          return operators.desc(fields.createdAt);
        },
        with: {
          likes: true,
          owner: {
            columns: {
              avatar: true,
              id: true,
              username: true,
            },
          },
          replies: {
            columns: {
              id: true,
            },
          },
        },
      },
      owner: {
        columns: {
          avatar: true,
          id: true,
          username: true,
        },
      },
    },
  });

  if (!post) return null;

  const comments: TComment[] = post.comments.map((c) => {
    const data = {
      ...c,
      isLiked: !!c.likes.find((l) => l.userId === authUserId) ?? false,
      sumLikes: c.likes.length,
      sumReplies: c.replies.length,
      replies: [],
    };
    const { likes, ...props } = data;
    return props;
  });

  const populatedPost = {
    ...post,
    comments,
    sumLikes: post?.likes.length,
    sumComments: sumComments(post.comments),
    isLiked: !!post.likes.find((like) => like.userId === authUserId) ?? false,
  };

  const { likes, ...props } = populatedPost;

  return props;
};
