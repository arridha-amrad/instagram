import { TOwner } from "@/fetchings/type";
import { StateCreator } from "zustand";
import { PostSlice } from "./createPostSlice";
import { FollowingSlice } from "./createFollowingSlice";
import { TInfiniteResult, TOwnerIsFollow } from "@/lib/drizzle/queries/type";

export type Data = TOwner & { isFollow: boolean };

export type FollowerSlice = {
  followers: TOwnerIsFollow[];
  total: number;
  page: number;
  isLoadingFollowers: boolean;
  setFollowers: (data: TInfiniteResult<TOwnerIsFollow[]>) => void;
  setMoreFollowers: (followers: Data[]) => void;
};

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
  setFollowers({ page, total, users }) {
    set((state) => {
      state.followers = users;
      state.page = page;
      state.total = total;
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
