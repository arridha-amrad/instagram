"use client";

import Spinner from "@/components/Spinner";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { InputHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

type Props = InputHTMLAttributes<HTMLInputElement>;

const SearchInput = (props: Props) => {
  const status = useFormStatus();
  return (
    <div className="relative h-14">
      <div className="absolute inset-y-0 left-0 aspect-square h-14">
        <button className="flex h-full w-full items-center justify-center">
          {status.pending ? (
            <Spinner />
          ) : (
            <MagnifyingGlassIcon className="aspect-square w-6" />
          )}
        </button>
      </div>
      <label htmlFor="Search" className="sr-only">
        Search
      </label>
      <input
        {...props}
        type="text"
        id="Search"
        placeholder="Search user..."
        className="h-full w-full resize-none rounded-md border border-skin bg-skin-input py-2 ps-14 text-lg outline-none focus:border-transparent focus:ring focus:ring-skin-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black"
      />
    </div>
  );
};

export default SearchInput;
