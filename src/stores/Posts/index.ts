import { create } from "zustand";
import { createDetailSlice, DetailSlice } from "./detailSlice";
import { createFeedSlice, FeedSlice } from "./feedSlice";
import { createUserSlice, UserSlice } from "./userSlice";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const usePostsStore = create<DetailSlice & FeedSlice & UserSlice>()(
  devtools(
    immer((...a) => ({
      ...createDetailSlice(...a),
      ...createFeedSlice(...a),
      ...createUserSlice(...a),
    })),
    {
      anonymousActionType: "usePostsStore",
      name: "Posts Store",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);

export default usePostsStore;
