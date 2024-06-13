"use server";

import { fetchReplies } from "@/fetchings/replies";

export const getCommentReplies = async (
  { commentId, userId }: { commentId: string; userId?: string },
  prevState: any,
) => {
  try {
    const replies = await fetchReplies({ commentId, userId });
    return {
      data: replies,
      type: "success",
    };
  } catch (err) {
    console.log(err);
    return {
      data: [],
      type: "error",
    };
  }
};
