"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Props = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, ...props }: Props) => {
  return (
    <button
      {...props}
      className={cn(
        "px-3 py-2 gap-2 leading-5 disabled:brightness-125 duration-200 transition-all ease-linear font-medium rounded-md bg-skin-fill text-sm text-white",
        props.className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
