"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

type Props = {
  variant?: "floating" | "normal";
  errorMessage?: string;
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

const TextInput = ({
  label,
  errorMessage,
  variant = "floating",
  ...props
}: Props) => {
  return variant === "floating" ? (
    <div>
      <label
        htmlFor={props.id}
        className={cn(
          "relative block overflow-hidden rounded-md border bg-skin-input px-3 pt-3 shadow-sm focus-within:border-skin-primary focus-within:ring-1 focus-within:ring-skin-primary",
          errorMessage ? "border-skin-error" : "border-skin",
        )}
      >
        <input
          {...props}
          placeholder={label}
          className={cn(
            "peer h-10 w-full border-none bg-skin-input p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm",
          )}
        />

        <span
          className={cn(
            "absolute start-3 top-3 -translate-y-1/2 text-xs text-skin-muted transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs",
          )}
        >
          {label}
        </span>
      </label>
      {errorMessage && (
        <small className="px-1 text-skin-error">{errorMessage}</small>
      )}
    </div>
  ) : (
    <div className="space-y-1.5">
      <label
        htmlFor={props.id}
        className="block text-sm font-medium text-skin-base"
      >
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-md border border-skin bg-skin-input outline-none focus:border-transparent focus:ring-2 focus:ring-skin-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black"
      />
      {errorMessage && (
        <small className="px-1 text-skin-error">{errorMessage}</small>
      )}
    </div>
  );
};

export default TextInput;
