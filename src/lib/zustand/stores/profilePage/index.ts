import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { FollowerSlice, createFollowerSlice } from "./createFollowerSlice";
import { PostSlice, createPostSlice } from "./createPostSlice";
import { createFollowingsSlice, FollowingSlice } from "./createFollowingSlice";

const useBoundProfileStore = create<
  PostSlice & FollowerSlice & FollowingSlice
>()(
  devtools(
    immer((...a) => ({
      ...createPostSlice(...a),
      ...createFollowerSlice(...a),
      ...createFollowingsSlice(...a),
    })),
    {
      anonymousActionType: "useProfile",
      name: "Profile Store",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);

export default useBoundProfileStore;
