import { User } from "next-auth";
import { StateCreator } from "zustand";
import { PostSlice } from "./post-slice";

export interface UserSlice {
  user: User | null;
  setUser: (user: User) => void;
}

export const createUserSlice: StateCreator<
  UserSlice & PostSlice,
  [["zustand/devtools", never], ["zustand/immer", never]],
  [],
  UserSlice
> = (set) => ({
  user: null,
  setUser(user) {
    set(() => ({ user }));
  },
});
