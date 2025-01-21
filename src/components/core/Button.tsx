"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";
import MySpinner from "../Spinner";

type Props = {
  children: ReactNode;
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, isLoading = false, ...props }: Props) => {
  return (
    <button
      {...props}
      disabled={isLoading}
      className={cn(
        "inline-flex justify-center gap-2 rounded-md bg-skin-fill px-3 py-2 text-sm font-medium leading-5 text-white transition-all duration-200 ease-linear disabled:brightness-125",
        props.className,
      )}
    >
      {isLoading ? <MySpinner className="w-5" /> : children}
    </button>
  );
};

export default Button;
