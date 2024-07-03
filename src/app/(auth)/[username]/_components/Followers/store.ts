import { TOwner } from "@/fetchings/type";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
  users: TOwner[];
  isLoading: boolean;
};

type Action = {
  setUsers: (users: TOwner[]) => void;
  addUsers: (users: TOwner[]) => void;
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
