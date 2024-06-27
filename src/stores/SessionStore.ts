import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { Session } from "next-auth";

interface Action {
  setSession: (session: Session) => void;
}

interface State {
  session: Session | null;
}

export const useSessionStore = create<State & Action>()(
  devtools(
    immer((set) => ({
      session: null,
      setSession(session) {
        set((state) => {
          state.session = session;
        });
      },
    })),
    {
      enabled: process.env.NODE_ENV === "development",
      anonymousActionType: "useSessionStore",
      name: "Session",
    },
  ),
);
