import { sumComments } from "@/helpers/comments";
import db from "@/lib/drizzle/db";
import { TPost } from "@/lib/drizzle/queries/type";
import { fetchComments } from "./fetchComments";

type Params = {
  authUserId?: string;
  postId: string;
};

export const fetchPost = async ({
  postId,
  authUserId,
}: Params): Promise<TPost | null> => {
  const getPost = async () => {
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
          orderBy(fields, operators) {
            return operators.desc(fields.createdAt);
          },
          columns: {
            id: true,
          },
          with: {
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

    return post;
  };

  const [post, comments] = await Promise.all([
    getPost(),
    fetchComments({ page: 1, postId, authUserId }),
  ]);

  if (!post) return null;

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
