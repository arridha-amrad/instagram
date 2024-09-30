"use client";

import { TComment } from "@/lib/drizzle/queries/fetchComments";
import { useComments } from "@/stores/useComments";
import { ReactNode, useEffect } from "react";

type Props = {
  data: TComment[];
  children: ReactNode;
};

export default function CommentsProvider({ children, data }: Props) {
  const { setComments } = useComments();

  useEffect(() => {
    setComments(data);
  }, []);

  return children;
}
