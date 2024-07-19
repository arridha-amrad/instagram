import { TOwner } from "@/fetchings/type";
import { StateCreator } from "zustand";
import { PostSlice } from "./createPostSlice";
import { FollowerSlice } from "./createFollowerSlice";

export type Data = TOwner & { isFollow: boolean };

export interface FollowingSlice {
    followings: Data[];
    total: number;
    page: number;
    isLoadingFollowings: boolean;
    setFollowings: (followings: Data[], total: number) => void;
    setMoreFollowings: (followings: Data[]) => void;
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
    setFollowings(followers, total) {
        set((state) => {
            state.followers = followers;
            state.total = total;
            state.page = 1;
            state.isLoading = false;
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
