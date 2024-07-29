"use client";

import { useSessionStore } from "@/stores/Session";
import { Session } from "next-auth";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
  session: Session | null;
};

export default function AppProvider({ children, session }: Props) {
  const { setSession } = useSessionStore();

  useEffect(() => {
    if (session) {
      setSession(session);
    }
  }, [session]);

  return children;
}
