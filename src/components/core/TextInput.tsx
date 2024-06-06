"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

type Props = {
  errorMessage?: string;
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

const TextInput = ({ label, errorMessage, ...props }: Props) => {
  return (
    <div>
      <label
        htmlFor={props.id}
        className={cn(
          "relative block overflow-hidden rounded-md border px-3 pt-3 shadow-sm focus-within:border-skin-primary focus-within:ring-1 focus-within:ring-skin-primary",
          errorMessage ? "border-skin-error" : "border-skin"
        )}
      >
        <input
          {...props}
          placeholder={label}
          className="peer h-10 w-full border-none bg-transparent p-0 placeholder-transparent bg-skin-input focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
        />

        <span className="absolute start-3 top-3 -translate-y-1/2 text-xs transition-all peer-placeholder-shown:top-1/2 text-skin-muted peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
          {label}
        </span>
      </label>
      {errorMessage && (
        <small className="px-1 text-skin-error">{errorMessage}</small>
      )}
    </div>
  );
};

export default TextInput;
