"use client";

import { InputHTMLAttributes } from "react";

type Props = {
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

const Checkbox = ({ label, ...props }: Props) => {
  return (
    <label
      htmlFor={props.id}
      className="flex cursor-pointer text-skin-muted text-sm items-start gap-4"
    >
      <div className="flex items-center">
        &#8203;
        <input
          {...props}
          type="checkbox"
          className="size-4 bg-background focus:checked:bg-skin-fill rounded checked:bg-skin-fill focus:ring-skin hover:checked:bg-skin-fill outline-none cursor-pointer focus:ring-skin-primary/70 focus:ring-offset-white dark:focus:ring-offset-black border-skin"
        />
      </div>
      {label}
    </label>
  );
};

export default Checkbox;
