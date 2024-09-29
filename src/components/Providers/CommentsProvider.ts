"use client";

import { TComment } from "@/lib/drizzle/queries/fetchComments";
import { ReactNode } from "react";

type Props = {
  data: TComment[];
  children: ReactNode;
};

export default function CommentsProvider({ children, data }: Props) {
  console.log({ data });

  return children;
}
