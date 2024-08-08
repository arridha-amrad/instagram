"use client";

import { usePathname } from "next/navigation";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import SearchInput from "./SearchInput";
import { useAction } from "next-safe-action/hooks";
import { actionSearchUser } from "@/lib/next-safe-action/searchUser/actionSearchUser";
import { useDebounce } from "use-debounce";
import { TSearchUser } from "@/lib/drizzle/queries/type";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Spinner from "@/components/Spinner";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setIsSearching: Dispatch<SetStateAction<boolean>>;
  setSearchResult: Dispatch<SetStateAction<TSearchUser[]>>;
}

export default function FormSearchUser({
  open,
  setOpen,
  setIsSearching,
  setSearchResult,
}: Props) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [searchKey, setSearchKey] = useState("");
  const [value] = useDebounce(searchKey, 500);
  const { theme } = useTheme();

  const { execute, isExecuting } = useAction(actionSearchUser, {
    onExecute: () => {
      setIsSearching(true);
    },
    onError: () => {
      toast.error("Something went wrong", { theme });
    },
    onSuccess: ({ data }) => {
      if (!data) return;
      console.log(data);
      setSearchResult(data);
    },
  });

  useEffect(() => {
    if (!!value) {
      formRef.current?.requestSubmit();
    }
  }, [value]);

  const pathname = usePathname();
  // useEffect(() => {
  //   if (open) {
  //     formRef.current?.reset();
  //     setIsSearching(false);
  //     setOpen(false);
  //   }
  // }, [pathname]);
  return (
    <form ref={formRef} action={execute}>
      <div className="relative">
        <label htmlFor="Search" className="sr-only">
          Search
        </label>
        <input
          name="searchKey"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          type="text"
          id="Search"
          placeholder="Search user..."
          className="mt-1.5 w-full resize-none rounded-md border border-skin bg-skin-input pe-10 outline-none focus:border-transparent focus:ring focus:ring-skin-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black"
        />
        {isExecuting ? (
          <button className="absolute right-2 top-5">
            <Spinner className="w-4" />
          </button>
        ) : (
          <button
            onClick={() => setSearchKey("")}
            className="absolute right-2 top-5"
          >
            <XMarkIcon className="aspect-square w-4" />
          </button>
        )}
      </div>
    </form>
  );
}
