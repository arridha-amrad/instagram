import { TOwner } from "@/fetchings/type";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type Data = TOwner & { isFollow: boolean };

type State = {
  users: Data[];
  isLoading: boolean;
};

type Action = {
  setUsers: (users: Data[]) => void;
  addUsers: (users: Data[]) => void;
};

export const useFollowerStore = create<State & Action>()(
  devtools(
    immer((set) => ({
      isLoading: true,
      users: [],
      addUsers(users) {
        set((state) => {
          state.users = [...state.users, ...users];
        });
      },
      setUsers(users) {
        set((state) => {
          state.users = users;
          state.isLoading = false;
        });
      },
    })),
    {
      enabled: process.env.NODE_ENV === "development",
      name: "Followers",
      anonymousActionType: "useFollowerStore",
    },
  ),
);
