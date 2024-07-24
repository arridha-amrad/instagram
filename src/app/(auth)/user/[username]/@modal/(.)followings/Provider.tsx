"use client";

import { TInfiniteResult, TOwnerIsFollow } from "@/lib/drizzle/queries/type";
import useBoundProfileStore from "@/lib/zustand/profilePageStore";
import { ReactNode, useEffect } from "react";

const Provider = ({
  children,
  data,
}: {
  children: ReactNode;
  data: TInfiniteResult<TOwnerIsFollow[]>;
}) => {
  const { setFollowings } = useBoundProfileStore();

  useEffect(() => {
    setFollowings(data.users, data.total);
  }, []);

  return children;
};

export default Provider;
