"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  title: string;
};

export default function ModalBox({ title, children }: Props) {
  return (
    <div className="relative w-full max-w-sm rounded-lg border border-skin bg-background">
      <div className="relative space-x-2 border-b border-skin py-3 text-center">
        <h1 className="font-semibold tracking-wide">{title}</h1>
      </div>
      <div className="max-h-[500px] w-full max-w-sm overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
