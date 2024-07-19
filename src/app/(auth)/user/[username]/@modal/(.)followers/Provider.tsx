"use client";

import { TInfiniteResult, TOwnerIsFollow } from "@/lib/drizzle/queries/type";
import useBoundProfileStore from "@/lib/zustand/stores/profilePage";
import { ReactNode, useEffect } from "react";

const Provider = ({
    children,
    data,
}: {
    children: ReactNode;
    data: TInfiniteResult<TOwnerIsFollow[]>;
}) => {
    const { setFollowers } = useBoundProfileStore();
    useEffect(() => {
        setFollowers(data);
    }, []);
    return children;
};

export default Provider;
