import { TUserPost } from "@/lib/drizzle/queries/posts/fetchUserPosts";

export const createUserPostsMatrix = (
  matrixLength: number,
  currPosts: TUserPost[],
) => {
  const result: TUserPost[][] = [];
  for (let i = 0; i < currPosts.length; i++) {
    const newArr: TUserPost[] = [];
    for (let j = 0; j < matrixLength; j++) {
      if (currPosts[i]) {
        newArr.push(currPosts[i]);
      }
      if (j === matrixLength - 1) {
        result.push(newArr);
      } else {
        i += 1;
      }
    }
  }
  return result;
};
