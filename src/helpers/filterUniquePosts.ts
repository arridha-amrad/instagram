import { TUserPost } from "@/lib/drizzle/queries/fetchUserPosts";

export const filterUniqueUserPosts = (currPosts: TUserPost[]) => {
  const seenIds = new Set<string>();
  const posts = [] as TUserPost[];
  for (const post of currPosts) {
    if (!seenIds.has(post.id)) {
      posts.push(post);
      seenIds.add(post.id);
    }
  }
  return posts;
};
