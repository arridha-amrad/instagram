import db from "@/lib/drizzle/db";

export const fetchPosts = async (userId?: string) => {
  const posts = await db.query.PostsTable.findMany({
    with: {
      likes: true,
      owner: {
        columns: {
          avatar: true,
          email: true,
          id: true,
          name: true,
          username: true,
        },
      },
      comments: {
        orderBy({ createdAt }, { desc }) {
          return desc(createdAt);
        },
        with: {
          owner: {
            columns: {
              avatar: true,
              email: true,
              id: true,
              name: true,
              username: true,
            },
          },
        },
      },
    },
  }).then((data) => {
    return data.map((result) => ({
      ...result,
      isLiked: userId
        ? !!result.likes.find((like) => like.userId === userId)
        : false,
      likes: result.likes.length,
      sumComments: result.comments.length,
    }));
  });
  return posts;
};

export type TPost = Awaited<ReturnType<typeof fetchPosts>>[number];
