"use client";

import { searchUser } from "@/lib/actions/user";
import { TSearch } from "@/lib/drizzle/queries/users/searchUser";
import { Dialog, DialogBackdrop, DialogPanel, Input } from "@headlessui/react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAction } from "next-safe-action/hooks";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { className } from "../styles";
import UserCard from "./UserCard";

export default function ModalSearch({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [value, { isPending: isLoading }] = useDebounce(query, 1000);
  const formRef = useRef<HTMLFormElement | null>(null);

  const [users, setUsers] = useState<TSearch[]>([]);

  useEffect(() => {
    if (!!value) {
      formRef.current?.requestSubmit();
    }
  }, [value]);

  const { execute, isPending } = useAction(searchUser, {
    onSuccess({ data }) {
      if (data) {
        setUsers(data);
      }
    },
  });

  const pathname = usePathname();
  useEffect(() => {
    setOpen(false);
    setQuery("");
  }, [pathname]);

  return (
    <>
      <button onClick={() => setOpen(true)} className={className.button}>
        <div className={`${className.iconContainer}`}>
          <MagnifyingGlassIcon />
        </div>
        <span className="hidden xl:inline">Search</span>
      </button>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setQuery("");
        }}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-background/30 backdrop-blur" />
        <div className="fixed inset-0 flex w-screen items-start justify-center py-10">
          <DialogPanel className="flex h-full max-h-[600px] min-h-96 w-full max-w-lg flex-col space-y-4 overflow-hidden rounded-lg border border-skin bg-background">
            <form action={execute} ref={formRef} className="p-2">
              <div className="relative h-14">
                <div className="absolute inset-y-0 left-0">
                  <button
                    type="button"
                    disabled
                    className="flex aspect-square h-full items-center justify-center"
                  >
                    <MagnifyingGlassIcon className="aspect-square w-7" />
                  </button>
                </div>
                <Input
                  value={query}
                  name="key"
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  placeholder="Search user..."
                  className="h-full w-full rounded-lg border border-skin bg-skin-input px-4 py-2 pl-14 text-lg ring-skin-primary focus:ring-2"
                />
              </div>
            </form>
            <div className="px-4">
              {isLoading() || isPending ? (
                <h1 className="animate-infinite animate-ease-linear animate-pulse text-sm">
                  loading ...
                </h1>
              ) : (
                <h1 className="">
                  Search Result
                  {value && (
                    <span className="italic">
                      &nbsp; for <q>{value}</q>
                    </span>
                  )}
                </h1>
              )}
            </div>

            <div className="flex w-full flex-1 flex-col gap-2 overflow-auto px-4 pb-6">
              {query ? (
                !!users ? (
                  users.map((user) => (
                    <UserCard key={user.id} user={user} isRemovable={false} />
                  ))
                ) : (
                  <div>
                    <h1>User not found</h1>
                  </div>
                )
              ) : (
                children
              )}
            </div>
          </DialogPanel>
        </div>
        <div className="fixed right-5 top-5">
          <button
            onClick={() => {
              setOpen(false);
              setQuery("");
            }}
            className="relative cursor-pointer rounded-full border border-skin bg-background p-2"
          >
            <XMarkIcon className="w-7" />
          </button>
        </div>
      </Dialog>
    </>
  );
}
