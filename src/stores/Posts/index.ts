import { create } from "zustand";
import { createDetailSlice, DetailSlice } from "./detailSlice";
import { createFeedSlice, FeedSlice } from "./feedSlice";
import { createProfileSlice, ProfileSlice } from "./profileSlice";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const usePostsStore = create<DetailSlice & FeedSlice & ProfileSlice>()(
  devtools(
    immer((...a) => ({
      ...createDetailSlice(...a),
      ...createFeedSlice(...a),
      ...createProfileSlice(...a),
    })),
    {
      anonymousActionType: "usePostsStore",
      name: "Posts Store",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);

export default usePostsStore;
