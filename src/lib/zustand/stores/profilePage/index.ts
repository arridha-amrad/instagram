import { create } from "zustand";
import createPostsSlice, { PostSlice } from "./usePostsStore";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const useBoundProfileStore = create<PostSlice>()(
  devtools(
    immer((...a) => ({
      ...createPostsSlice(...a),
    })),
  ),
);

export default useBoundProfileStore;
