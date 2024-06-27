import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { PostSlice, createPostSlice } from "./post-slice";
import { UserSlice, createUserSlice } from "./user-slice";

export const useBoundStore = create<UserSlice & PostSlice>()(
  devtools(
    immer((...a) => ({
      ...createUserSlice(...a),
      ...createPostSlice(...a),
    })),
    {
      enabled: process.env.NODE_ENV === "development",
      store: "instagram-store",
      name: "ari ganteng",
    },
  ),
);
