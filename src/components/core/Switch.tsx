"use client";

import { InputHTMLAttributes } from "react";

type Props = {};

const Switch = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <label
      title="Dark Mode"
      htmlFor="AcceptConditions"
      className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-skin-fill"
    >
      <input
        {...props}
        type="checkbox"
        id="AcceptConditions"
        className="peer sr-only"
      />

      <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-all peer-checked:start-6"></span>
    </label>
  );
};

export default Switch;
