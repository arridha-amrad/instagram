"use client";

import { TComment } from "@/lib/drizzle/queries/fetchComments";
import { useComments } from "@/stores/useComments";
import { ReactNode, useEffect } from "react";

type Props = {
  data: TComment[];
  total: number;
  children: ReactNode;
};

export default function CommentsProvider({ children, data, total }: Props) {
  const { setComments, setTotal } = useComments();

  useEffect(() => {
    setComments(data);
    setTotal(total);
  }, []);

  return children;
}
