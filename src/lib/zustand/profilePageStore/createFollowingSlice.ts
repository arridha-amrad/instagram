import { TOwner } from "@/fetchings/type";
import { StateCreator } from "zustand";
import { PostSlice } from "./createPostSlice";
import { FollowerSlice } from "./createFollowerSlice";
import { TOwnerIsFollow } from "@/lib/drizzle/queries/type";

export type Data = TOwner & { isFollow: boolean };

export interface FollowingSlice {
  followings: TOwnerIsFollow[];
  total: number;
  page: number;
  isLoadingFollowings: boolean;
  setFollowings: (followings: TOwnerIsFollow[], total: number) => void;
  setMoreFollowings: (followings: TOwnerIsFollow[]) => void;
}

export const createFollowingsSlice: StateCreator<
  PostSlice & FollowingSlice & FollowerSlice,
  [["zustand/devtools", never], ["zustand/immer", never]],
  [],
  FollowingSlice
> = (set) => ({
  followings: [],
  isLoadingFollowings: true,
  page: 0,
  total: 0,
  users: [],

  setFollowings(followings, total) {
    set((state) => {
      state.followings = followings;
      state.total = total;
      state.page = 1;
      state.isLoadingFollowings = false;
    });
  },

  setMoreFollowings(followers) {
    set((state) => {
      state.followers = [...state.followers, ...followers].filter(
        (v, i, arr) => arr.findIndex((val) => val.id === v.id) === i,
      );
    });
  },
});
