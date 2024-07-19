import { TOwner } from "@/fetchings/type";
import { StateCreator } from "zustand";
import { PostSlice } from "./createPostSlice";
import { FollowingSlice } from "./createFollowingSlice";

export type Data = TOwner & { isFollow: boolean };

export interface FollowerSlice {
  followers: Data[];
  total: number;
  page: number;
  isLoadingFollowers: boolean;
  setFollowers: (followers: Data[], total: number) => void;
  setMoreFollowers: (followers: Data[]) => void;
}

export const createFollowerSlice: StateCreator<
  PostSlice & FollowerSlice & FollowingSlice,
  [["zustand/devtools", never], ["zustand/immer", never]],
  [],
  FollowerSlice
> = (set) => ({
  followers: [],
  isLoadingFollowers: true,
  page: 0,
  total: 0,
  users: [],
  setFollowers(followers, total) {
    set((state) => {
      state.followers = followers;
      state.total = total;
      state.page = 1;
      state.isLoadingFollowers = false;
    });
  },
  setMoreFollowers(followers) {
    set((state) => {
      state.followers = [...state.followers, ...followers].filter(
        (v, i, arr) => arr.findIndex((val) => val.id === v.id) === i,
      );
    });
  },
});
