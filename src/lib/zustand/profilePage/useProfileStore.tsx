import { TProfile } from "@/fetchings/type";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
  user: TProfile;
  isLoadingUser: boolean;
};

type Action = {
  setUser: (user: TProfile) => void;
  follow: () => void;
};

export const useProfileStore = create<State & Action>()(
  devtools(
    immer((set) => ({
      user: null,
      isLoadingUser: true,
      follow() {
        set((state) => {
          if (state.user) {
            if (state.user.isFollowed) {
              state.user.isFollowed = false;
              state.user.followings -= 1;
            } else {
              state.user.isFollowed = true;
              state.user.followings += 1;
            }
          }
        });
      },
      setUser(user) {
        set((state) => {
          state.user = user;
          state.isLoadingUser = false;
        });
      },
    })),
    {
      anonymousActionType: "profile_store",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);
